declare const window: {OnEditorEvent? : (arg0: string, arg1: string) => void}

import {AsyncMethodReturns, connectToChild} from "penpal";
import {Result} from "./types";

interface ChiliWrapper {

  registerFunction(name:string, body:string): Result<undefined>;

  registerFunctionOnEvent(eventName:string, body:string): Result<undefined>;

  executeRegisteredFunction(
    name: string, 
    args: any[]
  ): Result<undefined>;

  alert(
    message: string,
    title: string
  ): Result<undefined>;

  getDirtyState(): Result<boolean>;

  nextPage(): Result<undefined>;

  previousPage(): Result<undefined>;

  setSelectedPage(page: number): Result<undefined>;

  getSelectedPage(): Result<number>;

  getSelectedPageName(): Result<string>;

  getNumPages(): Result<number>;

  removeListener(eventName: string): Result<undefined>;

  addListener(eventName: string): Result<undefined>;

  getObject(
    chiliPath: string
  ):
    | Result<string | number | boolean | object | null | undefined>;

  setProperty(
    chiliPath: string,
    property: string,
    value: string | number | boolean | null
  ): Result<undefined>;

  executeFunction(
    chiliPath: string,
    functionName: string,
    args: (string | number | boolean | null | undefined)[]
  ):
    | Result<string | number | boolean | object | null | undefined>;

  getPageSnapshot(
    pageIndex: number,
    size: string | { width: number; height: number } | number,
    layers: string[] | null,
    frames: string[] | null,
    viewMode: "preview" | "edit" | "technical",
    transparentBackground: boolean
  ): Result<string>;

  getFrameSnapshot(
    idOrTag: string,
    size: string | { width: number; height: number } | number,
    transparentBackground: boolean
  ): Result<string>;

  getFrameSubjectArea(
    idOrTag: string
  ):
    | Result<{ height: string; width: string; x: string; y: string }>;

  setFrameSubjectArea(
    idOrTag: string,
    x: number,
    y: number,
    width: number,
    height: number
  ): Result<undefined>;

  clearFrameSubjectArea(
    idOrTag: string
  ): Result<undefined>;

  getAssetSubjectInfo(frameIdOrTag: string):
    | Result<{
    height: string;
    width: string;
    x: string;
    y: string;
    poiX: string;
    poiY: string;
  }>;

  setAssetSubjectInfo(
    frameIdOrTag: string,
    x: number,
    y: number,
    width: number,
    height: number,
    poiX: number,
    poiY: number
  ): Result<undefined>;

  clearAssetSubjectInfo(
    frameIdOrTag: string
  ): Result<undefined>;

  setVariableIsLocked(
    variableName: string,
    isLocked: boolean
  ): Result<undefined>;
}

export type CommonBuildOptions = {
    /**
     * If not null, the number of milliseconds to wait for a connection to iframe before throwing an exception.
     */
    timeout?: number,
    /**
     * If true, PublisherInterface and the underlining library penpal will log debug info in the console. Useful for debugging connection issues.
     */
    debug?: boolean,
    /**
     * Pass in an array of events that will be auto-added via `addListener()`
     */
    events?:(string|{name:string, func?:(targetId: string) => void})[]
  }


export type AllBuildOptions = ({
  /** 
   * iframe element to the PublisherInterface will try to connect with
  */
  targetIframe:HTMLIFrameElement,
  /**
   * The url that will be set on the iframe - this needs to be a valid URL with a valid API key
   */
  editorURL?:string,
  parentElement?: undefined

} | {
  targetIframe?: undefined
  /**
   * The url that will be set on the iframe - this needs to be a valid URL with a valid API key
   */
  editorURL:string,
  /**
   * The element that a new iframe will be created with URL from `edtiorURL`
   */
  parentElement: HTMLElement,
})
 & CommonBuildOptions

