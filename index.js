const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const serverTemplate = require("./templates/serverTemplate");
const runtimeTemplate = require("./templates/runtimeTemplate");
const apiTemplate = require("./templates/apiTemplate");
const mochaTemplate = require("./templates/mochaTemplate");
const jestTemplate = require("./templates/jestTemplate");

function findPackageJson(startPath) {
  let currentPath = startPath;
  while (currentPath !== path.parse(currentPath).root) {
    const packageJsonPath = path.join(currentPath, "package.json");
    if (fs.existsSync(packageJsonPath)) {
      return path.dirname(packageJsonPath);
    }
    currentPath = path.dirname(currentPath);
  }
  return null;
}

function createModule(name) {
  const rootPath = path.join(process.cwd(), name);
  const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

  const files = [
    {
      path: path.join(rootPath, "server", `${name}.server.mjs`),
      content: serverTemplate(name, capitalizedName),
    },
    {
      path: path.join(rootPath, `${name}.runtime.js`),
      content: runtimeTemplate(name, capitalizedName),
    },
    {
      path: path.join(rootPath, "controller", `${name}.api.js`),
      content: apiTemplate(name, capitalizedName),
    },
    {
      path: path.join(rootPath, "server", `${name}.server.mocha.js`),
      content: mochaTemplate(name, capitalizedName),
    },
    {
      path: path.join(rootPath, `${name}.jest.js`),
      content: jestTemplate(name, capitalizedName),
    },
  ];

  for (const file of files) {
    fs.mkdirSync(path.dirname(file.path), { recursive: true });
    fs.writeFileSync(file.path, file.content);
  }

  console.log(`Module ${name} has been added.`);

  const packageJsonDirectory = findPackageJson(rootPath);

  if (packageJsonDirectory) {
    exec(
      "npm run scan",
      { cwd: packageJsonDirectory },
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing npm run scan: ${error}`);
          return;
        }
        console.log(`${stdout}`);
        console.error(`${stderr}`);
      }
    );
  } else {
    console.error("package.json not found in the directory tree.");
  }
}

const moduleName = process.argv[2];
createModule(moduleName);
