const { exec, spawn } = require("child_process");
const { kill, exit, platform } = require("process");

if (!(platform == "darwin" || platform == "linux")) {
  console.log("Testing not supported outside of OS X or Linux");
  exit(1);
}

async function main() {

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
    console.log("ERROR");
    console.log(buildSuccess[1]);
    exit(1);
  }

  const copyPISuccess = await new Promise((res) => {
    exec(
      "cp ./dist/PublisherInterface.min.js ./test/dist/PublisherInterface.min.js",
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

  if (!copyPISuccess[0]) {
    console.log("ERRROR");
    console.log(copyPISuccess[1]);
    exit(1);
  }


  const copyIWSuccess = await new Promise((res) => {
    exec(
      "cp ./dist/chiliInternalWrapper.min.js ./test/dist/chiliInternalWrapper.min.js",
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
 
  if (!copyIWSuccess[0]) {
    console.log("ERRROR");
    console.log(copyIWSuccess[1]);
    exit(1);
  }

  // const startServer = new Promise(res => {
  //     exec(`node ./test/testServer.js --url ${iframeUrl.replace("&", "^")}`)
  // });

  // On Ubuntu 22.04, this command spawns two processes.
  const serverChild = spawn(
    `node ./test/testServer.js`,
    {
      shell: true,
    }
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
  playwrightChild.on("exit", (code) => {
    console.log(`child process exited with code ${code}`);
    //kill(serverChild.pid, "SIGTERM");
    killAllTestServerProcess().then(() =>
      exit(code)
    );
  });
}

// On Ubuntu 22.04, testServer.js spawns two processes
// Thus we go through and kill and all testServer process include rouge one
async function killAllTestServerProcess() {
  const ps = await new Promise((res) => {
    exec("pgrep -f 'testServer.js'", (error, stdout, stderr) => {
      if (error) {
        res([false, error]);
        return;
      }
      if (stderr) {
        res([false, stderr]);
        return;
      }

      res([true, stdout]);
    });
  });

  if (ps[0])
    ps[1]
      .split("\n")
      .filter((pid) => pid.length > 0)
      .map((pid) => {
        try {
          kill(pid, "SIGTERM");
        } catch (e) {
          // suppress errors on purpose
        }
      });
}

main();
