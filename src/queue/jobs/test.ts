module.exports = (job) => {
  console.log("zoo cai di", new Date().getSeconds());

  return new Promise((res, rej) => {
    setTimeout(() => {
      console.log("job", job.data);
      res(1);
    }, 1000);
  });
};
