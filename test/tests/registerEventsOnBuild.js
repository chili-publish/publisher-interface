export default async function (createInterface) {
  
  let loaded = false;
  let targetIdLoaded = null;

  const publisherInterface = await createInterface({events:["DocumentFullyRendered", {name:"DocumentFullyLoaded", func:(id) => {
    loaded = true
    targetIdLoaded = id
  }}]});
  
  await publisherInterface.addListener("DocumentFullyRendered");
  return new Promise((resolve) => {
    window.OnEditorEvent = (eventName, targetId) => {
      if (eventName == "DocumentFullyRendered" && targetId == targetIdLoaded && loaded) resolve(true);
    };

    setTimeout(() => {
      resolve(false);
    }, 8000);
  });
}
