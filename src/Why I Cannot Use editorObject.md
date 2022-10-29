# Why I Cannot Use `editorObject`?
Well you can.

When it comes to writing JavaScript in [Actions](https://chilipublishdocs.atlassian.net/wiki/spaces/CPDOC/pages/1412114/Variable+Document+Actions) or using the Console in Dev Tools, `editorObject` is still used.

However, in an integration, the Publisher editor runs in a `<iframe>`, which means that the content loaded is subject to the [same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy). In short, this means that trying to interact with the CHILI Editor using JavaScript will cause the browser security to block the interaction if the domains do not match. This is intended to help keep the end-user secure by only allowing scripts from the same domain to be automatically executed in the browser of the end-user.

## Same-origin Policy
It makes sense that the `editorObject` is inaccessible. An `<iframe>` is meant to open a website from another source inside of your website. Typically an `<iframe>` is used for adverts, or third-party applications. Realizing this, browser creators  recognized that a malicious hacker could, for example, include JavaScript in an advert designed to trick you into giving up personal information.

To combat this, browser makers implemented a [same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy) in their products. This stopped JavaScript from a different domain running in your website's domain. 

## The Solution
The same-origin policy is great for security but bad for integrators since most integrations want to communicate with our editor.

Previously there was a subdomain trick utilizing the mutating [document.domain](https://developer.mozilla.org/en-US/docs/Web/API/Document/domain). However, starting January 2023, this trick will no longer be possible in Chrome and eventually all Chromium based browsers.

Therefore, Publisher Interface, which utilizes [postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) under the hood, allows us to communicate with any Publisher editor regardless of the domain name.

## Summary
So for all integrations, the Publisher Interface library must be used. It is the only supported method for communicating to the Publisher editor running in an `<iframe>`.

For communicating with the editor via [Actions](https://chilipublishdocs.atlassian.net/wiki/spaces/CPDOC/pages/1412114/Variable+Document+Actions) or the Console in Dev Tools, `editorObject` is still used.

You should review [Differences With editorObject](https://github.com/chili-publish/publisher-interface/wiki/Differences-With-editorObject), as the `PublisherInterface` does contain some differences due to the inherent message based system of `postMessage()`.

