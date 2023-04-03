export default async function (createInterface) {

  const publisherInterface = await createInterface();

  await new Promise((resolve) =>
    publisherInterface.addListener("DocumentFullyLoaded", resolve)
  );

  const count = await publisherInterface.getObject("document.variables.count");

  const newVariable = await publisherInterface.executeFunction(
    "document.variables",
    "Add"
  );
  await publisherInterface.setProperty(
    "document.variables[" + newVariable.id + "]",
    "value",
    "stuff"
  );

  const newCount = await publisherInterface.getObject(
    "document.variables.count"
  );

  if (newCount > count) {
    return true;
  }

  return false;
}
