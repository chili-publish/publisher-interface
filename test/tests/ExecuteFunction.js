export default async function (createInterface) {

  const publisherInterface = await createInterface();

  await new Promise((resolve) =>
    publisherInterface.addListener("DocumentFullyLoaded", resolve)
  );

  const count = await publisherInterface.editorObject.GetObject("document.variables.count");

  const newVariable = await publisherInterface.editorObject.ExecuteFunction(
    "document.variables",
    "Add"
  );
  await publisherInterface.editorObject.SetProperty(
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
