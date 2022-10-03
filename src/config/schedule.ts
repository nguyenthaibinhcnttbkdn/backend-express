import * as dotEnv from "dotenv";

dotEnv.config();
console.log(process.env.NODE_ENV);
export const config_job = {
  scheduler: {
    sec: 1000,
    min: 60000,
    hour: 3600000,
    day: 3600000 * 24,
  },
  execJob: {
    TestJob: true,
  },
};
