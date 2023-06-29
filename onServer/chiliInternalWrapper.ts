import {Connection, connectToParent} from "penpal";
import {Ok, Result, Err} from "../src/types";

declare const window: Window &
  typeof globalThis & {
    editorObject: any;
    OnEditorEvent: any;
    registeredFunctions: Map<string, (editor:any) => void>
  };

interface InternalWrapper {
  handleEvents(eventName: string, id: string): void;
}

const editorCheck = setInterval(() => {
  if (window.editorObject != null && window.OnEditorEvent != null) {
    setUpConnection();
  }
}, 500);

let connection: Connection<InternalWrapper>;
const setUpConnection = () => {
  clearInterval(editorCheck);

  connection = connectToParent<InternalWrapper>({
    // Methods child is exposing to parent.
    methods: {
      registerFunction,
      runRegisteredFunction,
      alert,
      getDirtyState,
      nextPage,
      previousPage,
      setSelectedPage,
      getSelectedPage,
      getSelectedPageName,
      getNumPages,
      removeListener,
      addListener,
      setProperty,
      getObject,
      executeFunction,
      getPageSnapshot,
      getFrameSnapshot,
      getFrameSubjectArea,
      setFrameSubjectArea,
      clearFrameSubjectArea,
      getAssetSubjectInfo,
      setAssetSubjectInfo,
      clearAssetSubjectInfo,
      setVariableIsLocked,
    },
  });

  window.OnEditorEvent = (eventName: string, id: string) => {
    connection.promise.then((parent) => {
      parent.handleEvents(eventName, id);
    });
  };
};

window.registeredFunctions = new Map();

const registerFunction = (name:string, body:string) => {
  window.registeredFunctions.set(name, new Function(body, window.editorObject) as any);
}

const runRegisteredFunction = (name:string) => {
  const func = window.registeredFunctions.get(name);
  if (func != null) func(window.editorObject);
}

const alert = (
  message: string,
  title: string
): Result<undefined> => {
  try {
    window.editorObject.Alert(message, title);
    return Ok(undefined);
  } catch (e) {
    return Err((e as Error).toString());
  }
};

const getDirtyState = (): Result<boolean> => {
  try {
    return Ok(window.editorObject.GetDirtyState());
  } catch (e) {
    return Err((e as Error).toString());
  }
};

const nextPage = (): Result<undefined> => {
  try {
    window.editorObject.NextPage();
    return Ok(undefined);
  } catch (e) {
    return Err((e as Error).toString());
  }
};

const previousPage = (): Result<undefined> => {
  try {
    window.editorObject.PreviousPage();
    return Ok(undefined);
  } catch (e) {
    return Err((e as Error).toString());
  }
};

const setSelectedPage = (
  page: number
): Result<undefined> => {
  try {
    window.editorObject.SetSelectedPage(page);
    return Ok(undefined);
  } catch (e) {
    return Err((e as Error).toString());
  }
};

const getSelectedPage = (): Result<number> => {
  try {
    return Ok(window.editorObject.GetSelectedPage());
  } catch (e) {
    return Err((e as Error).toString());
  }
};

const getSelectedPageName = (): Result<string> => {
  try {
    return Ok(window.editorObject.GetSelectedPageName());
  } catch (e) {
    return Err((e as Error).toString());
  }
};

const getNumPages = (): Result<number> => {
  try {
    return Ok(window.editorObject.GetNumPages());
  } catch (e) {
    return Err((e as Error).toString());
  }
};

const removeListener = (
  eventName: string
): Result<undefined> => {
  try {
    window.editorObject.RemoveListener(eventName);
    return Ok(undefined);
  } catch (e) {
    return Err((e as Error).toString());
  }
};

const addListener = (
  eventName: string
): Result<undefined> => {
  try {
    window.editorObject.AddListener(eventName);
    return Ok(undefined);
  } catch (e) {
    return Err((e as Error).toString());
  }
};

