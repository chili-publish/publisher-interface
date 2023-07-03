import {Connection, connectToParent} from "penpal";
import {Ok, Result, Err} from "../src/types";

declare const window: Window &
  typeof globalThis & {
    editorObject: any;
    OnEditorEvent: any;
    publisher: any;
    registeredFunctions: Map<string, (publisher:any) => void>;
    registeredEventFunctions: Map<string, (publisher:any, id:string) => void>
  };

window.registeredFunctions = new Map();
window.registeredEventFunctions = new Map();

interface InternalWrapper {
  handleEvents(eventName: string, id: string): void;
}

const editorCheck = setInterval(() => {
  if (window.editorObject != null && window.OnEditorEvent != null) {
    setUpConnection();
  }
}, 500);

const registerFunction = (name:string, body:string) => {
  try {
    window.registeredFunctions.set(name, new Function("publisher", "id", body) as any);
    return Ok(undefined);
  }
  catch(e) {
    return Err((e as Error).toString());
  }
}

const registerFunctionOnEvent = (eventName:string, body:string) => {
  try {
    window.editorObject.AddListener(eventName);
    window.registeredEventFunctions.set(eventName, new Function("publisher", body) as any);
    return Ok(undefined);
  }
  catch(e) {
    return Err((e as Error).toString());
  }
}

const runRegisteredFunction = (name:string) => {
  try {
    const func = window.registeredFunctions.get(name);
    if (func != null) {
      func(window.publisher);
      return Ok(undefined);
    }
    return Err(`Function ${name} not found`);
  }
  catch(e) {
    return Err((e as Error).toString());
  }
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

const setUpConnection = () => {
  clearInterval(editorCheck);

  const connection: Connection<InternalWrapper> = connectToParent<InternalWrapper>({
    // Methods child is exposing to parent.
    methods: {
      registerFunction,
      registerFunctionOnEvent,
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

  window.publisher = {
    registerFunction: (name:string, body:string) => {
      const res = registerFunction(name, body);
      if (res.isError) {
        throw new Error(res.error);
      }
      else {
        return res.ok;
      }
    },
    registerFunctionOnEvent: (eventName:string, body:string) => {
      const res = registerFunctionOnEvent(eventName, body);
      if (res.isError) {
        throw new Error(res.error);
      }
      else {
        return res.ok;
      }
    },
    runRegisteredFunction: (name:string) => {
      const res = runRegisteredFunction(name);
      if (res.isError) {
        throw new Error(res.error);
      }
      else {
        return res.ok;
      }
    },
    alert: window.editorObject.Alert,
    getDirtyState: window.editorObject.GetDirtyState,
    nextPage: window.editorObject.NextPage,
    previousPage: window.editorObject.PreviousPage,
    setSelectedPage: window.editorObject.SetSelectedPage,
    getSelectedPage: window.editorObject.GetSelectedPage,
    getSelectedPageName: window.editorObject.GetSelectedPageName,
    getNumPages: window.editorObject.GetNumPages,
    removeListener: window.editorObject.RemoveListener,
    addListener: window.editorObject.AddListener,
    getObject: window.editorObject.GetObject,
    setProperty: window.editorObject.SetProperty,
    executeFunction: window.editorObject.ExecuteFunction,
    getPageSnapshot: window.editorObject.GetPageSnapshot,
    getFrameSnapshot: window.editorObject.GetFrameSnapshot,
    getFrameSubjectArea: window.editorObject.GetFrameSubjectArea,
    setFrameSubjectArea: window.editorObject.SetFrameSubjectArea,
    clearFrameSubjectArea: window.editorObject.ClearFrameSubjectArea,
    getAssetSubjectInfo: window.editorObject.GetAssetSubjectInfo,
    setAssetSubjectInfo: window.editorObject.SetAssetSubjectInfo,
    clearAssetSubjectInfo: window.editorObject.ClearAssetSubjectInfo,
    setVariableIsLocked: window.editorObject.SetVariableIsLocked,
    editorObject: window.editorObject
  }

  window.OnEditorEvent = (eventName: string, id: string) => {

    const eventFunc = window.registeredEventFunctions.get(eventName);

    if (eventFunc != null) eventFunc(window.publisher, id);

    connection.promise.then((parent) => {
      parent.handleEvents(eventName, id);
    });
  };
};
