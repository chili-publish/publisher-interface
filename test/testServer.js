/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const http = require("http");
const fs = require("fs");
const { exit } = require("process");

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
      res.end(`Error reading file ${filePath}: ${error.code}`);
      console.log(`Error reading file ${filePath}: ${error.code}`);
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content, "utf-8");
    }
  });
};

const server = http.createServer(requestListener);
server.listen(3001);
