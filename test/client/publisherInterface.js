import {PublisherInterface} from "../dist/PublisherInterface.min.js";
import {deepEqual} from "./deepEqual.js"

export default async function ({name, send, response}) {
  
  const iframe = document.createElement("iframe");
  iframe.src = `/server/publisherInterface.html`;

  const publisher = await createInterface(iframe)
  await createTestFor(name, response, iframe);

  const [receivedOnIframe, responseFromIframe] = await Promise.all([
    new Promise(res => {
      window.addEventListener("message", (event) => {
        if (event.data.test == name) {
          res(event.data.received)
        }
      })
    }),
    publisher[lowerFirstLetter(name)](...send)
  ])

  console.log(receivedOnIframe, responseFromIframe);

  return deepEqual(receivedOnIframe, send) && deepEqual(responseFromIframe, response);

}

async function createTestFor(name, response, iframe) {
  iframe.contentWindow.postMessage({addTest:true, name, response}, "*");

  return new Promise( res => {
    const createTestListener = (event) => {
      //testReady: true, testName: event.data.testName
      if (event.data.testReady && event.data.name == name) {
        res(name);
      }
    }

    window.addEventListener("message", createTestListener)
  });
}

async function createInterface(iframe, options = {}) {
  const publisherPromise = PublisherInterface.build(iframe, {timeout:5000, ...options});
  document.body.appendChild(iframe);
  return publisherPromise;
}

function lowerFirstLetter(str) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}