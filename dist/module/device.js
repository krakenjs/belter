export function getUserAgent() {
    return window.navigator.mockUserAgent || window.navigator.userAgent;
}

export function isDevice() {
    var userAgent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getUserAgent();

    if (userAgent.match(/Android|webOS|iPhone|iPad|iPod|bada|Symbian|Palm|CriOS|BlackBerry|IEMobile|WindowsMobile|Opera Mini/i)) {
        return true;
    }

    return false;
}

export function isWebView() {
    var userAgent = getUserAgent();
    return (/(iPhone|iPod|iPad|Macintosh).*AppleWebKit(?!.*Safari)/i.test(userAgent) || /\bwv\b/.test(userAgent) || /Android.*Version\/(\d)\.(\d)/i.test(userAgent)
    );
}

export function isStandAlone() {
    return window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;
}

export function isFacebookWebView() {
    var ua = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getUserAgent();

    return ua.indexOf('FBAN') !== -1 || ua.indexOf('FBAV') !== -1;
}

export function isFirefoxIOS() {
    var ua = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getUserAgent();

    return (/FxiOS/i.test(ua)
    );
}

export function isEdgeIOS() {
    var ua = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getUserAgent();

    return (/EdgiOS/i.test(ua)
    );
}

export function isOperaMini() {
    var ua = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getUserAgent();

    return ua.indexOf('Opera Mini') > -1;
}

export function isAndroid() {
    var ua = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getUserAgent();

    return (/Android/.test(ua)
    );
}

export function isIos() {
    var ua = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getUserAgent();

    return (/iPhone|iPod|iPad/.test(ua)
    );
}

export function isGoogleSearchApp() {
    var ua = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getUserAgent();

    return (/\bGSA\b/.test(ua)
    );
}

export function isQQBrowser() {
    var ua = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getUserAgent();

    return (/QQBrowser/.test(ua)
    );
}

export function isIosWebview() {
    var ua = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getUserAgent();

    if (isIos(ua)) {
        if (isGoogleSearchApp(ua)) {
            return true;
        }
        return (/.+AppleWebKit(?!.*Safari)/.test(ua)
        );
    }
    return false;
}

export function isAndroidWebview() {
    var ua = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getUserAgent();

    if (isAndroid(ua)) {
        return (/Version\/[\d.]+/.test(ua) && !isOperaMini(ua)
        );
    }
    return false;
}

export function isIE() {

    if (window.document.documentMode) {
        return true;
    }

    return Boolean(window.navigator && window.navigator.userAgent && /Edge|MSIE|rv:11/i.test(window.navigator.userAgent));
}

export function isIECompHeader() {
    var mHttp = window.document.querySelector('meta[http-equiv="X-UA-Compatible"]');
    var mContent = window.document.querySelector('meta[content="IE=edge"]');
    if (mHttp && mContent) {
        return true;
    }
    return false;
}

export function isElectron() {
    if (typeof process !== 'undefined' && process.versions && process.versions.electron) {
        return true;
    }
    return false;
}

export function isIEIntranet() {

    // This status check only works for older versions of IE with document.documentMode set

    if (window.document.documentMode) {
        try {
            var status = window.status;

            window.status = 'testIntranetMode';

            if (window.status === 'testIntranetMode') {
                window.status = status;

                return true;
            }

            return false;
        } catch (err) {

            return false;
        }
    }

    return false;
}

export function isMacOsCna() {
    var userAgent = getUserAgent();
    return (/Macintosh.*AppleWebKit(?!.*Safari)/i.test(userAgent)
    );
}

export function supportsPopups() {
    var ua = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getUserAgent();

    return !(isIosWebview(ua) || isAndroidWebview(ua) || isOperaMini(ua) || isFirefoxIOS(ua) || isEdgeIOS(ua) || isFacebookWebView(ua) || isQQBrowser(ua) || isElectron() || isMacOsCna() || isStandAlone());
}

export function isChrome() {
    var ua = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getUserAgent();

    return (/Chrome|Chromium|CriOS/.test(ua)
    );
}

export function isSafari() {
    var ua = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getUserAgent();

    return (/Safari/.test(ua) && !isChrome(ua)
    );
}