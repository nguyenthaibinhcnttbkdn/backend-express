import { ENV } from "../../config";
const redis = {
  port: ENV.REDIS_PORT,
  host: ENV.REDIS_HOST,
};
export const queue_config = {
  QueueKey: [{ name: "Test Job", key: "TEST", thread: 3, job: "test", redis }],
};
