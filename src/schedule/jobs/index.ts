import TestJob from "./testJob";
import { config_job } from "../../config";
export const jobs = [
  {
    name: "TestJob",
    target: new TestJob(),
    interval: config_job.scheduler.hour * 2,
    startAt: "00:00:00",
  },
];
