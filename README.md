# Publisher Interface
The Publisher Interface was designed to make integrating into CHILI publish Online easy.

As a happy side effect, the setter for `document.domain`, which many integrations rely on, will become immutable at the beginning of January 2023. This means that the Publisher Interface will be the only supported way to communicate with Publisher via an `<iframe>`.

All the magic happens with `PublisherInterface` PublisherInterface is a class object that allows you to interact with the CHILI Editor editorObject via postMessage without the complexity of postMessage.

This project is officially supported by [CHILI publish](https://chili-publish.com).

Notes:
* The Publisher JavaScript API has been stable for years, and there is no plans to add to it. So this project may not get many updates. That is a good thing, it means there is no bugs.
* Originally this project was called Publisher Connector. The name was changed to avoid confusion with the future connectors plugin system. Please update your projects if you were using the old naming convention and library.

## Documentation
You can find complete documentation on the [wiki](https://github.com/chili-publish/publisher-interface/wiki)
* [Installation](#installation) - Easy npm install.
* [Getting Started](#getting-started) - A very quick tutorial to get you started.
* [Debugging](#debugging) - Things gone wrong, check this out.
* [Integrating Publisher](https://github.com/chili-publish/publisher-interface/wiki/Integrating-Publisher) - A much longer tutorial for those starting a new project with Publisher.
* [Why I Cannot Use editorObject](https://github.com/chili-publish/publisher-interface/wiki/Why-I-Cannot-Use-editorObject) - A description of why `editorObject` can no longer be used when communicating with an `<iframe>`.
* [Differences With editorObject](https://github.com/chili-publish/publisher-interface/wiki/Differences-With-editorObject) - All the differences between `PublisherInterface` and `editorObject`.
* [Moving to Publisher Interface](https://github.com/chili-publish/publisher-interface/wiki/Moving-to-Publisher-Interface) - A guide for those who already have a project with Publisher and are now converting their current integration from `editorObject` to Publisher Interface.
* [Big List of JavaScript Use Cases](https://github.com/chili-publish/publisher-interface/wiki/Big-List-of-JavaScript-Use-Cases) - A very long list of JavaScript use cases. [WIP]
* [API Documentation](https://github.com/chili-publish/publisher-interface/wiki/API-Docs) - auto-generated documentation of the `PublisherInterface` class and associated types. Even though it is auto-generated, the comments therein were written with insight.

## Installation
You can install PublisherInterface via npm

```
npm i @chili-publish/publisher-interface
```

<br/>

or through yarn
```
yarn add @chili-publish/publisher-interface
```

<br/>

You can also use it directly in the browser via unpkg.
```javascript
import {PublisherInterface} from "https://unpkg.com/@chili-publish/publisher-interface@latest/dist/PublisherInterface.min.js";
```

## Dependencies
The Publisher Interface has 1 dependency which is the [Penpal](https://github.com/Aaronius/penpal) library.

All other dependencies are only for the developer tools such as auto generating docs, testing, and packaging.

This means that their is very little security concerns, and the limitations are the same as those found in [Penpal](https://github.com/Aaronius/penpal)

### Browser Support

Publisher Interface runs successfully on the most recent versions of Chrome, Firefox, Safari, and Edge. Internet Explorer is
not supported.

## Getting Started
The easiest way to get started is to pull the package from unpkg.

```javascript
import {PublisherInterface} from "https://unpkg.com/@chili-publish/publisher-interface@latest/dist/PublisherInterface.min.js";
```

<br/>

If you downloaded via NPM you can import it with
```javascript
import {PublisherInterface} from "@chili-publish/publisher-interface";
```

<br/>

Then in your JavaScript code, get the iframe which is loading the Publisher editor, and pass that iframe element into the `build()` function of `PublisherInterface`.

```javascript
const iframe = document.getElementById("editor-iframe");
const publisher = PublisherInterface.build(iframe).then(
    PublisherInterface => PublisherInterface.alert("Hi!")
);
```

🚨 **Important** - make sure that you call `build()` before the iframe `onload` event is fired. In practice this means that you should never call `build()` when that event is fired.

<br/>

In simple use cases, the below example will work well.
```html
<body>
    <iframe id="editor-iframe" style="width:1200px; height:800px"
        src="https://example.chili-publish.online/example/editor_html.aspx?doc=3d178228-a9b9-49d0-90d9-c1c8f8b67f05&apiKey=Sczs1ruhiZcaFiqg0G07gMFMq07X+SG2o8KlW8oAeZGqoB1a0YkbeZU1wJK15aIhANgZmhg+13NQlxpBEq7Q=="></iframe>
    <script type="module">
        import {PublisherInterface} from 'https://unpkg.com/@chili-publish/publisher-interface@latest/dist/PublisherInterface.min.js';
    
        const iframe = document.getElementById("editor-iframe");
    
        (async () => {
            const publisher = await PublisherInterface.build(iframe);
            const documentName = await publisher.getObject("document.name");
            console.log(documentName);
        })();
    </script>
</body>
```

<br/>
When dealing with larger applications, it's important to ensure that the `iframe` and the `PublisherInterface` build method are called in the same JavaScript event loop. To do this, follow these steps:

1. Create the `iframe` element and set its `src` attribute.
2. Pass the `iframe` element to the `build` method of `PublisherInterface` and capture the promise returned from the method.
3. Append the `iframe` element to the DOM.
4. Await the promise captured in step 2 and assign it to a variable that can be used throughout your application.

Example Code:

```html
<body>
  <script type="module">
    import {PublisherInterface} from 'https://unpkg.com/@chili-publish/publisher-interface@latest/dist/PublisherInterface.min.js';

    document.addEventListener("DOMContentLoaded", async () => {
      (async () => {
        const iframe = document.createElement("iframe");
        iframe.src = "https://example.chili-publish.online/example/editor_html.aspx?doc=3d178228-a9b9-49d0-90d9-c1c8f8b67f05&apiKey=Sczs1ruhiZcaFiqg0G07gMFMq07X+SG2o8KlW8oAeZGqoB1a0YkbeZU1wJK15aIhANgZmhg+13NQlxpBEq7Q==";
        const publisherPromise = PublisherInterface.build(iframe);
        document.body.appendChild(iframe);
        const publisher = await publisherPromise;
        const documentName = await publisher.getObject("document.name");
        console.log(documentName);
      })();
    });
  </script>
</body>
```
## Debugging
To enable debugging for the underlying library, pass {penpalDebug: true} as the buildOptions in your build function.

```javascript
PublisherInterface.build(iframe, {penpalDebug: true});
```

This will display messages in the console from Penpal about the communication between the iframe and the main page.

If there's a possibility of a failure to connect, you can set a timeout. If the connection is not established before the timeout, an exception will be thrown. In the example below, the build method will throw a timeout after 10 seconds if no connection is established.
```javascript
PublisherInterface.build(iframe, {penpalDebug: true, timeout: 10000});
```

<br/>

To read more, check out our [documentation](#documentation).