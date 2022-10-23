export default async function addListener(publisherConnector) {
  return new Promise((resolve) => {
    publisherConnector.addListener("DocumentFullyRendered", () => {
      resolve(true);
    });

    setTimeout(() => {
      resolve(false);
    }, 8000);
  });
}
