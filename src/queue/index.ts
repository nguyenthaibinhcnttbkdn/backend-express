import { queue_config } from "./config/queue.config";
import { ENV } from "../config";
const queue = require("bull");
const path = require("path");
const { setQueues, BullAdapter } = require("bull-board");
const { QueueKey } = queue_config;

export const createQueue = (queue_params) => {
  const { job, key, redis, thread, name } = queue_params;
  if (!job) return false;
  // init queue with name and redis info
  queue_init[key] = new queue(name, { redis });
  // collect job file compatible with queue
  const jobFile = require(path.join(__dirname, `jobs/${job}.${process.env.START_MODE || "ts"}`));
  // config concurrency(thread) and processor
  queue_init[key].process(thread, jobFile);
  queue_init[key].on("completed", async (_job, result) => {
    console.log("job completed", job);
    await _job.remove();
  });
  setQueues([new BullAdapter(queue_init[key])]);
  return key;
};

// run when start service to create Queue by queue config
const queue_init = {};
QueueKey.forEach(createQueue);

export const getQueue = (queuePram) => {
  if (queue_init[queuePram.key.toUpperCase()]) {
    return queue_init[queuePram.key.toUpperCase()];
  }
  if (!queuePram.redis) {
    queuePram.redis = {
      port: ENV.REDIS_PORT,
      host: ENV.REDIS_HOST,
    };
  }
  if (!queuePram.name) {
    queuePram.name = queuePram.key.toUpperCase();
  }
  if (!queuePram.thread) {
    queuePram.thread = 1;
  }
  queuePram.key = queuePram.key.toUpperCase();
  if (!createQueue(queuePram)) return null;
  return queue_init[queuePram.key];
};