export type CustomFunctionsInterface = {
    /**
   * Register a custom function on the iframe window side. The function takes a parameter: publisher. This function has access to the window. You can access other custom functions registered using window.registeredFunctions, which is a Map. 
   * 
   * @param name - The name of the function to register.
   * @param body - The body of the function.
   */
  register: (name:string, body:string) => Promise<void>,

  /**
   * Register a custom function on the iframe window side that runs when an event is called. The function takes two parameters: publisher and targetID. This function has access to the window. You can access other custom functions registered using window.registeredFunctions, which is a Map.
   * 
   * @param eventName - The name of the event to trigger the function.
   * @param body - The body of the function.
   */
  registerOnEvent: (eventName:string, body:string) => Promise<void>,

  /**
   * Executes a function that was registered originally by registerFunction on the iframe window side and allows you to pass any number of args. It will return the result of the called function.
   * 
   * @param name - The name of the function to run.
   * @param args - Arguments that will be passed to the function
   */
    execute: (name: string, ...args:any) => Promise<any>
}


const createCustomFunctionsInterface = function(chiliWrapper:AsyncMethodReturns<ChiliWrapper>, createDebugLog:(p:{functionName:string})=>void):CustomFunctionsInterface {
  return {

    register: async function(name:string, body:string): Promise<void> {
      createDebugLog({functionName:"registerFunction()"});
      const response = await chiliWrapper.registerFunction(name, body);
      if (response.isError) {
        throw new Error(response.error)
      }
    },
  
    registerOnEvent: async function(eventName:string, body:string): Promise<void> {
      createDebugLog({functionName:"registerFunction()"});
      const response = await chiliWrapper.registerFunctionOnEvent(eventName, body);
      if (response.isError) {
        throw new Error(response.error)
      }
    },
  
    execute: async function(name: string, ...args:any): Promise<any> {
      createDebugLog({functionName:"executeRegisteredFunction()"});
      const response = await chiliWrapper.executeRegisteredFunction(name, args);
      if (response.isError) {
        throw new Error(response.error);
      }
      return response.ok;
    }
  }
}

