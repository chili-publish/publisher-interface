import {Connection, connectToParent} from "penpal";
import {Ok, Result, Err} from "../src/types";

declare const window: Window &
  typeof globalThis & {
    editorObject: any;
    OnEditorEvent: any;
    publisher: any;
    registeredFunctions: Map<string, (...args:any) => void>;
    registeredEventFunctions: Map<string, (id:string) => void>;
    listenerEventShimFunctions: Map<string, (id:string) => void>;
  };

window.registeredFunctions = new Map();
window.registeredEventFunctions = new Map();
window.listenerEventShimFunctions = new Map();

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
    window.registeredFunctions.set(name, new Function(body) as any);
    return Ok(undefined);
  }
  catch(e) {
    return Err((e as Error).toString());
  }
}

const registerFunctionOnEvent = (eventName:string, body:string) => {
  try {
    window.editorObject.AddListener(eventName);
    window.registeredEventFunctions.set(eventName, new Function("targetID", body) as any);
    return Ok(undefined);
  }
  catch(e) {
    return Err((e as Error).toString());
  }
}

const executeRegisteredFunction = (name:string, args:any[]) => {
  try {
    const func = window.registeredFunctions.get(name);
    if (func != null) {
      return Promise.resolve(func(...args)).then(res => Ok(res), err => Err((err as Error).toString()))
    }
    return Promise.resolve(Err(`Function ${name} not found`));
  }
  catch(e) {
    return Promise.resolve(Err((e as Error).toString()));
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
  args: (string | number | boolean | null | undefined)[]
): Result<string | number | boolean | object | null | undefined> => {
  try {
    return Ok(window.editorObject.ExecuteFunction(
      chiliPath,
      functionName,
      ...args
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
      executeRegisteredFunction,
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
    customFunction: {
      register: promisify((name:string, body:string) => {
        const res = registerFunction(name, body);
        if (res.isError) {
          throw new Error(res.error);
        }
        else {
          return res.ok;
        }
      }),
      registerOnEvent: promisify((eventName:string, body:string) => {
        const res = registerFunctionOnEvent(eventName, body);
        if (res.isError) {
          throw new Error(res.error);
        }
        else {
          return res.ok;
        }
      }),
      execute: (name:string, ...args:any[]) => {
        return executeRegisteredFunction(name, args).then(res => {
          if (res.isError) {
            throw new Error(res.error);
          }
          else {
            return res.ok;
          }
        })
      }
    },
    alert: promisify(window.editorObject.Alert),
    getDirtyState: promisify(window.editorObject.GetDirtyState),
    nextPage: promisify(window.editorObject.NextPage),
    previousPage: promisify(window.editorObject.PreviousPage),
    setSelectedPage: promisify(window.editorObject.SetSelectedPage),
    getSelectedPage: promisify(window.editorObject.GetSelectedPage),
    getSelectedPageName: promisify(window.editorObject.GetSelectedPageName),
    getNumPages: promisify(window.editorObject.GetNumPages),
    removeListener: promisify(removeListenerShim),
    addListener: promisify(addListenerShim),
    getObject: promisify(window.editorObject.GetObject),
    setProperty: promisify(window.editorObject.SetProperty),
    executeFunction: promisify(window.editorObject.ExecuteFunction),
    getPageSnapshot: promisify(window.editorObject.GetPageSnapshot),
    getFrameSnapshot: promisify(window.editorObject.GetFrameSnapshot),
    getFrameSubjectArea: promisify(window.editorObject.GetFrameSubjectArea),
    setFrameSubjectArea: promisify(window.editorObject.SetFrameSubjectArea),
    clearFrameSubjectArea: promisify(window.editorObject.ClearFrameSubjectArea),
    getAssetSubjectInfo: promisify(window.editorObject.GetAssetSubjectInfo),
    setAssetSubjectInfo: promisify(window.editorObject.SetAssetSubjectInfo),
    clearAssetSubjectInfo: promisify(window.editorObject.ClearAssetSubjectInfo),
    setVariableIsLocked: promisify(window.editorObject.SetVariableIsLocked),
    editorObject: {
      Alert: promisify(window.editorObject.Alert),
      GetDirtyState: promisify(window.editorObject.GetDirtyState),
      NextPage: promisify(window.editorObject.NextPage),
      PreviousPage: promisify(window.editorObject.PreviousPage),
      SetSelectedPage: promisify(window.editorObject.SetSelectedPage),
      GetSelectedPage: promisify(window.editorObject.GetSelectedPage),
      GetSelectedPageName: promisify(window.editorObject.GetSelectedPageName),
      GetNumPages: promisify(window.editorObject.GetNumPages),
      RemoveListener: promisify(removeListenerShim),
      AddListener: promisify(addListenerShim),
      GetObject: promisify(window.editorObject.GetObject),
      SetProperty: promisify(window.editorObject.SetProperty),
      ExecuteFunction: promisify(window.editorObject.ExecuteFunction),
      GetPageSnapshot: promisify(window.editorObject.GetPageSnapshot),
      GetFrameSnapshot: promisify(window.editorObject.GetFrameSnapshot),
      GetFrameSubjectArea: promisify(window.editorObject.GetFrameSubjectArea),
      SetFrameSubjectArea: promisify(window.editorObject.SetFrameSubjectArea),
      ClearFrameSubjectArea: promisify(window.editorObject.ClearFrameSubjectArea),
      GetAssetSubjectInfo: promisify(window.editorObject.GetAssetSubjectInfo),
      SetAssetSubjectInfo: promisify(window.editorObject.SetAssetSubjectInfo),
      ClearAssetSubjectInfo: promisify(window.editorObject.ClearAssetSubjectInfo),
      SetVariableIsLocked: promisify(window.editorObject.SetVariableIsLocked),
    }
  }

  window.OnEditorEvent = (eventName: string, id: string) => {

    const registeredFunc = window.registeredEventFunctions.get(eventName);
    if (registeredFunc != null) registeredFunc(id);

    const listenerFunc = window.listenerEventShimFunctions.get(eventName);
    if (listenerFunc != null) listenerFunc(id);

    connection.promise.then((parent:any) => {
      parent.handleEvents(eventName, id);
    });
  };
};

function addListenerShim(eventName:string, callbackFunction?: (targetId: string) => void) {
  window.editorObject.AddListener(eventName);
  if (callbackFunction != null) {
    window.listenerEventShimFunctions.set(eventName, callbackFunction);
  }
}

function removeListenerShim(eventName:string) {
  window.editorObject.RemoveListener(eventName);
  window.listenerEventShimFunctions.delete(eventName);
}

function promisify(func:any) {return (...args: any) => Promise.resolve(func(...args))}
