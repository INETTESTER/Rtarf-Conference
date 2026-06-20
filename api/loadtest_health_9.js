// loadtest_health_9.js
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

export function LoadtestHealth() {
    const url = 'http://192.168.100.21:30050/api/health'; // https://uat-rtarf-conference.one.th/loadtest/health
    const params = {
        timeout: '300s',
    };
    const response = http.get(url, params);

    const s = response.status;
    if (!KNOWN_STATUS.includes(s)) {
        if (s === 0) {
            // network error — ไม่มี body, ดู error_code + remote + proto + phase breakdown
            const t = response.timings;
            console.error(
                `NETWORK ERROR | error_code=${response.error_code} | error=${response.error} | ` +
                `remote=${response.remote_ip}:${response.remote_port} | proto=${response.proto} | ` +
                `tls_ver=${response.tls_version} | ` +
                `phase[blocked=${t.blocked.toFixed(1)} connect=${t.connecting.toFixed(1)} ` +
                `tls=${t.tls_handshaking.toFixed(1)} send=${t.sending.toFixed(1)} ` +
                `wait=${t.waiting.toFixed(1)} recv=${t.receiving.toFixed(1)} total=${t.duration.toFixed(1)}]`
            );
        } else {
            const label = STATUS_TEXT[s] || 'Unknown';
            const bodyText = response.body ? String(response.body).slice(0, 500) : '(empty)';
            console.error(`UNKNOWN HTTP ${s} | ${label} | body=${bodyText}`);
        }
    }

    return response;
}