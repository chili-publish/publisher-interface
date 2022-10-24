export default async function (createInterface) {

  const publisherInterface = await createInterface();

  await new Promise((resolve) =>
    publisherInterface.addListener("DocumentFullyLoaded", resolve)
  );

  await publisherInterface.setProperty("document", "name", "test123");
  const documentName = await publisherInterface.getObject("document.name");

  if (documentName == "test123") {
    return true;
  }

  return false;
}
