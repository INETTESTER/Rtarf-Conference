// conference_join_5.js
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

export function ConferenceJoin() {
    const url = 'https://uat-rtarf-conference.one.th/api/v1/conferences/join';
    const payload = JSON.stringify({
        slug: 'mcz-xfqg-qnc',
    });
    const params = {
        headers: {
            Authorization: 'Bearer mock-token-for-load-test',
            'Content-Type': 'application/json',
        },
        timeout: '300s',
    };
    const response = http.post(url, payload, params);

    const s = response.status;
    if (!KNOWN_STATUS.includes(s)) {
        if (s === 0) {
            console.error(`NETWORK ERROR | error_code=${response.error_code} | error=${response.error}`);
        } else {
            const label = STATUS_TEXT[s] || 'Unknown';
            console.error(`UNKNOWN HTTP ${s} | ${label} | body=${String(response.body).slice(0, 300)}`);
        }
    }

    return response;
}