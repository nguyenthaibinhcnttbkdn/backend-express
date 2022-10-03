(async () => {
  const fs = require("fs");
  const path = require("path");

  const params = process.argv.slice(2);
  let fileName: string;
  let sprint: string;
  let username: string;
  for (const param of params) {
    switch (true) {
      case param.includes("func="):
        fileName = [new Date().getTime(), param.replace("func=", "")].join("-");
        break;
      case param.includes("sprint="):
        sprint = param.replace("sprint=", "");
        break;
      case param.includes("username="):
        username = param.replace("username=", "");
        break;
      default:
        break;
    }
  }
  if (!fileName) {
    console.log("File name is not empty, please insert argument func=<file_name>");
    return null;
  }
  if (!username) {
    console.log("Username is not empty, please insert argument username=<your_name>");
    return null;
  }
  const templatePath = path.join(__dirname, "template/generateTemplate.ts");
  let templateContent = await fs.readFileSync(templatePath, {
    encoding: "utf8",
  });
  if (sprint) {
    templateContent = templateContent.replace("__SPRINT__", sprint);
  }
  templateContent = templateContent.replace("__USERNAME__", username);
  // File destination.txt will be created or overwritten by default.
  await fs.writeFileSync(path.join(__dirname, `func/${fileName}.ts`), templateContent, { encoding: "utf8" });
  console.log(path.join(__dirname, `func/${fileName}.ts`), "was created");
})();
