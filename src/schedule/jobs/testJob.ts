class TestJob {
  constructor() {
    console.log("Scheduler Test Job Init ....");
  }
  async process() {
    try {
      console.log("zooo day choi ae");
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
export default TestJob;
