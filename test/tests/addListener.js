export default async function addListener(createInterface) {

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
