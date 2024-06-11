"use strict";
(() => {
  // .wrangler/tmp/bundle-aZ8oNd/checked-fetch.js
  var urls = /* @__PURE__ */ new Set();
  function checkURL(request, init) {
    const url = request instanceof URL ? request : new URL(
      (typeof request === "string" ? new Request(request, init) : request).url
    );
    if (url.port && url.port !== "443" && url.protocol === "https:") {
      if (!urls.has(url.toString())) {
        urls.add(url.toString());
        console.warn(
          `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
        );
      }
    }
  }
  globalThis.fetch = new Proxy(globalThis.fetch, {
    apply(target, thisArg, argArray) {
      const [request, init] = argArray;
      checkURL(request, init);
      return Reflect.apply(target, thisArg, argArray);
    }
  });

  // node_modules/.pnpm/wrangler@3.60.0_@cloudflare+workers-types@2.0.0/node_modules/wrangler/templates/middleware/common.ts
  var __facade_middleware__ = [];
  function __facade_register__(...args) {
    __facade_middleware__.push(...args.flat());
  }
  function __facade_registerInternal__(...args) {
    __facade_middleware__.unshift(...args.flat());
  }
  function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
    const [head, ...tail] = middlewareChain;
    const middlewareCtx = {
      dispatch,
      next(newRequest, newEnv) {
        return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
      }
    };
    return head(request, env, ctx, middlewareCtx);
  }
  function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
    return __facade_invokeChain__(request, env, ctx, dispatch, [
      ...__facade_middleware__,
      finalMiddleware
    ]);
  }

  // node_modules/.pnpm/wrangler@3.60.0_@cloudflare+workers-types@2.0.0/node_modules/wrangler/templates/middleware/loader-sw.ts
  var __FACADE_EVENT_TARGET__;
  if (globalThis.MINIFLARE) {
    __FACADE_EVENT_TARGET__ = new (Object.getPrototypeOf(WorkerGlobalScope))();
  } else {
    __FACADE_EVENT_TARGET__ = new EventTarget();
  }
  function __facade_isSpecialEvent__(type) {
    return type === "fetch" || type === "scheduled";
  }
  var __facade__originalAddEventListener__ = globalThis.addEventListener;
  var __facade__originalRemoveEventListener__ = globalThis.removeEventListener;
  var __facade__originalDispatchEvent__ = globalThis.dispatchEvent;
  globalThis.addEventListener = function(type, listener, options) {
    if (__facade_isSpecialEvent__(type)) {
      __FACADE_EVENT_TARGET__.addEventListener(
        type,
        listener,
        options
      );
    } else {
      __facade__originalAddEventListener__(type, listener, options);
    }
  };
  globalThis.removeEventListener = function(type, listener, options) {
    if (__facade_isSpecialEvent__(type)) {
      __FACADE_EVENT_TARGET__.removeEventListener(
        type,
        listener,
        options
      );
    } else {
      __facade__originalRemoveEventListener__(type, listener, options);
    }
  };
  globalThis.dispatchEvent = function(event) {
    if (__facade_isSpecialEvent__(event.type)) {
      return __FACADE_EVENT_TARGET__.dispatchEvent(event);
    } else {
      return __facade__originalDispatchEvent__(event);
    }
  };
  globalThis.addMiddleware = __facade_register__;
  globalThis.addMiddlewareInternal = __facade_registerInternal__;
  var __facade_waitUntil__ = Symbol("__facade_waitUntil__");
  var __facade_response__ = Symbol("__facade_response__");
  var __facade_dispatched__ = Symbol("__facade_dispatched__");
  var __Facade_ExtendableEvent__ = class extends Event {
    [__facade_waitUntil__] = [];
    waitUntil(promise) {
      if (!(this instanceof __Facade_ExtendableEvent__)) {
        throw new TypeError("Illegal invocation");
      }
      this[__facade_waitUntil__].push(promise);
    }
  };
  var __Facade_FetchEvent__ = class extends __Facade_ExtendableEvent__ {
    #request;
    #passThroughOnException;
    [__facade_response__];
    [__facade_dispatched__] = false;
    constructor(type, init) {
      super(type);
      this.#request = init.request;
      this.#passThroughOnException = init.passThroughOnException;
    }
    get request() {
      return this.#request;
    }
    respondWith(response) {
      if (!(this instanceof __Facade_FetchEvent__)) {
        throw new TypeError("Illegal invocation");
      }
      if (this[__facade_response__] !== void 0) {
        throw new DOMException(
          "FetchEvent.respondWith() has already been called; it can only be called once.",
          "InvalidStateError"
        );
      }
      if (this[__facade_dispatched__]) {
        throw new DOMException(
          "Too late to call FetchEvent.respondWith(). It must be called synchronously in the event handler.",
          "InvalidStateError"
        );
      }
      this.stopImmediatePropagation();
      this[__facade_response__] = response;
    }
    passThroughOnException() {
      if (!(this instanceof __Facade_FetchEvent__)) {
        throw new TypeError("Illegal invocation");
      }
      this.#passThroughOnException();
    }
  };
  var __Facade_ScheduledEvent__ = class extends __Facade_ExtendableEvent__ {
    #scheduledTime;
    #cron;
    #noRetry;
    constructor(type, init) {
      super(type);
      this.#scheduledTime = init.scheduledTime;
      this.#cron = init.cron;
      this.#noRetry = init.noRetry;
    }
    get scheduledTime() {
      return this.#scheduledTime;
    }
    get cron() {
      return this.#cron;
    }
    noRetry() {
      if (!(this instanceof __Facade_ScheduledEvent__)) {
        throw new TypeError("Illegal invocation");
      }
      this.#noRetry();
    }
  };
  __facade__originalAddEventListener__("fetch", (event) => {
    const ctx = {
      waitUntil: event.waitUntil.bind(event),
      passThroughOnException: event.passThroughOnException.bind(event)
    };
    const __facade_sw_dispatch__ = function(type, init) {
      if (type === "scheduled") {
        const facadeEvent = new __Facade_ScheduledEvent__("scheduled", {
          scheduledTime: Date.now(),
          cron: init.cron ?? "",
          noRetry() {
          }
        });
        __FACADE_EVENT_TARGET__.dispatchEvent(facadeEvent);
        event.waitUntil(Promise.all(facadeEvent[__facade_waitUntil__]));
      }
    };
    const __facade_sw_fetch__ = function(request, _env, ctx2) {
      const facadeEvent = new __Facade_FetchEvent__("fetch", {
        request,
        passThroughOnException: ctx2.passThroughOnException
      });
      __FACADE_EVENT_TARGET__.dispatchEvent(facadeEvent);
      facadeEvent[__facade_dispatched__] = true;
      event.waitUntil(Promise.all(facadeEvent[__facade_waitUntil__]));
      const response = facadeEvent[__facade_response__];
      if (response === void 0) {
        throw new Error("No response!");
      }
      return response;
    };
    event.respondWith(
      __facade_invoke__(
        event.request,
        globalThis,
        ctx,
        __facade_sw_dispatch__,
        __facade_sw_fetch__
      )
    );
  });
  __facade__originalAddEventListener__("scheduled", (event) => {
    const facadeEvent = new __Facade_ScheduledEvent__("scheduled", {
      scheduledTime: event.scheduledTime,
      cron: event.cron,
      noRetry: event.noRetry.bind(event)
    });
    __FACADE_EVENT_TARGET__.dispatchEvent(facadeEvent);
    event.waitUntil(Promise.all(facadeEvent[__facade_waitUntil__]));
  });

  // node_modules/.pnpm/wrangler@3.60.0_@cloudflare+workers-types@2.0.0/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
  var drainBody = async (request, env, _ctx, middlewareCtx) => {
    try {
      return await middlewareCtx.next(request, env);
    } finally {
      try {
        if (request.body !== null && !request.bodyUsed) {
          const reader = request.body.getReader();
          while (!(await reader.read()).done) {
          }
        }
      } catch (e) {
        console.error("Failed to drain the unused request body.", e);
      }
    }
  };
  var middleware_ensure_req_body_drained_default = drainBody;

  // node_modules/.pnpm/wrangler@3.60.0_@cloudflare+workers-types@2.0.0/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
  function reduceError(e) {
    return {
      name: e?.name,
      message: e?.message ?? String(e),
      stack: e?.stack,
      cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
    };
  }
  var jsonError = async (request, env, _ctx, middlewareCtx) => {
    try {
      return await middlewareCtx.next(request, env);
    } catch (e) {
      const error = reduceError(e);
      return Response.json(error, {
        status: 500,
        headers: { "MF-Experimental-Error-Stack": "true" }
      });
    }
  };
  var middleware_miniflare3_json_error_default = jsonError;

  // .wrangler/tmp/bundle-aZ8oNd/middleware-insertion-facade.js
  __facade_registerInternal__([middleware_ensure_req_body_drained_default, middleware_miniflare3_json_error_default]);

  // src/token.ts
  function parseAuthenticateStr(authenticateStr) {
    const bearer = authenticateStr.split(/\s+/, 2);
    if (bearer.length != 2 && bearer[0].toLowerCase() !== "bearer") {
      throw new Error(`Invalid Www-Authenticate ${authenticateStr}`);
    }
    const params = bearer[1].split(",");
    let get_param = function(name) {
      for (const param of params) {
        const kvPair = param.split("=", 2);
        if (kvPair.length !== 2 || kvPair[0] !== name) {
          continue;
        }
        return kvPair[1].replace(/['"]+/g, "");
      }
      return "";
    };
    return {
      realm: get_param("realm"),
      service: get_param("service"),
      scope: get_param("scope")
    };
  }
  var TokenProvider = class {
    username;
    password;
    constructor(username, password) {
      this.username = username;
      this.password = password;
    }
    async authenticateCacheKey(wwwAuthenticate) {
      const keyStr = `${this.username}:${this.password}/${wwwAuthenticate.realm}/${wwwAuthenticate.service}/${wwwAuthenticate.scope}`;
      const keyStrText = new TextEncoder().encode(keyStr);
      const digestArray = await crypto.subtle.digest({ name: "SHA-256" }, keyStrText);
      const digestUint8Array = new Uint8Array(digestArray);
      let hexArray = [];
      for (const num of digestUint8Array) {
        hexArray.push(num.toString(16));
      }
      const digestHex = hexArray.join("");
      return `token/${digestHex}`;
    }
    async tokenFromCache(cacheKey) {
      const value = await HAMMAL_CACHE.get(cacheKey);
      if (value === null) {
        return null;
      }
      return JSON.parse(value);
    }
    async tokenToCache(cacheKey, token) {
      await HAMMAL_CACHE.put(cacheKey, JSON.stringify(token), { expirationTtl: token.expires_in });
    }
    async fetchToken(wwwAuthenticate) {
      const url = new URL(wwwAuthenticate.realm);
      if (wwwAuthenticate.service.length) {
        url.searchParams.set("service", wwwAuthenticate.service);
      }
      if (wwwAuthenticate.scope.length) {
        url.searchParams.set("scope", wwwAuthenticate.scope);
      }
      const response = await fetch(url.toString(), { method: "GET", headers: {} });
      if (response.status !== 200) {
        throw new Error(`Unable to fetch token from ${url.toString()} status code ${response.status}`);
      }
      const body = await response.json();
      return { token: body.token, expires_in: body.expires_in };
    }
    async token(authenticateStr) {
      const wwwAuthenticate = parseAuthenticateStr(authenticateStr);
      const cacheKey = await this.authenticateCacheKey(wwwAuthenticate);
      const cachedToken = await this.tokenFromCache(cacheKey);
      if (cachedToken !== null) {
        return cachedToken;
      }
      const token = await this.fetchToken(wwwAuthenticate);
      await this.tokenToCache(cacheKey, token);
      return token;
    }
  };

  // src/backend.ts
  var Backend = class {
    host;
    tokenProvider;
    constructor(host, tokenProvider) {
      this.host = host;
      this.tokenProvider = tokenProvider;
    }
    async proxy(pathname, args) {
      const url = new URL(this.host);
      url.pathname = pathname;
      const response = await fetch(url.toString(), { method: "GET", headers: args.headers, redirect: "follow" });
      if (this.tokenProvider === void 0) {
        return response;
      }
      if (response.status !== 401) {
        return response;
      }
      const authenticateStr = response.headers.get("Www-Authenticate");
      if (authenticateStr === null || this.tokenProvider === void 0) {
        return response;
      }
      const token = await this.tokenProvider.token(authenticateStr);
      const authenticatedHeaders = new Headers(args.headers);
      authenticatedHeaders.append("Authorization", `Bearer ${token.token}`);
      return await fetch(url.toString(), { method: "GET", headers: authenticatedHeaders, redirect: "follow" });
    }
  };

  // src/handler.ts
  function getHomePageHtml() {
    return `
    <html>
      <head>
        <title>CZL Docker\u955C\u50CF\u670D\u52A1(\u4EC5\u5185\u90E8\u7528)</title>
        <link rel="shortcut icon" href="https://cdn-r2.czl.net/2023/06/20/649168ec9d6a8.ico">
        <style>
        @font-face{font-family:'CZL';src:url('https://cdn-r2-cloudflare.czl.net/fonts/CZL/CZL_Sans_SC_Thin.woff2') format('woff2');font-weight:100;font-style:normal;font-display:swap}@font-face{font-family:'CZL';src:url('https://cdn-r2-cloudflare.czl.net/fonts/CZL/CZL_Sans_SC_Black.woff2') format('woff2');font-weight:900;font-style:normal;font-display:swap}@font-face{font-family:'CZL';src:url('https://cdn-r2-cloudflare.czl.net/fonts/CZL/CZL_Sans_SC_Bold.woff2') format('woff2');font-weight:bold;font-style:normal;font-display:swap}@font-face{font-family:'CZL';src:url('https://cdn-r2-cloudflare.czl.net/fonts/CZL/CZL_Sans_SC_Light.woff2') format('woff2');font-weight:300;font-style:normal;font-display:swap}@font-face{font-family:'CZL';src:url('https://cdn-r2-cloudflare.czl.net/fonts/CZL/CZL_Sans_SC_Medium.woff2') format('woff2');font-weight:500;font-style:normal;font-display:swap}@font-face{font-family:'CZL';src:url('https://cdn-r2-cloudflare.czl.net/fonts/CZL/CZL_Sans_SC_Regular.woff2') format('woff2');font-weight:normal;font-style:normal;font-display:swap}
        *{
        font-family: "CZL", -apple-system,BlinkMacSystemFont,'Helvetica Neue',Helvetica,Segoe UI,Arial,Roboto,'PingFang SC',miui,'Hiragino Sans GB','Microsoft Yahei',sans-serif ;
        }  
        body {
            font-family: "CZL", -apple-system,BlinkMacSystemFont,'Helvetica Neue',Helvetica,Segoe UI,Arial,Roboto,'PingFang SC',miui,'Hiragino Sans GB','Microsoft Yahei',sans-serif ;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-image: url('https://random-api.czl.net/pic/all');
            background-size: cover;
            background-position: center;
            color: white;
            text-shadow: 1px 1px 2px black;
          }
          .container {
            background-color: rgba(0, 0, 0, 0.5);
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            max-width: 600px;
            width: 100%;
          }
          .step {
            margin-bottom: 1em;
          }
          .step label {
            margin-bottom: 0.5em;
            display: block;
          }
          .step .input-group {
            display: flex;
            align-items: center;
          }
          .step textarea,
          .step input {
            flex: 1;
            padding: 10px;
            border-radius: 5px;
            border: none;
            margin-right: 10px;
            color: black;
          }
          .button, .icon-button {
            background-color: #4CAF50;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 40px;
            min-height: 40px;
          }
          .button:hover, .icon-button:hover {
            background-color: #45a049;
          }
          .icon-button i {
            font-size: 18px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>\u5FEB\u6377\u547D\u4EE4</h1>
          <div class="step" style="color:blue;">
          \u63D0\u793A\uFF0C\u652F\u6301docker.io, ghcr,quay,k8sgcr,gcr, \u975Edocker.io\u9700\u52A0\u4E0A\u57DF\u540D\u524D\u7F00
          </div>
          <div class="step">
            <label>\u7B2C\u4E00\u6B65\uFF1A\u8F93\u5165\u539F\u59CB\u955C\u50CF\u5730\u5740\u83B7\u53D6\u547D\u4EE4.</label>
            <div class="input-group">
              <input type="text" id="imageInput" placeholder="woodchen/simplemirrorfetch" />
              <button class="button" id="generateButton">\u83B7\u53D6\u547D\u4EE4</button>
            </div>
          </div>
          <div class="step">
            <label>\u7B2C\u4E8C\u6B65\uFF1A\u4EE3\u7406\u62C9\u53D6\u955C\u50CF</label>
            <div class="input-group">
              <textarea id="dockerPullCommand" readonly></textarea>
              <button class="icon-button" onclick="copyToClipboard('dockerPullCommand')"><i>\u{1F4CB}</i></button>
            </div>
          </div>
          <div class="step">
            <label>\u7B2C\u4E09\u6B65\uFF1A\u91CD\u547D\u540D\u955C\u50CF</label>
            <div class="input-group">
              <textarea id="dockerTagCommand" readonly></textarea>
              <button class="icon-button" onclick="copyToClipboard('dockerTagCommand')"><i>\u{1F4CB}</i></button>
            </div>
          </div>
          <div class="step">
            <label>\u7B2C\u56DB\u6B65\uFF1A\u5220\u9664\u4EE3\u7406\u955C\u50CF</label>
            <div class="input-group">
              <textarea id="dockerRmiCommand" readonly></textarea>
              <button class="icon-button" onclick="copyToClipboard('dockerRmiCommand')"><i>\u{1F4CB}</i></button>
            </div>
          </div>
        </div>
        <script>
          document.addEventListener('DOMContentLoaded', (event) => {
            document.getElementById('generateButton').addEventListener('click', generateCommands);
          });

          function generateCommands() {
            const imageInput = document.getElementById('imageInput').value;
            const source = getSourceFromImage(imageInput);
            const imageName = getImageNameFromInput(imageInput);
            const dockerPullCommand = \`docker pull \${source}/\${imageName}\`;
            const dockerTagCommand = \`docker tag \${source}/\${imageName} \${imageName}\`;
            const dockerRmiCommand = \`docker rmi \${source}/\${imageName}\`;

            document.getElementById('dockerPullCommand').value = dockerPullCommand;
            document.getElementById('dockerTagCommand').value = dockerTagCommand;
            document.getElementById('dockerRmiCommand').value = dockerRmiCommand;
          }

          function getSourceFromImage(imageInput) {
            const currentDomain = window.location.hostname;
            if (imageInput.startsWith("gcr.io/")) {
              return \`\${currentDomain}/gcr\`;
            } else if (imageInput.startsWith("k8s.gcr.io/")) {
              return \`\${currentDomain}/k8sgcr\`;
            } else if (imageInput.startsWith("quay.io/")) {
              return \`\${currentDomain}/quay\`;
            } else if (imageInput.startsWith("ghcr.io/")) {
              return \`\${currentDomain}/ghcr\`;
            } else {
              return currentDomain;
            }
          }

          function getImageNameFromInput(imageInput) {
            return imageInput.replace(/^.+?\\//, '');
          }

          function copyToClipboard(elementId) {
            const copyText = document.getElementById(elementId);
            copyText.select();
            copyText.setSelectionRange(0, 99999); // For mobile devices
            document.execCommand('copy');
          }
        <\/script>
      </body>
    </html>
  `;
  }
  var PROXY_HEADER_ALLOW_LIST = ["accept", "user-agent", "accept-encoding"];
  var validActionNames = /* @__PURE__ */ new Set(["manifests", "blobs", "tags", "referrers"]);
  var ORG_NAME_BACKEND = {
    "gcr": "https://gcr.io",
    "k8sgcr": "https://k8s.gcr.io",
    "quay": "https://quay.io",
    "ghcr": "https://ghcr.io"
  };
  var DEFAULT_BACKEND_HOST = "https://registry-1.docker.io";
  async function handleRequest(request) {
    const url = new URL(request.url);
    if (url.pathname === "/") {
      return new Response(getHomePageHtml(), {
        headers: { "content-type": "text/html;charset=UTF-8" }
      });
    }
    return handleRegistryRequest(request);
  }
  function copyProxyHeaders(inputHeaders) {
    const headers = new Headers();
    for (const pair of inputHeaders.entries()) {
      if (PROXY_HEADER_ALLOW_LIST.includes(pair[0].toLowerCase())) {
        headers.append(pair[0], pair[1]);
      }
    }
    return headers;
  }
  function orgNameFromPath(pathname) {
    const splitedPath = pathname.split("/", 3);
    if (splitedPath.length === 3 && splitedPath[0] === "" && splitedPath[1] === "v2") {
      return splitedPath[2].toLowerCase();
    }
    return null;
  }
  function hostByOrgName(orgName) {
    if (orgName !== null && orgName in ORG_NAME_BACKEND) {
      return ORG_NAME_BACKEND[orgName];
    }
    return DEFAULT_BACKEND_HOST;
  }
  function rewritePath(orgName, pathname) {
    let splitedPath = pathname.split("/");
    if (orgName === null && splitedPath.length === 5 && validActionNames.has(splitedPath[3])) {
      splitedPath = [splitedPath[0], splitedPath[1], "library", splitedPath[2], splitedPath[3], splitedPath[4]];
    }
    if (orgName === null || !(orgName in ORG_NAME_BACKEND)) {
      return pathname;
    }
    const cleanSplitedPath = splitedPath.filter(function(value, index) {
      return value !== orgName || index !== 2;
    });
    return cleanSplitedPath.join("/");
  }
  async function handleRegistryRequest(request) {
    const reqURL = new URL(request.url);
    const orgName = orgNameFromPath(reqURL.pathname);
    const pathname = rewritePath(orgName, reqURL.pathname);
    const host = hostByOrgName(orgName);
    const tokenProvider = new TokenProvider();
    const backend = new Backend(host, tokenProvider);
    const headers = copyProxyHeaders(request.headers);
    return backend.proxy(pathname, { headers: request.headers });
  }

  // src/index.ts
  addEventListener("fetch", (event) => {
    event.respondWith(handleRequest(event.request));
  });
})();
//# sourceMappingURL=index.js.map
