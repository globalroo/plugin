#!/usr/bin/env node
const fs = require("fs")
const path = require("path")
const { exec } = require("child_process")

const serverTemplate = require(path.join(__dirname, "templates", "serverTemplate"))
const runtimeTemplate = require(path.join(__dirname, "templates", "runtimeTemplate"))
const apiTemplate = require(path.join(__dirname, "templates", "apiTemplate"))
const mochaTemplate = require(path.join(__dirname, "templates", "mochaTemplate"))
const jestTemplate = require(path.join(__dirname, "templates", "jestTemplate"))

function findGitRoot(startPath) {
    let currentPath = startPath
    while (currentPath !== path.parse(currentPath).root) {
        const gitDirPath = path.join(currentPath, ".git")
        if (fs.existsSync(gitDirPath) && fs.statSync(gitDirPath).isDirectory()) {
            return currentPath
        }
        currentPath = path.dirname(currentPath)
    }
    return null
}

function ensureNoFunctions(obj) {
    if (typeof obj !== "object" || obj === null) {
        return obj
    }

    return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => {
            if (typeof value === "function") {
                return [key, value.name || "Anonymous"]
            }
            if (typeof value === "object") {
                return [key, ensureNoFunctions(value)]
            }
            return [key, value]
        })
    )
}

function ensureSafeName(value) {
    if (typeof value !== "string") {
        value = JSON.stringify(ensureNoFunctions(value))
    }

    return value
        .replace(/[^a-zA-Z0-9_]/g, "_")
        .replace(/^\d/, "_")
        .split("_")
        .map((part, index) => (index === 0 ? part : part[0].toUpperCase() + part.slice(1)))
        .join("")
}

function createModule(originalName) {
    const name = originalName.replace(/-(.)/g, (_, letter) => letter.toUpperCase())
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1)
    const safeName = ensureSafeName(originalName)
    const rootPath = path.join(process.cwd(), originalName)

    const files = [
        {
            path: path.join(rootPath, "server", `${originalName}.server.mjs`),
            content: serverTemplate(originalName, capitalizedName),
        },
        {
            path: path.join(rootPath, `${originalName}.runtime.js`),
            content: runtimeTemplate(originalName, capitalizedName, safeName),
        },
        {
            path: path.join(rootPath, "controller", `${originalName}.api.js`),
            content: apiTemplate(originalName, capitalizedName),
        },
        {
            path: path.join(rootPath, "server", `${originalName}.server.mocha.test.mjs`),
            content: mochaTemplate(originalName, capitalizedName),
        },
        {
            path: path.join(rootPath, `${originalName}.jest.test.js`),
            content: jestTemplate(originalName, capitalizedName),
        },
    ]

    for (const file of files) {
        fs.mkdirSync(path.dirname(file.path), { recursive: true })
        fs.writeFileSync(file.path, file.content)
    }

    console.log(`Module ${originalName} has been added.`)

    const projectRoot = findGitRoot(process.cwd())
    console.log("Identified project root as: ", projectRoot)
    if (projectRoot) {
        exec("npm run scan", { cwd: projectRoot }, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing npm run scan: ${error}`)
                return
            }
            console.log(`${stdout}`)
            console.error(`${stderr}`)
        })
    } else {
        console.error("package.json not found in the directory tree.")
    }
}

const moduleName = process.argv[2]
createModule(moduleName)