export class PublisherInterface {
  public customFunction: CustomFunctionsInterface = {
    register: function (name: string, body: string): Promise<void> {
      throw new Error("Function not implemented.");
    },
    registerOnEvent: function (eventName: string, body: string): Promise<void> {
      throw new Error("Function not implemented.");
    },
    execute: function (name: string, args:any[]): Promise<any> {
      throw new Error("Function not implemented.");
    }
  };
  /**
   * The IFrame element this PublisherInterface is connected with once successifully connected. Returns undefined if not connected.
   */
  public iframe: HTMLIFrameElement | undefined;
  private child!: AsyncMethodReturns<ChiliWrapper>;
  private chiliEventListenerCallbacks: Map<string, (targetId: string) => void> =
      new Map<string, (targetId: string) => void>();
  private debug = false;
  private creationTime = "";

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
  }

  static async buildWithIframe(targetIframe:HTMLIFrameElement, options:CommonBuildOptions) {
    return PublisherInterface.build({targetIframe, ...options})
  }

  static async buildOnElement(parentElement:HTMLElement, editorURL:string, options:CommonBuildOptions) {
    return PublisherInterface.build({parentElement, editorURL, ...options})
  }

  /**
   * The build method will wait for a connection to the other side of iframe. Must be called before iframe `onload` event is fired.
   *
   * @param iframe
   * @param options
   * @returns {PublisherInterface}
   */
  static async build(options:AllBuildOptions) {
    
    // Supporting code that is expecting pre 1.0 behavior
    if (arguments[0].tagName == "IFRAME"){

      const originalOptions = arguments[1] ?? {};

      options = {
        ...originalOptions,
        targetIframe: arguments[0],
        debug: options.debug ?? originalOptions["penpalDebug"]
      }
    }
    
    const publisherInterface = new PublisherInterface();
    publisherInterface.creationTime = new Date().toLocaleString();
    publisherInterface.debug = options.debug ?? false;
    publisherInterface.createDebugLog({functionName:"build()", customMessage:"Calling build() with options: " + JSON.stringify(options)})

    const iframe = options.targetIframe ?? document.createElement("iframe");
    publisherInterface.iframe = iframe;

    if (options.editorURL != null) {
      iframe.src = options.editorURL;
    }
    
    const connectionPromise = connectToChild<ChiliWrapper>({
      // The iframe to which a connection should be made
      iframe,
      // Methods the parent is exposing to the child
      methods: {
        handleEvents: publisherInterface.handleEvents.bind(publisherInterface),
      },
      timeout: options.timeout,
      debug: options.debug
    })

    if (options.parentElement != null) {
      options.parentElement.appendChild(iframe);
    }

    publisherInterface.child = await connectionPromise.promise;
    publisherInterface.customFunction = createCustomFunctionsInterface(publisherInterface.child, publisherInterface.createDebugLog.bind(publisherInterface));

    const events = options.events;

    if (events != null && events.length > 0) {
      for (const event of events) {
        if (typeof(event) == "string") {
          publisherInterface.addListener(event)
        }
        else {
          publisherInterface.addListener(event.name, event.func)
        }
      }
    }

    return publisherInterface;
  }

  private handleEvents(eventName: string, id: string) {
    this.chiliEventListenerCallbacks.has(eventName) &&
      this.chiliEventListenerCallbacks.get(eventName)?.(id);
    return eventName;
  }

  /**
   * Logs a function call creation if debug is enabled
   * @param functionName The name of the function being executed
   */
  private createDebugLog({functionName, customMessage}:{functionName: string, customMessage?:string}) {
    if (this.debug) {
      if (customMessage != null) {
        console.log(`[PublisherInterface - ${this.creationTime}]`, `${functionName} : ${customMessage}`);
      }
      else {
        console.log(`[PublisherInterface - ${this.creationTime}]`, `Creating ${functionName} call request`);
      }
    }
  }

  #editorObject:EditorObjectAlias|null = null
  /**
   * Returns an alias for editorObject with similarly named functions. This is to help with backwards compatibility, but these functions still return a Promise.
   */
  get editorObject() {
    if (this.#editorObject == null) {
      this.#editorObject = {
          Alert: this.alert.bind(this),
          GetDirtyState: this.getDirtyState.bind(this),
          NextPage: this.nextPage.bind(this),
          PreviousPage: this.previousPage.bind(this),
          SetSelectedPage: this.setSelectedPage.bind(this),
          GetSelectedPage: this.getSelectedPage.bind(this),
          GetSelectedPageName: this.getSelectedPageName.bind(this),
          GetNumPages: this.getNumPages.bind(this),
          RemoveListener:this.removeListener.bind(this),
          AddListener: this.addListener.bind(this),
          GetObject: this.getObject.bind(this),
          SetProperty: this.setProperty.bind(this),
          ExecuteFunction: this.executeFunction.bind(this),
          GetPageSnapshot: this.getPageSnapshot.bind(this),
          GetFrameSnapshot: this.getFrameSnapshot.bind(this),
          GetFrameSubjectArea: this.getFrameSubjectArea.bind(this),
          SetFrameSubjectArea: this.setFrameSubjectArea.bind(this),
          ClearFrameSubjectArea: this.clearFrameSubjectArea.bind(this),
          GetAssetSubjectInfo: this.getAssetSubjectInfo.bind(this),
          SetAssetSubjectInfo: this.setAssetSubjectInfo.bind(this),
          ClearAssetSubjectInfo: this.clearAssetSubjectInfo.bind(this),
          SetVariableIsLocked: this.setVariableIsLocked.bind(this),
        }
    }

    return this.#editorObject;
  }
  
  /**
   * Displays a modal box within the editor UI containing a title with a message.
   *
   * @param message - The message to be displayed.
   * @param title - The title/header of the modal.
   */
  public async alert(message: string, title: string): Promise<void> {
    this.createDebugLog({functionName:"alert()"});
    const response = await this.child.alert(message, title);
    if (response.isError) {
      throw new Error(response.error)
    }
  }

  /**
   * Returns value of document.isDirty which signifies if the document has been changed since previous save.
   *
   * @returns Returns boolean to signify if the document has been changed since previous save.
   */
  public async getDirtyState(): Promise<boolean> {
    this.createDebugLog({functionName:"getDirtyState()"});
    const response = await this.child.getDirtyState();
    if (response.isError) {
      throw new Error(response.error)
    }
    return response.ok;
  }

  /**
   * Selects the next page in the document.pages list.
   * If the current selected page has the beginning index 0 then nothing happens.
   */
  public async nextPage(): Promise<void> {
    this.createDebugLog({functionName:"nextPage()"});
    const response = await this.child.nextPage();
    if (response.isError) {
      throw new Error(response.error)
    }
  }

  /**
   * Selects the previous page in the document.pages list.
   * If the current selected page has the last index then nothing happens.
   */
  public async previousPage(): Promise<void> {
    this.createDebugLog({functionName:"previousPage()"});
    const response = await this.child.previousPage();
    if (response.isError) {
      throw new Error(response.error)
    }
  }

  /**
   * Selects page by common language page number causing the editor to visually jump to that page.
   *
   * @param page - Common language page number (page index + 1) to select.
   */
  public async setSelectedPage(page: number): Promise<void> {
    this.createDebugLog({functionName:"setSelectedPage()"});
    const response = await this.child.setSelectedPage(page);
    if (response.isError) {
      throw new Error(response.error)
    }
  }

  /**
   * Returns the common language page number, which is page index + 1.
   * So if you have page with index 0 selected, this would return 1.
   *
   * @returns Page index + 1 of the selected page.
   */
  public async getSelectedPage(): Promise<number> {
    this.createDebugLog({functionName:"getSelectedPage()"});
    const response = await this.child.getSelectedPage();
    if (response.isError) {
      throw new Error(response.error)
    }
    return response.ok;
  }

  /**
   * Returns the name of the selected page.
   *
   * @returns Name of the page.
   */
  public async getSelectedPageName(): Promise<string> {
    this.createDebugLog({functionName:"getSelectedPageName()"});
    const response = await this.child.getSelectedPageName();
    if (response.isError) {
      throw new Error(response.error)
    }
    return response.ok;
  }

  /**
   * Returns the total number of pages.
   *
   * @returns The total number of pages.
   */
  public async getNumPages(): Promise<number> {
    this.createDebugLog({functionName:"getNumPages()"});
    const response = await this.child.getNumPages();
    if (response.isError) {
      throw new Error(response.error)
    }
    return response.ok;
  }

  /**
   * Removes the listener for the specified editor event.
   *
   * @param eventName - A case-sensitive string representing the editor event type to stop listening to.
   */
  public async removeListener(eventName: string): Promise<void> {
    this.createDebugLog({functionName:"removeListener()"});
    this.chiliEventListenerCallbacks.delete(eventName);
    const response = await this.child.removeListener(eventName);
    if (response.isError) {
      throw new Error(response.error)
    }
  }

  /**
   * Adds a listener to an editor event and a user defined callback function when event is fired.
   * The function will receive the target id of the event and is executed when the event is triggered.
   *
   * @example
   * ```ts
   * publisherInterface.addListener("FrameMoved", (targetId)=>{console.log(targetId)}));
   * ```
   * @param eventName - A case-sensitive string representing the editor event type to listen for.
   * @param callbackFunction - A function that executes when the event is triggered. If callback is null, the listener will instead call window.OnEditorEvent
   */
  public async addListener(
    eventName: string,
    callbackFunction?: (target: string) => void
  ): Promise<void> {

    this.createDebugLog({functionName:"addListener()"});
    this.chiliEventListenerCallbacks.set(eventName, callbackFunction == null ? (targetID) => {
      if (window.OnEditorEvent != null) window.OnEditorEvent(eventName, targetID)
    } : callbackFunction)

    const response = await this.child.addListener(eventName);
    if (response.isError) {
      throw new Error(response.error)
    }
  }

  /**
   * Gets the value of the property or object found at given chiliPath.
   *
   * @param chiliPath - A case-sensitive string query path for selecting properties and objects in a CHILI document.
   * @returns Returns the value of the property or object found at given chiliPath.
   */
  public async getObject(
    chiliPath: string
  ): Promise<string | number | boolean | object | null | undefined> {
    this.createDebugLog({functionName:"getObject()"});
    const response = await this.child.getObject(chiliPath);
    if (response.isError) {
      throw new Error(response.error)
    }
    return response.ok;
  }

  /**
   * Make getProperty an alias for getObject
   */
  public getProperty = this.getObject;

  /**
   * Sets the value of the property defined by property on the object defined by the chiliPath
   *
   * @param chiliPath - A case-sensitive string query path for selecting properties and objects in a CHILI document.
   * @param property - The case-sensitive string name of the property found on the object of the chiliPath.
   * @param value - The value to set the property.
   */
  public async setProperty(
    chiliPath: string,
    property: string,
    value: string | number | boolean | null
  ): Promise<void> {
    this.createDebugLog({functionName:"setProperty()"});
    const response = await this.child.setProperty(chiliPath, property, value);
    if (response.isError) {
      throw new Error(response.error)
    }
  }

  /**
   * Executes function of functionName found as a property or method on the object defined in the chiliPath.
   *
   * @example
   * // Will add a new frame of type text on page of index 0 at coordinates X: 10 mm and Y: 15 mm with width: 100 mm and height: 50 mm
   * ```ts
   * publisherInterface.executeFunction('document.pages[0].frames', 'Add', 'text', '10 mm', '15 mm', '100 mm', '50 mm');
   * ```
   * @param chiliPath - A case-sensitive string query path for selecting properties and objects in a CHILI document.
   * @param functionName - A case-sensitive string of the name of the function to execute.
   * @param args - Parameters to be passed to function of functionName.
   * @returns Returns the return of executed function.
   */
  public async executeFunction(
    chiliPath: string,
    functionName: string,
    ...args: (string | number | boolean | null | undefined)[]
  ): Promise<string | number | boolean | object | null | undefined> {
    this.createDebugLog({functionName:"executeFunction()"});
    const response = await this.child.executeFunction(
      chiliPath,
      functionName,
      args
    );
    if (response.isError) {
      throw new Error(response.error)
    }
    return response.ok;
  }

  /**
   * Returns a base64 encoded PNG snapshot image of a specific page.
   *
   * @example
   * ```ts
   * \\ This will get a 1000 by 1000 image of the first page and open it in a popup.
   * let base64 = publisherInterface.getPageSnapshot('0', '1000x1000', null, null, 'preview', true);
   *
   * let newImage = new Image();
   * newImage.src = "data:image/png;base64," + base64;
   *
   * let popup = open("", "Popup", "width=1000,height=1000,top="+(window.screen.height/2)+",left="+(window.screen.height/2));
   * popup.document.body.appendChild(newImage);
   * ```
   *
   * @param pageIndex - The page index to return as an image.
   * @param size - The size of the returned png. This can be set as an image size in pixels by using a string width x height. For example "1000x1500". This can be set as a zoom level. For example "75" would be 75% zoom of the document. This can be set as an object of width and height. For example \{width:1000 height:1000\}. If the size is set in pixels and the ratio is different from the page ratio, the image is scaled to fit entirely in the png and placed at (0,0) top left. The extra space at the bottom or the right is filled with background color. If a zoom percentage is given, the output size is automatically calculated using the document dimensions, assuming the resolution is 72 dpi.
   * @param layers - An array of layers that are to be visible in the png. An array of visible layers can be provided using the layer "name" property or layer "id" property. If no list is passed, the layer visibility is the same as in the editor window.
   * @param frames - An array of frames that are visible in the png. An array of visible frame elements can be provided using the frame "tag" property or layer "id" property. If no list is passed, the frame visibility is the same as in the editor window.
   * @param viewMode - A string that is either: preview, edit, or technical. "preview" shows the page in standard preview mode in the same way as the editor does. If there is an active selection, it should not be indicated in the resulting png. Annotations should be hidden. "edit" shows the page in standard edit mode in the same way as the editor does. The view can be identical to the editor view, with active selections and frame handles. "technical" shows the page in edit mode, but without the control handles and selections. Annotations should be hidden.
   * @param transparentBackground - A boolean that determines if the png document background should be transparent.
   * @returns A base64 encoded PNG image of the document.
   */
  public async getPageSnapshot(
    pageIndex: number,
    size: string | { width: number; height: number } | number,
    layers: string[] | null,
    frames: string[] | null,
    viewMode: "preview" | "edit" | "technical",
    transparentBackground: boolean
  ): Promise<string> {
    this.createDebugLog({functionName:"getPageSnapshot()"});
    const response = await this.child.getPageSnapshot(
      pageIndex,
      size,
      layers,
      frames,
      viewMode,
      transparentBackground
    );
    if (response.isError) {
      throw new Error(response.error)
    }
    return response.ok;
  }

  /**
   * Returns a base64 encoded PNG snapshot image of a specific frame
   *
   * @param idOrTag - The id or tag of the frame to return as an image.
   * @param size - The size of the returned png. This can be set as an image size in pixels by using a string width x height. For example "1000x1500". This can be set as a zoom level. For example "75" would be 75% zoom of the document. This can be set as an object of width and height. For example \{width:1000 height:1000\}. If the size is set in pixels and the ratio is different from the page ratio, the image is scaled to fit entirely in the png and placed at (0,0) top left. The extra space at the bottom or the right is filled with background color. If a zoom percentage is given, the output size is automatically calculated using the document dimensions, assuming the resolution is 72 dpi.
   * @param transparentBackground - A boolean that determines if the png document background should be transparent.
   * @returns A base64 encoded PNG image of the frame.
   */
  public async getFrameSnapshot(
    idOrTag: string,
    size: string | { width: number; height: number } | number,
    transparentBackground: boolean
  ): Promise<string> {
    this.createDebugLog({functionName:"getFrameSnapshot()"});
    const response = await this.child.getFrameSnapshot(
      idOrTag,
      size,
      transparentBackground
    );
    if (response.isError) {
      throw new Error(response.error)
    }
    return response.ok;
  }

  /**
   * Gets the frame subject area for the image fit mode Smart Fit.
   *
   * @param idOrTag - The string id or tag of the frame.
   * @returns - The subject area of the frame.
   */
  public async getFrameSubjectArea(
    idOrTag: string
  ): Promise<{ height: string; width: string; x: string; y: string }> {
    this.createDebugLog({functionName:"getFrameSubjectArea()"});
    const response = await this.child.getFrameSubjectArea(idOrTag);
    if (response.isError) {
      throw new Error(response.error)
    }
    return response.ok;
  }

  /**
   * Sets the frame subject area for the image fit mode Smart Fit.
   *
   * @param idOrTag - The string id or tag of the frame.
   * @param x - A number 0 to 1 representing the x coordinate. Setting the number outside that range will clip the result to 0 or 1.
   * @param y - A number 0 to 1 representing the y coordinate. Setting the number outside that range will clip the result to 0 or 1.
   * @param width - A number 0 to 1 representing width. Setting the number outside that range will clip the result to 0 or 1.
   * @param height -A number 0 to 1 representing height. Setting the number outside that range will clip the result to 0 or 1.
   */
  public async setFrameSubjectArea(
    idOrTag: string,
    x: number,
    y: number,
    width: number,
    height: number
  ): Promise<void> {
    this.createDebugLog({functionName:"setFrameSubjectArea()"});
    const response = await this.child.setFrameSubjectArea(
      idOrTag,
      x,
      y,
      width,
      height
    );
    if (response.isError) {
      throw new Error(response.error)
    }
  }

  /**
   * Resets the frame subject area to \{height: "0", width: "0", x: "1", y: "1"\}.
   *
   * @param idOrTag - The string id or tag of the frame to clear the subject area.
   */
  public async clearFrameSubjectArea(idOrTag: string): Promise<void> {
    this.createDebugLog({functionName:"clearFrameSubjectArea()"});
    const response = await this.child.clearFrameSubjectArea(idOrTag);
    if (response.isError) {
      throw new Error(response.error)
    }
  }

  /**
   * Gets the asset subject area for the target frame for image fit mode Smart Fit.
   *
   * @param frameIdOrTag - The string id or tag of the frame.
   * @returns The asset subject area.
   */
  public async getAssetSubjectInfo(frameIdOrTag: string): Promise<{
    height: string;
    width: string;
    x: string;
    y: string;
    poiX: string;
    poiY: string;
  }> {
    this.createDebugLog({functionName:"getAssetSubjectInfo()"});
    const response = await this.child.getAssetSubjectInfo(frameIdOrTag);
    if (response.isError) {
      throw new Error(response.error)
    }
    return response.ok;
  }

  /**
   * Sets the asset subject area for the target frame for image fit mode Smart Fit.
   *
   * @param frameIdOrTag - The string id or tag of the frame.
   * @param x - A number 0 to 1 representing the x coordinate. Setting the number outside that range will clip the result to 0 or 1.
   * @param y - A number 0 to 1 representing the y coordinate. Setting the number outside that range will clip the result to 0 or 1.
   * @param width - A number 0 to 1 representing width. Setting the number outside that range will clip the result to 0 or 1.
   * @param height - A number 0 to 1 representing height. Setting the number outside that range will clip the result to 0 or 1.
   * @param poiX - A number 0 to 1 representing x coordinate of teh point of interest. Setting the number outside that range will clip the result to 0 or 1.
   * @param poiY - A number 0 to 1 representing y coordinate of teh point of interest.
   */
  public async setAssetSubjectInfo(
    frameIdOrTag: string,
    x: number,
    y: number,
    width: number,
    height: number,
    poiX: number,
    poiY: number
  ): Promise<void> {
    this.createDebugLog({functionName:"setAssetSubjectInfo()"});
    const response = await this.child.setAssetSubjectInfo(
      frameIdOrTag,
      x,
      y,
      width,
      height,
      poiX,
      poiY
    );
    if (response.isError) {
      throw new Error(response.error)
    }
  }

  /**
   * Resets the asset subject area of target to \{height: "0", width: "0", x: "1", y: "1", poiX: "0.5", poiY: "0.5"\}.
   *
   * @param frameIdOrTag - The string id or tag of the frame to clear the asset subject area.
   */
  public async clearAssetSubjectInfo(frameIdOrTag: string): Promise<void> {
    this.createDebugLog({functionName:"clearAssetSubjectInfo()"});
    const response = await this.child.clearAssetSubjectInfo(frameIdOrTag);
    if (response.isError) {
      throw new Error(response.error)
    }
  }

  /**
   *  Sets the locked (editable) state of a variable.
   *
   * @param variableName - A case-sensitive string of the variable name to target.
   * @param isLocked - A boolean to set the variable as locked or unlocked.
   */
  public async setVariableIsLocked(
    variableName: string,
    isLocked: boolean
  ): Promise<void> {
    this.createDebugLog({functionName:"setVariableIsLocked()"});
    const response = await this.child.setVariableIsLocked(
      variableName,
      isLocked
    );
    if (response.isError) {
      throw new Error(response.error)
    }
  }
}

