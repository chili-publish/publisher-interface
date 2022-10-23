export default async function (publisherInterace) {
  await new Promise((resolve) =>
    publisherInterace.addListener("DocumentFullyRendered", resolve)
  );

  const snapshot = await publisherInterace.getPageSnapshot(
    0,
    "100%",
    null,
    null,
    "preview",
    false
  );
  const document = await publisherInterace.getObject("document");
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
