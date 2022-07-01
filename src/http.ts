import { ZalgoPromise } from "@krakenjs/zalgo-promise";
import type { SameDomainWindowType } from "@krakenjs/cross-domain-utils/dist/esm";

type RequestOptionsType = {
  url: string;
  method?: string;
  headers?: Record<string, string>;
  json?: readonly unknown[] | Record<string, any>;
  data?: Record<string, string>;
  body?: string;
  win?: SameDomainWindowType;
  timeout?: number;
};
type ResponseType = {
  status: number;
  headers: Record<string, string>;
  body: Record<string, any>;
};

const HEADERS = {
  CONTENT_TYPE: "content-type",
  ACCEPT: "accept",
};

type HeaderValues = typeof HEADERS[keyof typeof HEADERS];

const headerBuilders: Array<() => Record<string, HeaderValues>> = [];

function parseHeaders(rawHeaders = ""): Record<string, string> {
  const result = {};

  for (const line of rawHeaders.trim().split("\n")) {
    const [key, ...values] = line.split(":");
    // @ts-expect-error key is a string but needs to be HeaderValues
    result[key.toLowerCase()] = values.join(":").trim();
  }

  return result;
}

export function request({
  url,
  method = "get",
  headers = {},
  json,
  data,
  body,
  win = window,
  timeout = 0,
}: RequestOptionsType): ZalgoPromise<ResponseType> {
  return new ZalgoPromise((resolve, reject) => {
    if ((json && data) || (json && body) || (data && json)) {
      throw new Error(
        `Only options.json or options.data or options.body should be passed`
      );
    }

    const normalizedHeaders = {};

    for (const key of Object.keys(headers)) {
      // @ts-expect-error key is a string but needs to be HeaderValues
      normalizedHeaders[key.toLowerCase()] = headers[key];
    }

    if (json) {
      // @ts-expect-error string indexing
      normalizedHeaders[HEADERS.CONTENT_TYPE] =
        // @ts-expect-error string indexing
        normalizedHeaders[HEADERS.CONTENT_TYPE] || "application/json";
    } else if (data || body) {
      // @ts-expect-error string indexing
      normalizedHeaders[HEADERS.CONTENT_TYPE] =
        // @ts-expect-error string indexing
        normalizedHeaders[HEADERS.CONTENT_TYPE] ||
        "application/x-www-form-urlencoded; charset=utf-8";
    }

    // @ts-expect-error string indexing
    normalizedHeaders[HEADERS.ACCEPT] =
      // @ts-expect-error string indexing
      normalizedHeaders[HEADERS.ACCEPT] || "application/json";

    for (const headerBuilder of headerBuilders) {
      const builtHeaders = headerBuilder();

      for (const key of Object.keys(builtHeaders)) {
        // @ts-expect-error string indexing
        normalizedHeaders[key.toLowerCase()] = builtHeaders[key];
      }
    }

    // @ts-expect-error XMLHttpRequest does not exist on SameDomainWindow
    const xhr = new win.XMLHttpRequest();
    xhr.addEventListener(
      "load",
      function xhrLoad(): void {
        // @ts-expect-error this
        const responseHeaders = parseHeaders(this.getAllResponseHeaders());

        // @ts-expect-error this
        if (!this.status) {
          reject(
            new Error(
              `Request to ${method.toLowerCase()} ${url} failed: no response status code.`
            )
          );
          return;
        }

        const contentType = responseHeaders["content-type"];
        const isJSON =
          contentType &&
          (contentType.startsWith("application/json") ||
            contentType.startsWith("text/json"));

        // @ts-expect-error this
        let responseBody = this.responseText;

        try {
          responseBody = JSON.parse(responseBody);
        } catch (err) {
          if (isJSON) {
            // @ts-expect-error this
            reject(new Error(`Invalid json: ${this.responseText}.`));
            return;
          }
        }

        const res = {
          // @ts-expect-error this
          status: this.status,
          headers: responseHeaders,
          body: responseBody,
        };
        resolve(res);
      },
      false
    );
    xhr.addEventListener(
      "error",
      (evt: { toString: () => any }) => {
        reject(
          new Error(
            `Request to ${method.toLowerCase()} ${url} failed: ${evt.toString()}.`
          )
        );
      },
      false
    );
    // open of a dynamic url
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    xhr.open(method, url, true);

    for (const key in normalizedHeaders) {
      if (normalizedHeaders.hasOwnProperty(key)) {
        // @ts-expect-error string index
        xhr.setRequestHeader(key, normalizedHeaders[key]);
      }
    }

    if (json) {
      body = JSON.stringify(json);
    } else if (data) {
      body = Object.keys(data)
        .map((key) => {
          return `${encodeURIComponent(key)}=${
            data ? encodeURIComponent(data[key]) : ""
          }`;
        })
        .join("&");
    }

    xhr.timeout = timeout;

    xhr.ontimeout = function xhrTimeout() {
      reject(
        new Error(`Request to ${method.toLowerCase()} ${url} has timed out`)
      );
    };

    xhr.send(body);
  });
}

export function addHeaderBuilder(method: () => Record<string, string>): void {
  headerBuilders.push(method);
}
