const { exec, spawn } = require("child_process");
const { kill, exit } = require("process");

async function main() {
  const urlIdIndex = process.argv.findIndex((value) => value == "--url");

  if (urlIdIndex < 0) {
    console.log("No --url provided");
    exit(1);
  }

  if (urlIdIndex == process.argv.length) {
    console.log("No --url included");
    exit(1);
  }

  const iframeUrl = process.argv[urlIdIndex + 1];

  if (iframeUrl == null) {
    console.log("--url is null");
    exit(1);
  }

  const buildSuccess = await new Promise((res) => {
    exec("npm run build", (error, stdout, stderr) => {
      if (error) {
        res([false, error]);
        return;
      }
      if (stderr) {
        res([false, stderr]);
        return;
      }

      if (stdout.includes("Built in")) {
        res([true, null]);
      }
    });
  });

  if (!buildSuccess[0]) {
    console.log("ERRROR");
    console.log(buildSuccess[1]);
    exit(1);
  }

  const copySuccess = await new Promise((res) => {
    exec(
      "cp ./dist/PublisherInterface.min.js ./test/PublisherInterface.min.js",
      (error, stdout, stderr) => {
        if (error) {
          res([false, error]);
          return;
        }
        if (stderr) {
          res([false, stderr]);
          return;
        }

        res([true, null]);
      }
    );
  });

  if (!copySuccess[0]) {
    console.log("ERRROR");
    console.log(copySuccess[1]);
    exit(1);
  }

  // const startServer = new Promise(res => {
  //     exec(`node ./test/testServer.js --url ${iframeUrl.replace("&", "^")}`)
  // });

  // Need to encode & to ^ so we can pass the whole URL as an argument.
  // The & symbol gets breaks the arugment
  const serverChild = spawn(
    `node ./test/testServer.js`,
    ["--url", iframeUrl.replace("&", "^")],
    { shell: true }
  );
  serverChild.stdout.on("data", (data) => {
    console.log(`${data}`);
  });

  console.log(serverChild.pid);

  const playwrightChild = spawn("npx @playwright/test test", [], {
    shell: true,
  });
  playwrightChild.stdout.on("data", (data) => {
    console.log(`${data}`);
  });
  playwrightChild.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });
  playwrightChild.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
    kill(serverChild.pid, "SIGHUP");
    exit(code);
  });
}

main();
