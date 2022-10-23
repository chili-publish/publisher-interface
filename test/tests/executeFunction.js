export default async function (publisherInterace) {
  await new Promise((resolve) =>
    publisherInterace.addListener("DocumentFullyLoaded", resolve)
  );

  const count = await publisherInterace.getObject("document.variables.count");

  const newVariable = await publisherInterace.executeFunction(
    "document.variables",
    "Add"
  );
  await publisherInterace.setProperty(
    "document.variables[" + newVariable.id + "]",
    "value",
    "stuff"
  );

  const newCount = await publisherInterace.getObject(
    "document.variables.count"
  );

  if (newCount > count) {
    return true;
  }

  return false;
}
