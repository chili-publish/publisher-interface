export default async function (createInterface) {

  const publisherInterface = await createInterface();

  await new Promise((resolve) =>
    publisherInterface.addListener("DocumentFullyRendered", resolve)
  );

  const snapshot = await publisherInterface.getPageSnapshot(
    0,
    "100%",
    null,
    null,
    "preview",
    false
  );
  const document = await publisherInterface.getObject("document");
  const realWidth = parseInt(document.pixelWidth);

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const diff = Math.abs(img.width - realWidth);
      if (diff < 5) {
        resolve(true);
        return;
      }

      resolve(false);
    };
    img.src = "data:image/png;base64, " + snapshot;
  });
}
