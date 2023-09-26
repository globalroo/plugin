const { exec } = require("child_process")

if (process.platform !== "win32") {
    exec("chmod +x ./index.js", (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing chmod: ${error}`)
            return
        }
        console.log(stdout)
        console.error(stderr)
    })
}
