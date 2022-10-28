# What is happening?
Due to an update to Chrome in January 2023, all CHILI integrations that utilize a subdomain trick and our JavaScript API will no longer function in January 2023. Eventually, this will be true of all Chromium browsers such as Edge, Opera, Brave, etc.

Specifically, what will happen in January 2023 is that all JavaScript API calls made with `editorObject` will be blocked by Chrome. This will cause custom UI, UX, and workflows relying on Publisher's JavaScript API to fail. So the Publisher editor will still load and function, but the custom integration will not be able to communicate with the editor.

It is very important that you review your integration to confirm if you need to resolve this issue. Failure to do so could lead to unwanted loss of behavior in 2023. 

<br/>

# Do I Need To Convert My Integration?
Short and simple:
* If your integration of Publisher uses an `<iframe>`, our JavaScript API, and you are not utilizing a reverse proxy, then the answer is yes you need to convert.

<br/>

If you are not sure, there is a very simple test to see if you need to convert your integration. This test needs to be done inside your integration, it cannot be done in the BackOffice.

### See if you use the `d` query parameter
If your custom integration loads the Publisher editor in an `<iframe>` get the URL from the `src` of that`<iframe>`. Look through that URL, if it has a **d=example.com** in the URL then you will need to convert your integration from using `editorObject` to `PublisherInterface`.

(Keep in mind that *example.com* is just an example, the domain in reality will be your websites domain.)

Example, I load my integration and find the `<iframe>` for my editor.
```html
<body>
    <iframe id="editor-iframe" style="width:1200px; height:800px"
        src="https://example.chili-publish.online/example/editor_html.aspx?doc=3d178228-a9b9-49d0-90d9-c1c8f8b67f05&apiKey=Sczs1ruhiZcaFiqg0G07gMFMq07X+S==&d=example.com"></iframe>
</body>
```
<br/>

The `src` of this `<iframe>` has a URL that ends in **d=example.com**. So this means that any custom JavaScript in my integration will cease to work sometime in January 2023 on Chrome.

Keep in mind, that the **d=** may not always be at the end of the URL, it could be near the beginning of the query parameters or somewhere in the middle.

Like in this example, can you spot the **d=**?
```
https://example.chili-publish.online/example/editor_html.aspx?d=example.com&doc=3d178228-a9b9-49d0-90d9-c1c8f8b67f05&apiKey=Sczs1ruhiZcaFiqg0G07gMFMq07X+S==
```

If your Publisher editor is loaded in the `<iframe>` with this **d=** query parameter, then you will need to convert to our Publisher Interface library.

## Results
If you want to be extra sure, I suggest modifying your integration to remove the **d=** from your editor URL. After that is removed, the JavaScript communication between your integration and Publisher should no longer work. The editor will still load, but any custom UI, UX, or workflow that relies on Publisher's JavaScript API will not function.

If this happens, then you must convert from `editorObject` over to `PublisherInterface`.

<br/>

# How To Convert?
To convert over please read:
* [wiki](https://github.com/chili-publish/publisher-interface/wiki) - this page is about the Publisher Connector at a basic level
* [Moving to Publisher Interface](https://github.com/chili-publish/publisher-interface/wiki/Moving-to-Publisher-Interface) - this page is specific to converting an integration from `editorObject` to `PublisherInterface`

<br/>

# More FAQ

## What if I am still not sure?
Create a [support ticket](https://mysupport.chili-publish.com/) and one of our Client Success Engineers will help out. Keep in mind that the Client Success Engineer will need access to your integration to know if a switch to `PublisherConnector` is needed. This can be done via screen share or via a demo account if your integration is not publicly accessible.

<br/>

## What if my custom integration stopped working after removing `d=`?
You need to switch to `PublisherInterface`. See:
* [wiki](https://github.com/chili-publish/publisher-interface/wiki) - this page is about the Publisher Connector at a basic level
* [Moving to Publisher Interface](https://github.com/chili-publish/publisher-interface/wiki/Moving-to-Publisher-Interface) - this page is specific to converting an integration from `editorObject` to `PublisherInterface`

<br/>

## The editor still loaded after removing `d=`, so I am good?
No, the problem is not about the Publisher editor loading, but instead any custom JavaScript UI, UX, or workflow will no longer work. If you have `d=` in your URL, you will need to switch to `PublisherInterface`.

<br/>

## Will this switch require development work?
Yes, it will require development work. The Publisher Interface library was built to be as close to the same as using `editorObject` as possible. However, due to the underline methodology provide by browsers, we had to make a major change in that workflow is now asynchronous.

You can read more about it here: [Moving to Publisher Interface](https://github.com/chili-publish/publisher-interface/wiki/Moving-to-Publisher-Interface)

<br/>

## Why can we not just keep the same integration trick?
The answer is simple, the subdomain trick that many Publisher integrations relied on to avoid JavaScript being blocked by browser's same-origin policy is going to stop working in all Chrome browsers in January 2023.

You can read more about why here: [Why I Cannot Use editorObject](https://github.com/chili-publish/publisher-interface/wiki/Why-I-Cannot-Use-editorObject)

<br/>

## I am not using CHILI publish Online, can my hosted CHILI use Publisher Interface?
Yes, but there is extra instructions. See: [Moving to Publisher Interface](https://github.com/chili-publish/publisher-interface/wiki/Moving-to-Publisher-Interface)

<br/>

## Can I use a reverse proxy to avoid development work?
Yes, you can use a reverse proxy to avoid development work. Reverse proxies work by using an external server to make it look like URLs from another website are actually from the same domain. With this, you can avoid the [same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy) that blocks JavaScript to an `<iframe>`. 

However, CHILI publish and the Client Success team will not provide support in setting up, managing, and maintaining a reverse proxy. Using reverse proxies increase the complexity of your integration as all requests to CHILI will be ran through your proxy server. This means that any API issues, including performance, will need to be investigated at the proxy level by your team.

The CHILI publish team will always compare any issues to using Publisher directly, and it will be up to your team to investigate any issues with the reverse proxy.

We strongly suggest not using a reverse proxy, as you are just shifting resources from development to IT. In addition, while the conversion to using our Publisher Interface library is a one time switch, the use of reverse proxy is a long term commitment.

<br/>

## Can we delay the date of January 2023?
No, the date is set by Google, not CHILI publisher. There is nothing we can do to push the date back.

<br/>

## What is the exact day in January 2023?
We do not know that, and any prediction from Google will most likely change. In addition, the updates to Chrome will be rolling out in waves. This means that some users may get an update at the beginning of January and others multiple weeks after. You may also have users who do not upgrade their browser.

<br/>

## What happens if my integration does not switch to Publisher Interface?
Some time in or after January 2023, you or your clients will no longer be able to use any custom UI, UX, or workflows that rely on Publisher's JavaScript API. This is because Chrome browsers that have been updated will no longer be able to access the `editorObject`.

You can read more about why here: [Why I Cannot Use editorObject](https://github.com/chili-publish/publisher-interface/wiki/Why-I-Cannot-Use-editorObject)