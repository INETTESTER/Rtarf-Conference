//=============================== import API =================================
import { sleep } from 'k6';
import { error_check } from '../check/check.js';
import { scenario } from 'k6/execution';
import { ConferenceList } from '../api/conference_list_1.js';
import { ConferenceCreateInstant } from '../api/conference_create_instant_2.js';
import { ConferenceCreateScheduled } from '../api/conference_create_scheduled_3.js';
import { ConferenceInfo } from '../api/conference_info_4.js';
import { CsatFeedback } from '../api/csat_feedback_5.js';
import { UserProfile } from '../api/user_profile_6.js';
import { ConferenceJoin } from '../api/conference_join_7.js';
import { HealthCheck } from '../api/healthcheck.js';
import { LoadtestHealth } from '../api/loadtest_health_9.js';



//============================================================================

export default function () {    //เรียกใช้ API ใน export default function
  // response = ConferenceList()
  response = ConferenceCreateInstant()
  // response = ConferenceCreateScheduled()
  // response = ConferenceInfo()
  // response = CsatFeedback()
  // response = UserProfile()
  // response = ConferenceJoin()
  // response = HealthCheck()
  // response = LoadtestHealth()

  error_check(response);
  sleep(1)
}











































































const cid = __ENV.cid || "1";
const id = __ENV.id || "1";
const projectname = __ENV.projectname || "1";
const user = __ENV.user || "1";
const durationx = __ENV.durationx || "1";
let response;
const scenariox = __ENV.scenariox || "1";
let options;
const vusx = Math.ceil(user / durationx);
if (scenariox == 1) {
  options = {
    http: {
      timeout: '300s'
    },
    insecureSkipTLSVerify: true,
    discardResponseBodies: false,
    scenarios: {
      contacts: {
        executor: 'per-vu-iterations',
        vus: vusx,
        iterations: durationx,
        maxDuration: '10m',
        gracefulStop: '120s',
      },
    },
  };
}
else if (scenariox == 2) {
  options = {
    http: {
      timeout: '300s'
    },
    insecureSkipTLSVerify: true,
    vus: user,
    duration: durationx + 's',
    gracefulStop: '120s',
  };
}
else if (scenariox == 3) {
  options = {
    http: {
      timeout: '300s'
    },
    insecureSkipTLSVerify: true,
    scenarios: {
      example_scenario: {
        executor: 'constant-arrival-rate',
        // rate: user,
        // timeUnit: durationx+'s',
        rate: vusx,
        timeUnit: '1s',
        preAllocatedVUs: user,
        duration: durationx + 's', // ระบุระยะเวลาที่ต้องการให้ทดสอบ
        gracefulStop: '120s',
      },
    },
  };
}
else if (scenariox == 4) {     // ⬅️ block ใหม่ที่เพิ่ม
  options = {
    http: { timeout: '300s' },
    insecureSkipTLSVerify: true,
    discardResponseBodies: false,
    scenarios: {
      ramp: {
        executor: 'ramping-arrival-rate',
        startRate: 0,
        timeUnit: '1s',
        preAllocatedVUs: vusx,
        maxVUs: vusx,
        stages: [
          { target: vusx, duration: '30s' },  // ไต่จาก 0 → vusx ใน 30 วิ
          { target: vusx, duration: '30s' },  // คงที่อีก 30 วิ
        ],
        gracefulStop: '120s',
      },
    },
  };
}
else {
  options = {
    insecureSkipTLSVerify: true,
    discardResponseBodies: true,
    scenarios: {
      contacts: {
        executor: 'per-vu-iterations',
        vus: vusx,
        iterations: durationx,
        maxDuration: '10m',
      },
    },
  };
}
export { options };