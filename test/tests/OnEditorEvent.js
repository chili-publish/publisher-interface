export default async function (publisherInterace) {
  await publisherInterace.addListener("DocumentFullyRendered");
  return new Promise((resolve) => {
    window.OnEditorEvent = (eventName, targetId) => {
      if (eventName == "DocumentFullyRendered") resolve(true);
    };

    setTimeout(() => {
      resolve(false);
    }, 8000);
  });
}
