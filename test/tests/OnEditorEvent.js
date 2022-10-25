export default async function (createInterface) {

  const publisherInterface = await createInterface();

  await publisherInterface.addListener("DocumentFullyRendered");
  return new Promise((resolve) => {
    window.OnEditorEvent = (eventName, targetId) => {
      if (eventName == "DocumentFullyRendered" && targetId != null) resolve(true);
    };

    setTimeout(() => {
      resolve(false);
    }, 8000);
  });
}
