import { difference } from "lodash";
import { getAllFunctionInPath, convertData } from "./common/help";

const getStringSame = (arrStr: string[], str: string): string => {
  for (const item of arrStr) {
    const splitItem = item.toLocaleLowerCase().split("");
    const splitStr = str.toLocaleLowerCase().split("");
    const diff1 = difference(splitItem, splitStr);
    const diff2 = difference(splitStr, splitItem);
    if (diff1.length + diff2.length <= 2) return item;
    if (diff1.length + diff2.length <= 2) return item;
  }
  return null;
};

(async () => {
  const func = getAllFunctionInPath(__dirname, "func");
  const argv = process.argv.slice(2);
  const props = {};
  argv.forEach((param) => {
    const [key, data] = param.split(":");
    if (data.split("=").length <= 1) {
      return (props[key] = convertData(data));
    }
    if (!props[key]) {
      props[key] = {};
    }
    data.split("&").forEach((item) => {
      const [_key, _value] = item.split("=");
      props[key][_key] = convertData(_value);
    });
  });
  const countFuncName = Object.keys(func).filter((name) => name.includes(props["func"])).length;
  switch (true) {
    case countFuncName > 1:
      console.table([
        {
          message: `Has ${countFuncName} functions same name`,
          "Function name": props["func"],
          resolve: "Please input exact name function file",
        },
      ]);
      break;
    case !!props["sprint"]:
      let functions = Object.keys(func).filter((item) => func[item].sprint === props["sprint"]);
      if (props["startAt"]) {
        const indexAt = functions.findIndex((i) => i.toLowerCase().includes(props["startAt"].toLowerCase()));
        if (indexAt === -1) {
          console.log(`Can not find ${props["startAt"]} function`);
          break;
        }
        functions = functions.slice(indexAt);
      }
      try {
        const functionNoUsername = functions.filter((item) => !func[item].username);
        if (!functionNoUsername.length) {
          for (const funcName of functions) {
            if (func[funcName].sprint === props["sprint"]) {
              if (func[funcName].requireParam) {
                console.log(`function ${funcName} is require params, please input params and run`);
                console.log(`npm run console func:${funcName} "params:[key]:[value]&[key]:[value]"\n`);
              } else {
                console.log(`Running console ${funcName} - username: ${func[funcName].username}`);
                console.time(funcName);
                await func[funcName].up(props);
                console.timeEnd(funcName);
              }
            }
          }
        }
        if (functionNoUsername.length) {
          console.table(
            functionNoUsername.map((item) => ({
              message: `Function not found username!`,
              "Function name": item,
              resolve: "Input exact name function file or fill username in the file.",
            }))
          );
        }
      } catch (error) {
        console.log(error);
      }
      break;
    default:
      Object.keys(func).forEach((funcName) => {
        func[funcName.split("-")[1] || funcName] = func[funcName];
      });
      try {
        if (func[props["func"]]) {
          console.log(`Running console ${props["func"]} - username: ${func[props["func"]].username}`);
          await func[props["func"]].up(props);
        } else {
          const funcSuggest = getStringSame(Object.keys(func), props["func"]);
          console.table([
            {
              message: `Function not found!`,
              "Function name": props["func"],
              ...(funcSuggest && {
                "Suggest func": funcSuggest.split("-").slice(-1)[0],
              }),
            },
          ]);
        }
      } catch (error) {
        console.log(error);
      }
      break;
  }
  process.exit();
})();
