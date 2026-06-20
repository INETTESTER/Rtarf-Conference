// health_debug.js
import http from 'k6/http';

const KNOWN_STATUS = [200, 201, 204, 400, 401, 403, 404, 422, 429, 500, 502, 503, 504];

const STATUS_TEXT = {
    520: 'Web Server Returned an Unknown Error',
    521: 'Web Server Is Down',
    522: 'Connection Timed Out',
    523: 'Origin Is Unreachable',
    524: 'A Timeout Occurred',
    525: 'SSL Handshake Failed',
    526: 'Invalid SSL Certificate',
    527: 'Railgun Error',
    530: 'Origin DNS Error',
    408: 'Request Timeout',
    409: 'Conflict',
    410: 'Gone',
    413: 'Payload Too Large',
    418: "I'm a Teapot",
    421: 'Misdirected Request',
    423: 'Locked',
    425: 'Too Early',
    426: 'Upgrade Required',
    431: 'Request Header Fields Too Large',
    451: 'Unavailable For Legal Reasons',
    501: 'Not Implemented',
    505: 'HTTP Version Not Supported',
    507: 'Insufficient Storage',
    508: 'Loop Detected',
    511: 'Network Authentication Required',
};

// เปิด/ปิด debug log ของ request ที่สำเร็จด้วย __ENV.debug=1
const DEBUG_OK = __ENV.debug === '1';

export function HealthCheck() {
    const url = 'https://uat-rtarf-conference.one.th/api/health';
    const params = {
        timeout: '300s',
    };
    const response = http.get(url, params);

    const s = response.status;
    const t = response.timings;

    // รวม timing breakdown ใช้ซ้ำได้ทั้ง success/error
    const phase =
        `blocked=${t.blocked.toFixed(1)} ` +
        `connect=${t.connecting.toFixed(1)} ` +
        `tls=${t.tls_handshaking.toFixed(1)} ` +
        `send=${t.sending.toFixed(1)} ` +
        `wait=${t.waiting.toFixed(1)} ` +
        `recv=${t.receiving.toFixed(1)} ` +
        `total=${t.duration.toFixed(1)}`;

    if (!KNOWN_STATUS.includes(s)) {
        if (s === 0) {
            // network error — ดู error_code + remote + proto + timing phase
            console.error(
                `NETWORK ERROR | error_code=${response.error_code} | error=${response.error} | ` +
                `remote=${response.remote_ip}:${response.remote_port} | proto=${response.proto} | ` +
                `tls_ver=${response.tls_version} | phase[${phase}]`
            );
        } else {
            const label = STATUS_TEXT[s] || 'Unknown';
            const bodyText = response.body ? String(response.body).slice(0, 500) : '(empty)';
            console.error(
                `UNKNOWN HTTP ${s} | ${label} | remote=${response.remote_ip}:${response.remote_port} | ` +
                `proto=${response.proto} | phase[${phase}] | body=${bodyText}`
            );
        }
    } else if (DEBUG_OK) {
        // log request ที่สำเร็จด้วย (เปิดเมื่อ debug=1) — ดู baseline timing ตอนปกติ
        const bodyLen = response.body ? String(response.body).length : 0;
        console.log(
            `OK ${s} | remote=${response.remote_ip}:${response.remote_port} | proto=${response.proto} | ` +
            `tls_ver=${response.tls_version} | body_len=${bodyLen} | phase[${phase}]`
        );
    }

    return response;
}