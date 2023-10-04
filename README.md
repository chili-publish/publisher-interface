# CHILI Publisher Interface
The **Publisher Interface** library simplifies integration with CHILI GraFx Publisher by providing a straightforward means to interact with the editorObject via postMessage. This library greatly simplifies the complexity of dealing with the same-origin policy in all browsers including Chromium-based browsers.

Notes:
- The Publisher JavaScript API has maintained stability for years. Thus this library reaching major version 1.x signifies that future updates will primarily address bug fixes, and should be rare. In this case, no updates is a good sign.
- Some use cases may not be supported by Publisher Interface. Refer to [here]() for unsupported use cases.
- Previously named Publisher Connector, the project has been renamed to Publisher Interface to avert confusion with future connectors plugin systems. Please update your project if you utilized the old name and library.
- As of 2023, this is the only officially support way to integrate CHILI GraFx Publisher.

<br/>

This project is officially supported by [CHILI publish](https://chili-publish.com).

## Contents
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Debugging](#debugging)

<br/>

📘 **Full documentation** is available on the [wiki](https://github.com/chili-publish/publisher-interface/wiki).

## Installation
Install Publisher Interface using npm, yarn, bun, or directly in the browser via unpkg.

```javascript
// npm
npm i @chili-publish/publisher-interface

// yarn
yarn add @chili-publish/publisher-interface

// bun
bun install @chili-publish/publisher-interface

// browser
import {PublisherInterface} from "https://unpkg.com/@chili-publish/publisher-interface@latest/dist/PublisherInterface.min.js";
```

## Dependencies
The Publisher Interface has 1 dependency which is the [Penpal](https://github.com/Aaronius/penpal) library.

All other dependencies are only for the developer tools such as auto generating docs, testing, and packaging. Developer dependencies will not always be up-to-date, and that is okay because our focus is to keep to keep the package up-to-date , and the developer tools only when releasing a new version.

This means that their is very little security concerns, and the limitations are the same as those found in [Penpal](https://github.com/Aaronius/penpal)

### Browser Support

Publisher Interface runs successfully on CHILI GraFx and any version greater on or above 6.5.5. It is also built to run on the most recent versions of Chrome, Firefox, Safari, and Edge. Internet Explorer is not supported.

<br/>

# Getting Started
Begin by pulling the package from unpkg, or import it if installed via NPM, yarn, or bun.

```javascript
//unpkg
import {PublisherInterface} from "https://unpkg.com/@chili-publish/publisher-interface@latest/dist/PublisherInterface.min.js";

// npm, yarn, bun
import {PublisherInterface} from "@chili-publish/publisher-interface";
```

<br/>

Subsequently, within your JavaScript code:
- Retrieve the containing element
- Invoke the buildOnElement method

```javascript
const editorDiv = document.getElementById("editor-div");
const publisher = PublisherInterface.buildOnElement(editorDiv, "https://example.chili-publish.online/example/editor_html.aspx?doc=3d178228-a9b9-49d0-90d9-c1c8f8b67f05&apiKey=Sczs1ruhiZcaFiqg0G0").then(
    publisher => publisher.alert("Hi!")
);
```

<br/>

The code above will create an iframe on the element with `id` "editor-div" using the URL passed in the function as the `src`.

For iframe styling, use `publisher.iframe`.

```javascript
const editorDiv = document.getElementById("editor-div");
const publisher = PublisherInterface.buildOnElement(editorDiv, "https://example.chili-publish.online/example/editor_html.aspx?doc=3d178228-a9b9-49d0-90d9-c1c8f8b67f05&apiKey=Sczs1ruhiZcaFiqg0G0").then(
    publisher => {
        publisher.iframe.classList.add("coolIFrameStyleInCSS");
    }
);
```

<br/>
<br/>

We can also use the [async and await](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises#async_and_await) syntax. Here is the above example using async/await:

```javascript
const editorDiv = document.getElementById("editor-div");
const publisher = await PublisherInterface.buildOnElement(editorDiv, "https://example.chili-publish.online/example/editor_html.aspx?doc=3d178228-a9b9-49d0-90d9-c1c8f8b67f05&apiKey=Sczs1ruhiZcaFiqg0G0");
publisher.iframe.classList.add("coolIFrameStyleInCSS");
```

<br/>

Here is a complete example:
```html
<body>
    <div id="editor-div"></div>
    <iframe id="editor-iframe" style="width:1200px; height:800px"
        src="https://example.chili-publish.online/example/editor_html.aspx?doc=3d178228-a9b9-49d0-90d9-c1c8f8b67f05&apiKey=Sczs1ruhiZcaFiqg0G0"></iframe>
    <script type="module">
        import {PublisherInterface} from 'https://unpkg.com/@chili-publish/publisher-interface@latest/dist/PublisherInterface.min.js';
    
        const element = document.getElementById("editor-div");
    
        (async () => {
            const publisher = await PublisherInterface.buildOnElement(element, "https://example.chili-publish.online/example/editor_html.aspx?doc=3d178228-a9b9-49d0-90d9-c1c8f8b67f05&apiKey=Sczs1ruhiZcaFiqg0G0");
            
            publisher.iframe.classList.add("coolIFrameStyleInCSS");
            
            const documentName = await publisher.getObject("document.name");
            
            console.log(documentName);
        })();
    </script>
</body>
```
<br/>

## Your Own iframe
In versions before 1.0, you would need to use your own iframe when building the `PublisherInterface` class.

To utilize your iframe, employ the buildWithIframe() method.

```html
<body>
    <iframe id="editor-iframe" style="width:1200px; height:800px"
        src="https://example.chili-publish.online/example/editor_html.aspx?doc=3d178228-a9b9-49d0-90d9-c1c8f8b67f05&apiKey=Sczs1ruhiZcaFiqg0G0"></iframe>
    <script type="module">
        import {PublisherInterface} from 'https://unpkg.com/@chili-publish/publisher-interface@latest/dist/PublisherInterface.min.js';
    
        const iframe = document.getElementById("editor-iframe");
    
        (async () => {
            const publisher = await PublisherInterface.buildWithIframe(iframe);
            const documentName = await publisher.getObject("document.name");
            console.log(documentName);
        })();
    </script>
</body>

```

<br/>

🚨 **Important** - `buildWithIframe()` will not resolve if the iframe loads before build() is called. Prefer using `buildOnElement()`.

<br/>

## Debugging
Activate debugging by passing `{debug: true}` as the commonBuildOptions in your build function.

```javascript
// If you are letting the iframe be built on an element
PublisherInterface.buildOnElement(element, "https://example.chili-publish.online/example/editor_html.aspx?doc=3d178228-a9b9-49d0-90d9-c1c8f8b67f05&apiKey=Sczs1ruhiZcaFiqg0G0", {debug: true})

// If you are using your own iframe
PublisherInterface.buildWithIframe(iframe, {debug: true});
```

This will display messages in the console about the communication between the iframe and the main page.

<br/>

To handle potential connection failures, define a timeout as demonstrated below.
```javascript
// If you are letting the iframe be built on an element
PublisherInterface.buildOnElement(element, "https://example.chili-publish.online/example/editor_html.aspx?doc=3d178228-a9b9-49d0-90d9-c1c8f8b67f05&apiKey=Sczs1ruhiZcaFiqg0G0", {debug: true, timeout: 10000})

// If you are using your own iframe
PublisherInterface.buildWithIframe(iframe, {debug: true, timeout: 10000});
```

If the connection is not established before the timeout, an exception will be thrown. In the example below, the build method will throw a timeout after 10 seconds if no connection is established.

<br/>

To read more, check out our [documentation](#documentation).
