import { test, expect } from "@playwright/test";

const testsPublisherInterface = {
  Alert: {
    send: ["message", "title"],
    response: undefined,
  },
  GetDirtyState: {
    send: [],
    response: true,
  },
  NextPage: {
    send: [],
    response: undefined,
  },
  PreviousPage: {
    send: [],
    response: undefined,
  },
  SetSelectedPage: {
    send: [1],
    response: undefined,
  },
  GetSelectedPage: {
    send: [],
    response: 1,
  },
  GetSelectedPageName: {
    send: [],
    response: "one",
  },
  GetNumPages: {
    send: [],
    response: 2,
  },
  RemoveListener:{
    send: ["Event"],
    response: undefined,
  },
  AddListener: {
    send: ["Event"],
    response: undefined,
  },
  GetObject: {
    send: ["test"],
    response: "test",
  },
  SetProperty: {
    send: ["test", "value", "set"],
    response: undefined,
  },
  ExecuteFunction: {
    send: ["test", "function", "arg1", "arg2", "arg3"],
    response: {sent:true},
  },
  GetPageSnapshot: {
    send: [1, "100", ["layer", "layerAgain"], ["frame1", "frame2"], "viewMode", true],
    response: "PNG",
  },
  GetFrameSnapshot: {
    send: ["id", "100", true],
    response: "PNG",
  },
  GetFrameSubjectArea: {
    send: ["id"],
    response: { height: "string", width: "string", x: "string", y: "string" },
  },
  SetFrameSubjectArea: {
    send: ["id", 1, 2, 3, 4],
    response: undefined,
  },
  ClearFrameSubjectArea: {
    send: ["id"],
    response: undefined,
  },
  GetAssetSubjectInfo: {
    send: ["id"],
    response: {
      height: "string",
      width: "string",
      x: "string",
      y: "string",
      poiX: "string",
      poiY: "string"
    },
  },
  SetAssetSubjectInfo: {
    send: ["id", 1, 2, 3, 4, 5, 6],
    response: undefined,
  },
  ClearAssetSubjectInfo: {
    send: ["id"],
    response: undefined,
  },
  SetVariableIsLocked: {
    send: ["name", false],
    response: undefined,
  },
}

for (const name of Object.keys(testsPublisherInterface)) {
  test("Test " + name + " [pass iframe]", async ({ page }) => {
      await page.goto("http://localhost:3001");
      const result = await page.evaluate(
        (test) => window.runTest(test),
        {name, send:testsPublisherInterface[name].send, response:testsPublisherInterface[name].response, file:"publisherInterface"}
      );
      expect(result).toBe(true);
  });
  test("Test " + name + " [build iframe]", async ({ page }) => {
    await page.goto("http://localhost:3001");
    const result = await page.evaluate(
      (test) => window.runTest(test),
      {name, send:testsPublisherInterface[name].send, response:testsPublisherInterface[name].response, file:"publisherInterface", passIframe:false}
    );
    expect(result).toBe(true);
});
}