export default async function (createInterface) {

  const publisherInterface = await createInterface();

  await new Promise((resolve) =>
    publisherInterface.addListener("DocumentFullyLoaded", resolve)
  );

  const name = await publisherInterface.getObject("document.variables[0].name");
  await publisherInterface.setVariableIsLocked(name, true);
  const updateNewVariable = await publisherInterface.getObject(
    "document.variables[" + name + "]"
  );

  if (updateNewVariable.IsLocked == "true") {
    return true;
  }

  return false;
}
