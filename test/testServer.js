/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const http = require("http");
const fs = require("fs");
const { exit } = require("process");

const urlIdIndex = process.argv.findIndex((value) => value == "--url");

if (urlIdIndex < 0) {
  console.log("No --url included");
  exit(1);
}

if (urlIdIndex == process.argv.length) {
  console.log("No --url included");
  exit(1);
}

// Need to encode & to ^ so we can pass the whole URL as an argument.
// The & symbol gets breaks the arugment
const iframeUrl = process.argv[urlIdIndex + 1].replace("^", "&");

if (iframeUrl == null) {
  console.log("--url is null");
  exit(1);
}

process.on("SIGTERM", () => {
  exit(0);
});

const requestListener = function (req, res) {
  const filePath =
    "./test/" + (req.url == "/" || req.url == "" ? "/index.html" : req.url);
  const contentType = filePath.includes(".js")
    ? "text/javascript"
    : "text/html";

  fs.readFile(filePath, "utf8", function (error, content) {
    if (error) {
      res.writeHead(500);
      res.end("Error reading file: " + error.code);
      console.log("Error reading file: " + error.code);
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content, "utf-8");
    }
  });
};

const server = http.createServer(requestListener);
server.listen(3001);
