🚧 Still under construction 🚧

# Integrating Publisher
An editor that is embedded in your HTML pages can be interacted with using our JavaScript API. 

There are many reasons a team would want use the JavaScript API. Some examples are:

- Updating variables on document load
- Connecting to a custom widget
- Building a partial or complete custom interface
- Creating a “Save” button or an auto-save feature

Whatever you reasons, integrating with Publisher is rather easy, and this guide will help you go from nothing to working integration.

There are 5 parts of this guide:

1. [Building an Instance of `PublisherInterface`](#building-an-instance-of-publisherinterface) - This part will go through the 3 steps to get everything connected and going.
2. Working With the `PublisherInterface` API - This part will discuss the methods on the `PublisherInterface` class and how to read, write, and listen to the editor.
3. Working With the `editorObject` - This very short part will discuss `editorObject` and why it is still important for testing.
4. Building a Custom Frame Management Panel - In this part, we will build a custom frame management panel utilizing our knowledge of the `PublisherInterface` API
5. Other Resources - Finally, this part will discuss other resources for continuing your knowledge


# Building an Instance of `PublisherInterface`
There are three steps to be able to build a an instance of `PublisherInterface`. Without these steps, you will not able to interact with an editor load in an `<iframe>`.

The steps:
1. Getting a Publisher editor URL
2. Loading the Publisher Interface library
3. Building an instance of the `PublisherInterface` class

## Step 1: Getting a Publisher editor URL
To work with Publisher, you first need a Publisher editor URL.

Below we will go through each step in detail.

After that it is about getting to know the different functions of `PublisherInterface` and `editorObject`.
For learning how to embed a Publisher editor, see: [Embedding an editor in your own portals](https://chilipublishdocs.atlassian.net/wiki/spaces/CPDOC/pages/1413848)



