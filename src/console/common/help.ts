const readline = require("readline");
const fs = require("fs");
const path = require("path");

type ParamProgress = {
  total: number;
  cursor: number;
  lengthProgress?: number;
  prefix?: string;
  title?: string;
};

const drawProgressBar = (params: ParamProgress) => {
  let { total, cursor, lengthProgress, prefix, title } = params;
  if (!lengthProgress) lengthProgress = process.stdout.columns - 30;
  if (!prefix) prefix = "";
  const percent = parseFloat(((cursor / total) * 100).toFixed(2));
  const percentPerOne = 100 / lengthProgress;
  let result = prefix ? `${prefix} ` : "";
  for (let i = 0; i < lengthProgress; i++) {
    if (i < percent / percentPerOne) {
      result += "█";
    } else {
      result += "░";
    }
  }
  if (percent < 100) {
    result += ` ${title || `${percent}%`}`;
  } else {
    result += ` ${title || "100%"}    \n`;
  }
  readline.cursorTo(process.stdout, 0);
  process.stdout.write(result);
};

const getAllFunctionInPath = (p: string, f: string) => {
  const pathStr = path.join(p, f);
  const basename = path.basename(__filename);
  const functions = {};

  fs.readdirSync(pathStr)
    .filter((file) => file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".ts")
    .forEach((file) => {
      functions[file.slice(0, -3)] = require(path.join(pathStr, file));
    });
  return functions;
};

const convertData = (value) => {
  if (/^\d+(.\d+)?$/gm.test(value)) return Number(value);
  if (["true", "false"].find((i) => i === value.toLowerCase())) return value.toLowerCase() === "true";
  return value;
};

export { drawProgressBar, getAllFunctionInPath, convertData };
