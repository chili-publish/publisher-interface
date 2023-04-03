export default async function (createInterface) {

  const publisherInterface = await createInterface();

  return new Promise((resolve) => {

    publisherInterface.addListener("DocumentFullyRendered", () => {
      resolve(true);
    });

    setTimeout(() => {
      resolve(false);
    }, 8000);
  });
}
