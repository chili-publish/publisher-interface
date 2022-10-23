export default async function (publisherInterace) {
  await new Promise((resolve) =>
    publisherInterace.addListener("DocumentFullyLoaded", resolve)
  );

  const name = await publisherInterace.getObject("document.variables[0].name");
  await publisherInterace.setVariableIsLocked(name, true);
  const updateNewVariable = await publisherInterace.getObject(
    "document.variables[" + name + "]"
  );

  if (updateNewVariable.IsLocked == "true") {
    return true;
  }

  return false;
}