const getObject = (
  chiliPath: string
): Result<string | number | boolean | object | null | undefined> => {
  try {
    return Ok(window.editorObject.GetObject(chiliPath));
  } catch (e) {
    return Err((e as Error).toString());
  }
};

const setProperty = (
  chiliPath: string,
  property: string,
  value: string | number | boolean | null
): Result<undefined> => {
  try {
    window.editorObject.SetProperty(chiliPath, property, value);
    return Ok(undefined);
  } catch (e) {
    return Err((e as Error).toString());
  }
};

const executeFunction = (
  chiliPath: string,
  functionName: string,
  params: (string | number | boolean | null | undefined)[]
): Result<string | number | boolean | object | null | undefined> => {
  try {
    return Ok(window.editorObject.ExecuteFunction(
      chiliPath,
      functionName,
      ...params
    ));
  } catch (e) {
    return Err((e as Error).toString());
  }
};

const getPageSnapshot = (
  pageIndex: number,
  size: string | { width: number; height: number } | number,
  layers: string[] | null,
  frames: string[] | null,
  viewMode: "preview" | "edit" | "technical",
  transparentBackground: boolean
): Result<string> => {
  try {
    return Ok(window.editorObject.GetPageSnapshot(
      pageIndex,
      size,
      layers,
      frames,
      viewMode,
      transparentBackground
    ));
  } catch (e) {
    return Err((e as Error).toString());
  }
};

const getFrameSnapshot = (
  idOrTag: string,
  size: string | { width: number; height: number } | number,
  transparentBackground: boolean
): Result<string> => {
  try {
    return Ok(window.editorObject.GetFrameSnapshot(
      idOrTag,
      size,
      transparentBackground
    ));
  } catch (e) {
    return Err((e as Error).toString());
  }
};

const getFrameSubjectArea = (
  idOrTag: string
): Result<{ height: string; width: string; x: string; y: string }> => {
  try {
    return Ok(window.editorObject.GetFrameSubjectArea(idOrTag));
  } catch (e) {
    return Err((e as Error).toString());
  }
};

const setFrameSubjectArea = (
  idOrTag: string,
  x: number,
  y: number,
  width: number,
  height: number
): Result<undefined> => {
  try {
    window.editorObject.SetFrameSubjectArea(idOrTag, x, y, width, height);
    return Ok(undefined);
  } catch (e) {
    return Err((e as Error).toString());
  }
};

const clearFrameSubjectArea = (
  idOrTag: string
): Result<undefined> => {
  try {
    window.editorObject.ClearFrameSubjectArea(idOrTag);
    return Ok(undefined);
  } catch (e) {
    return Err((e as Error).toString());
  }
};

const getAssetSubjectInfo = (
  frameIdOrTag: string
): Result<{
  height: string;
  width: string;
  x: string;
  y: string;
  poiX: string;
  poiY: string;
}> => {
  try {
    return Ok(window.editorObject.GetAssetSubjectInfo(frameIdOrTag));
  } catch (e) {
    return Err((e as Error).toString());
  }
};

const setAssetSubjectInfo = (
  frameIdOrTag: string,
  x: number,
  y: number,
  width: number,
  height: number,
  poiX: number,
  poiY: number
): Result<undefined> => {
  try {
    window.editorObject.SetAssetSubjectInfo(
      frameIdOrTag,
      x,
      y,
      width,
      height,
      poiX,
      poiY
    );
    return Ok(undefined);
  } catch (e) {
    return Err((e as Error).toString());
  }
};

const clearAssetSubjectInfo = (
  frameIdOrTag: string
): Result<undefined> => {
  try {
    window.editorObject.ClearAssetSubjectInfo(frameIdOrTag);
    return Ok(undefined);
  } catch (e) {
    return Err((e as Error).toString());
  }
};

const setVariableIsLocked = (
  variableName: string,
  isLocked: boolean
): Result<undefined> => {
  try {
    window.editorObject.SetVariableIsLocked(variableName, isLocked);
    return Ok(undefined);
  } catch (e) {
    return Err((e as Error).toString());
  }
};