/**
   *  An alias for the editorObject
*/
export type EditorObjectAlias = {
  Alert: PublisherInterface["alert"],
  GetDirtyState: PublisherInterface["getDirtyState"],
  NextPage: PublisherInterface["nextPage"],
  PreviousPage: PublisherInterface["previousPage"],
  SetSelectedPage: PublisherInterface["setSelectedPage"],
  GetSelectedPage: PublisherInterface["getSelectedPage"],
  GetSelectedPageName: PublisherInterface["getSelectedPageName"],
  GetNumPages: PublisherInterface["getNumPages"],
  RemoveListener:PublisherInterface["removeListener"],
  AddListener: PublisherInterface["addListener"],
  GetObject: PublisherInterface["getObject"],
  SetProperty: PublisherInterface["setProperty"],
  ExecuteFunction: PublisherInterface["executeFunction"],
  GetPageSnapshot: PublisherInterface["getPageSnapshot"],
  GetFrameSnapshot: PublisherInterface["getFrameSnapshot"],
  GetFrameSubjectArea: PublisherInterface["getFrameSubjectArea"],
  SetFrameSubjectArea: PublisherInterface["setFrameSubjectArea"],
  ClearFrameSubjectArea: PublisherInterface["clearFrameSubjectArea"],
  GetAssetSubjectInfo: PublisherInterface["getAssetSubjectInfo"],
  SetAssetSubjectInfo: PublisherInterface["setAssetSubjectInfo"],
  ClearAssetSubjectInfo: PublisherInterface["clearAssetSubjectInfo"],
  SetVariableIsLocked: PublisherInterface["setVariableIsLocked"]
}

