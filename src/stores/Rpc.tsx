export default class Rpc {

    private ws: WebSocket;
    private timeout: number;
    private frameid: number;
    private active: boolean = false;
    private _timerHandle = null;
    private _queueSize = 0;
    private _queue = {};
  
    constructor(options: any) {
  
      let { host } = options;
      this.ws = new WebSocket("ws://" + host + "/rpc");
  
      this.ws.addEventListener("open", (ev) => {
        this.active = true;
        console.log("open");
        // TODO: emit open
      })
  
      this.ws.addEventListener("close", (ev) => {
        this.active = false;
        console.log("close");
        // TODO: emit close
      })
  
      this.ws.addEventListener("error", (ev) => {
        this._onerror(new Error("WebSocket Error"), ev);
        return;
      })
  
      this.ws.addEventListener("message", (ev) => {
        try {
          let obj = JSON.parse(ev.data)
  
          this._onmessage(obj);
  
        } catch (e) {
          console.log(e);
          // self.emit('error', new Error("Unable to parse JSON string."), data, e);
        }
  
      })
  
      this.timeout = options.timeout || 10000;
      this.frameid = 0;
    }
  
    _disableTimer() {
      if (this._timerHandle) {
        clearInterval(this._timerHandle);
        this._timerHandle = null;
      }
    }
  
  
    _enableTimer() {
      if (this._timerHandle == null) {
        this._timerHandle = setInterval(this._timerTrigger.bind(this), 1000);
      }
    }
  
    _timerTrigger() {
  
      if (Object.keys(this._queue).length == 0) {
        this._disableTimer();
        return;
      };
  
      Object.keys(this._queue).forEach((id) => {
        let value = this._queue[id];
  
        if (this.active == false) {
  
          // The transport is inactive. Cancel pending requests
  
          delete this._queue[id];
  
          let error = {
            "code": 503,
            "message": "The transport is not active."
          };
  
          setTimeout(value.callback.bind(this), 0, error, null);
  
        } else if ((new Date()).getTime() - value.datetime >= this.timeout) {
  
          // Discard requests that had timed out
  
          delete this._queue[id];
  
          let error = {
            "code": 408,
            "message": "Request timed out."
          };
  
          setTimeout(value.callback.bind(this), 0, error, null);
  
        }
      });
  
      if (Object.keys(this._queue).length == 0) {
        this._disableTimer();
      }
    }
  
    _onerror(e: Error, body) {
      console.log(e);
      console.log(body);
    }
  
    _onmessage(body) {
      if (Object.getPrototypeOf(body) !== Object.prototype) {
        console.log("THE RESPONSE IS NOT AN OBJECT!");
        this._onerror(new Error("The response is not valid JSON object."), body);
        return;
  
      } else if (typeof body.id == "undefined") {
        this._onerror(new Error("Malformed JSON object (missing ID property)."), body);
        return;
      }
  
      var value = this._queue[body.id];
  
      if (value == null) {
        this._onerror(new Error("Received response for unknown request"), body);
        return;
      }
  
      delete this._queue[body.id];
  
      if (typeof body.error != "undefined") {
        value.callback(body.error, null, body.id, body.tag || null);
      } else {
        value.callback(null, body.result, body.id, body.tag || null);
      }
  
    }
  
    call(methodName: string, args: object, tag: string, callback: (error: any, result: any, tag: string) => void) {
  
      if (!this.active) {
  
        let error = {
          "code": 400,
          "message": "RPC transport is not active. Subscribe to on(open) event."
        };
  
        callback(error, null, null);
  
        return;
      }
  
      args = args || {};
      tag = tag || "";
  
      let rid = ++this.frameid;
  
      let rpcPacket = {
        method: methodName,
        args: args,
        tag: tag,
        id: rid
      };
  
      this._queue[rid] = {
        datetime: (new Date()).getTime(),
        payload: rpcPacket,
        callback: callback
      };
  
      this.ws.send(JSON.stringify(rpcPacket));
  
      this._enableTimer();
    }
  }
  