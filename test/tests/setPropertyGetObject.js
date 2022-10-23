export default async function (publisherInterace) {
  await new Promise((resolve) =>
    publisherInterace.addListener("DocumentFullyLoaded", resolve)
  );

  await publisherInterace.setProperty("document", "name", "test123");
  const documentName = await publisherInterace.getObject("document.name");

  if (documentName == "test123") {
    return true;
  }

  return false;
}
