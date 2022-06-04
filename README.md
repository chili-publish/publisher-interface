# PublisherConnector

PublisherConnector is a class object that allows you to interact with the CHILI Editor editorObject via [postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) without
the complexity of postMessage.

Why choose this over interacting with the editorObject directly?

* The first and most obvious reason is CORS - by using PublisherConnector you do not have to worry about CNAME/domain or
  reverse proxy tricks.
* The documentation of each function of PublisherConnector (really the editorObject) is the most complete documentation in
  existence.
* Works with CHILI publisher Online.
* Promise based and modern.

## Installation

You can install PublisherConnector via npm

`npm i @chili-publish/publisher-connector`

or through yarn

`yarn add @chili-publish/publisher-connector`

## Usage

1. Import PublisherConnector.

If you downloaded the library:
```javascript
import {PublisherConnector} from "@chili-publish/publisher-connector";
```

or using in the web via unpkg URL:

```javascript
import {PublisherConnector} from "https://unpkg.com/@chili-publish/publisher-connector@latest/dist/PublisherConnector.min.js";
```

<br/>
2. Get the HTMLIFrameElement which contains the CHILI Editor.

```javascript
const iframe = document.getElementById("editor-iframe");
```

<br/>
3. Create an instance of PublisherConnector by using the `build` method and passing the HTMLIFrameElement (created above)
   as a parameter. The `build` method returns a promise, which when resolved has the instance of the PublisherConnector.

```javascript
PublisherConnector.build(iframe).then(
    publisherConnector => publisherConnector.alert("Hi!")
);
```

<br/>

### 🚨️ IMPORTANT 🛑

The PublisherConnector `build` method must be called before the IFrame loads the Editor. This is due to
how [Penpal](https://github.com/Aaronius/penpal), the library the PublisherConnector is built on, functions.

If you set the `src` attribute of the IFrame in your HTML and have a script tag that runs the build method, then
everything will be fine. The issue is only if you were to wait until IFrame was loaded before calling the `build`
method.

For example the below code will work because the `build` method is called before the IFrame is loaded.

```html
<body>
    <iframe id="editor-iframe" style="width:1200px; height:800px"
        src="https://example.chili-publish.online/example/editor_html.aspx?doc=3d178228-a9b9-49d0-90d9-c1c8f8b67f05&apiKey=Sczs1ruhiZcaFiqg0G07gMFMq07X+SG2o8KlW8oAeZGvqoB1a0YvkbeZU1wJK15aIhANgZmhg+13NQlxpBEq7Q=="></iframe>
    <script type="module">
        import {PublisherConnector} from 'https://unpkg.com/@chili-publish/publisher-connector@latest/dist/PublisherConnector.min.js';
    
        const iframe = document.getElementById("editor-iframe");
    
        (async () => {
            const publisherConnector = await PublisherConnector.build(iframe);
            const documentName = await publisherConnector.getObject("document.name");
            console.log(documentName);
        })();
    </script>
</body>
```

## API Reference

- [PublisherConnector](/docs/index.html)

## Differences with `editorObject`

The PublisherConnector class and editorObject object share many similarities. This is not odd as the PublisherConnector is an
interface for interacting with the editorObject via postMessage. Below will mark any key differences.

### Naming

A small, but important difference is that the methods from the PublisherConnector uses common JavaScript naming - camel
case. This differs from the Pascal case used by the editorObject.

So `editorObject.GetObject` becomes `publisherConnector.getObject`.

So `editorObject.SetProperty` becomes `publisherConnector.setProperty`.
<br/>
<br/>

### Promise Return

While the editorObject methods return without delay, the PublisherConnector uses postMessage. This means that the message
must be serialized, sent, deserialized across from one window to another.

To make this easy, the PublisherConnector methods return a Promise.

So instead of:

```javascript
const documentId = editorObject.GetObject("document.id");
console.log(documentId);
```

You would do:

```javascript
publisherConnector.getObject("document.id").then(
    documentId => console.log(documentId)
);
```

or use `await`, in a function marked `async`:

```javascript
const documentId = await publisherConnector.getObject("document.id");
console.log(documentId);
```

Just like editorObject methods, if something goes wrong, an error will be thrown.
<br/>
<br/>

### Events

The PublisherConnector does events completely different from what is documented for the editorObject.

To use events with the editorObject, it involved called the `editorObject.AddListener` method and then defining a
function on `window.OnEditorEvent` that took a string for events. The OnEditorEvent function would typically have a
switch case or a series of if/else to determine which event was called.

PublisherConnector makes things much simpler. If you want to listen to an event and then do something, then name it and add
a callback function.

```javascript
await publisherConnector.addListener(
  "FrameMoveFinished", 
  target => console.log("Frame moved with id " + target)
);
```

Removing an event is pretty much the same.

```javascript
await publisherConnector.removeListener("FrameMoveFinished");
```

<br/>

### Getting PublisherConnector

When not using postMessage, there were two common methods to get the editorObject.

* Editor page would allow you to set a callback using GetEditor on the IFrame contentWindow to get the editorObject
* DocumentFullyLoaded event was called by default, so you could wait until that event was fired and sent to
  window.OnEventEvent to get the editorObject directly from the IFrame contentWindow

Neither of these methods are possible now, and you will need to use the `build` method on PublisherConnector. See Usage
above.
<br/>

## Limitations

PublisherConnector is built on [Penpal](https://github.com/Aaronius/penpal), which means that it inherits all same
limitations.

### Browser Support

PublisherConnector runs successfully on the most recent versions of Chrome, Firefox, Safari, and Edge. Internet Explorer is
not supported.

### Errors

See [Penpal Errors](https://github.com/Aaronius/penpal#errors)
