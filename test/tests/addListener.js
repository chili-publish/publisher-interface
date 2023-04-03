export default async function (createInterface) {

  const publisherInterface = await createInterface();

  return new Promise((resolve) => {
    if (publisherInterface.addListener !== publisherInterface.editorObject.AddListener) {
      resolve(false);
    }

    publisherInterface.addListener("DocumentFullyRendered", () => {
      resolve(true);
    });

    setTimeout(() => {
      resolve(false);
    }, 8000);
  });
}
