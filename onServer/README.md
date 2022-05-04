# Internal Wrapper

For the PublisherConnector to work, the internal wrapper must be installed on the CHILI server.

⛔ This script and instructions are meant for use on a CHILI server. If you are using PublisherConnector for with CHILI
publisher Online, you can just ignore this file.

### Install

To install you do the following

1. Run `npm run build`.
2. Copy `distServer/chiliInternalWrapper.js` to the scripts folder of your CHILI web app.
3. Modify `editor_html.aspx`, adding this line at the bottom of the body.

```
<script type="text/javascript" src="../scripts/chiliInternalWrapper.js"></script>
```
