# Differences With `editorObject`
The `PublisherInterface` class and `editorObject` object share many similarities. This is not odd because the `PublisherInterface` is an interface for interacting with the `editorObject` via `postMessage()`. Below we will mark any key differences.

Note: When Publisher was on Flash, the `editorObject` was just called `editor`. The two terms can be used and discussed interchangeably.

Differences:
* [Method Names](#method-names)
* [Promise as a Return](#promise-as-a-return)
* [Events](#events)

## Method Names
A small, but important difference is that the methods from the `PublisherInterface` uses common JavaScript naming - camelCase. This differs from the PascalCase used by the `editorObject`.

✏️ The editorObject way:
```javascript
editorObject.ExecuteFunction("document", "save");
```

💻 The interface way:
```javascript
await interface.executeFunction("document", "save");
```

<br/>

There is a convenience getter on the `PublisherInterface` class named [editorObject](PublisherInterface.md#editorobject) which acts as an alias that can help current implementations switch to Publisher Interface.

See [Moving to Publisher Connector](Moving-to-Publisher-Connector.md#dealing-with-publisherinterface-api-name-changes) for more details.

## Promise as a Return
While the `editorObject` methods return by holding up the main thread, the `PublisherInterface` methods use `postMessage()` under the hood. This means that the message must be serialized, sent, and deserialized across from one window to another. It is a message system, and thus things happen asynchronously.

The only way to deal with asynchronous message communication is to use callbacks. This can be done natively in JavaScript via a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

Unless noted otherwise, all `PubliserInterface` methods return a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

✏️ The editorObject way:
```javascript
function logDocName() {
  const documentId = editorObject.GetObject("document.id");
  console.log(documentId);
}
```

💻 The interface way:
```javascript
function logDocName() {
  interface.getObject("document.id").then(
      documentId => console.log(documentId)
  );
}
```

or
```javascript
async function logDocName() {
  const documentId = await interface.getObject("document.id");
  console.log(documentId);
}
```

<br/>
This means that all code written to use Publisher Interface, must be written with asynchronously in mind.

<br/>

Side note, if something goes wrong, both `editorObject` and `PublisherInterface` behave the same by throwing an exception.

## Events
To use events with the `editorObject`, it involved called the `editorObject.AddListener()` method and then defining a
function on `window.OnEditorEvent()` that took a string for the event name and a string for the id of the target. The `OnEditorEvent()` function would typically have a switch case or a series of if/else to determine which event was called, and react accordingly.

The good news is that `PublisherInterface` behave the same.

✏️ The editorObject way:
```javascript
editorObject.AddListener("FrameMovedFinished");
```

💻 The interface way:
```javascript
await interface.addListener("FrameMovedFinished");
```

Both these implementations will call `window.OnEditorEvent()` method when the *FrameMovedFinished* event is fired off.

So you could use something like the below example in both cases to log when *FrameMovedFinished* event is fired off.
```javascript
window.OnEditorEvent = (eventName, targetId) => {
  if (eventName == "FrameMovedFinished) {
    console.log("Frame with id " + targetId + " was moved");
  }
}
```

However, with the `PublisherInterface` there more concise way to handle events using a callback. If you supply a callback when calling `addListener()`, then the callback will be used instead of `window.OnEditorEvent()`.

So our example can be rewritten as:

💻 The interface way:
```javascript
await interface.addListener("FrameMovedFinished", (targetId) => {
  console.log("Frame with id " + targetId + " was moved");
});
```
<br/>

Removing events is the same in both implementations.

✏️ The editorObject way:
```javascript
editorObject.RemoveListener("FrameMovedFinished");
```

💻 The interface way:
```javascript
await interface.removeListener("FrameMovedFinished");
```
