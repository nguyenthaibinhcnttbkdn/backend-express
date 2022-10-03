const moment = require("moment");
import { jobs } from "./jobs";
import { config_job } from "../config";
class Scheduler {
  constructor() {}
  setTimeoutJob(job) {
    if (job.startAt) {
      // calculate start time
      let intervalTime;
      if (job.startAt === moment(job.startAt, "ddd hh:mm:SS").format("ddd HH:mm:SS")) {
        // ddd hh:mm:SS -> day of week (e.g Mon 20:00:00 = Monday 20:00:00)
        intervalTime = moment(job.startAt, "ddd hh:mm:SS").diff(moment());
      } else if (moment(job.startAt, "hh:mm:SS").isValid()) {
        intervalTime = moment(job.startAt, "hh:mm:SS").diff(moment());
      } else if (moment(job.startAt, "DD hh:mm:SS").isValid()) {
        intervalTime = moment(job.startAt, "DD hh:mm:SS").diff(moment());
      } else if (moment(job.startAt, "MM-DD hh:mm:SS").isValid()) {
        intervalTime = moment(job.startAt, "MM-DD hh:mm:SS").diff(moment());
      } else {
        intervalTime = 0;
      }
      console.log(`${job.name}-intervalTime-before === ${intervalTime}`);
      // run the this task immediatly if startat time is over
      if (intervalTime < 0) {
        if (intervalTime * -1 < job.interval) {
          intervalTime = job.interval + intervalTime;
        } else {
          intervalTime += job.interval * Math.ceil((intervalTime * -1) / job.interval);
        }
      }
      console.log(`${job.name}-intervalTime-after === ${intervalTime}`);

      // remove startAt attribute for next time
      Reflect.deleteProperty(job, "startAt");
      // set timeout to start this job again
      return setTimeout(this.executeJobSchedule.bind(this, job), intervalTime);
    } else {
      return setTimeout(this.executeJobSchedule.bind(this, job), job.interval);
    }
  }

  async executeJobSchedule(job) {
    if (config_job.execJob[job.name]) {
      try {
        await job.target.process();
        this.setTimeoutJob(job);
      } catch (error) {
        console.log(error);
        console.log("error", `Execute job ERROR: ${error}`);
        this.setTimeoutJob(job);
      }
    }
  }

  startJobs() {
    jobs.forEach((job) => {
      this.setTimeoutJob(job);
    });
  }
}

export default Scheduler;
