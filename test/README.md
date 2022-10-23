# Tests README

These tests are unique because Publisher was not designed with testing in mind. Therefore, we must bootstrap our tests on top of Playwright and some custom in browser scripting.

## Run

To the run the tests it is required that you have a working Publisher Editor URL to a document with at least one variable.

It is strongly suggested you use a lightweight document.
It is also suggested to use an anonymous API

You then run the test like so:

```bash
npm run test --  --url "https://ft-nostress.chili-publish.online/ft-nostress/editor_html.aspx?doc=708c426d-969c-49c5-98d5-0d7c0a09a3ab&apiKey=RFdcWfIj_xkLyi+1aczJq7luzqgKrR7sUnXFWly5xDaNTg+FjXetCMGDQXq1B+j73"
```

## Test File Setup

Each test is located in `./test/tests`

These js files will be loaded into the browser using `import()` and therefore must not contain any node modules.

Each test file must follow the format of exporting a default function that returns a Promise with type boolean and takes one parameter, a PublisherInterface object.

Here is the signature:

```typescript
(obj: PublisherInterface) => Promise<boolean>;
```

If the test returns a `true`, then it will be considered as passed by Playwright. If the test returns a `false` or throws an exception, then it will be considered as failed by Playwright.

For each test, the Publisher Editor is being loaded in the iframe. Thus pretty much all test rely on `addListener` to listen for _DocumentFullyLoaded_ or _DocumentFullyRendered_. A timeout could also be used to avoid reliance on `addListener`.

### Writing new tests

So if you want to write a new test you must then do the following:

- Add your test to `./test/tests` directory as a js file.
- The js file should export a default function that meets the type signature above and returns a Promise of boolean. Example

```javascript
export default async function (publisherConnector) {
  // do stuff
  if (testPassed) return true;
  return false;
}
```

- You should probably add a timeout or await on `addListener` for _DocumentFullyLoaded_ or _DocumentFullyRendered_. The Publisher Editor is load in the iframe with each call, so your test will potentially run before the document is loaded.
