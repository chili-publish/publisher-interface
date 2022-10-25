# Moving to Publisher Connector
There were a number of common integration patterns and methodologies that will no longer function the same way when moving over to Publisher Connector.




## OnEditor with callback ⛔
If you used OnEditor method and passed in a callback function like so:

```javascript
// Function called on onload event of iframe
function iFrameLoaded()
{
    iframe = document.getElementById("chili-iframe");
    iframe.contentWindow.GetEditor(myCallback);
}

function myCallback(editorObject)
{
  // Do something with editorObject
}
```
This will no longer work.

---

### **⚒️ The Fix**
You can create similar behavior with the build function. However, unlike GetEditor, build must be called before the iframe `onload` event.

```javascript
// This must be done before iframe onload event
iframe = document.getElementById("chili-iframe")
PublisherConnector.build(iframe).then(myCallback);

function myCallback(interface)
{
  // Do something with interface
}
```

While you can do it this way, it may make sense to refactor you callback function to be async

## EditorLoaded