import {PublisherInterface} from "../dist/PublisherInterface.min.js";
import {deepEqual} from "./deepEqual.js"

export default async function ({name, send, response, passIframe}) {
  
  const publisher = await createInterface(passIframe)
  await createTestFor(name, response, publisher.iframe);

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

async function createInterface(passIframe) {

  switch (passIframe) {
    case "preV1": {
      const iframe = document.createElement("iframe");
      iframe.src = `/server/publisherInterface.html`;

      const publisherPromise = PublisherInterface.build(iframe, {timeout:5000});
      document.body.appendChild(iframe);
      return publisherPromise;
    }
    case "postV1": {
      const iframe = document.createElement("iframe");
      iframe.src = `/server/publisherInterface.html`;

      const publisherPromise = PublisherInterface.buildWithIframe(iframe, {timeout:5000});
      document.body.appendChild(iframe);
      return publisherPromise;
    }
    default:
    return PublisherInterface.buildOnElement(document.body, `/server/publisherInterface.html`, {timeout:5000});
  }
}

function lowerFirstLetter(str) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}