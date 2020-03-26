/* @flow */

export function getUserAgent() : string {
    return window.navigator.mockUserAgent || window.navigator.userAgent;
}

export function isDevice(userAgent? : string = getUserAgent()) : boolean {
    if (userAgent.match(/Android|webOS|iPhone|iPad|iPod|bada|Symbian|Palm|CriOS|BlackBerry|IEMobile|WindowsMobile|Opera Mini/i)) {
        return true;
    }

    return false;
}

export function isWebView() : boolean {
    const userAgent = getUserAgent();
    return (/(iPhone|iPod|iPad|Macintosh).*AppleWebKit(?!.*Safari)/i).test(userAgent) ||
        (/\bwv\b/).test(userAgent) ||
    (/Android.*Version\/(\d)\.(\d)/i).test(userAgent);
}

export function isStandAlone() : boolean {
    return (window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches);
}

export function isFacebookWebView(ua? : string = getUserAgent()) : boolean {
    return (ua.indexOf('FBAN') !== -1) || (ua.indexOf('FBAV') !== -1);
}

export function isFirefoxIOS(ua? : string = getUserAgent()) : boolean {
    return (/FxiOS/i).test(ua);
}

export function isEdgeIOS(ua? : string = getUserAgent()) : boolean {
    return (/EdgiOS/i).test(ua);
}

export function isOperaMini(ua? : string = getUserAgent()) : boolean {
    return ua.indexOf('Opera Mini') > -1;
}

export function isAndroid(ua? : string = getUserAgent()) : boolean {
    return (/Android/).test(ua);
}

export function isIos(ua? : string = getUserAgent()) : boolean {
    return (/iPhone|iPod|iPad/).test(ua);
}

export function isGoogleSearchApp(ua? : string = getUserAgent()) : boolean {
    return (/\bGSA\b/).test(ua);
}

export function isQQBrowser(ua? : string = getUserAgent()) : boolean {
    return (/QQBrowser/).test(ua);
}

export function isIosWebview(ua? : string = getUserAgent()) : boolean {
    if (isIos(ua)) {
        if (isGoogleSearchApp(ua)) {
            return true;
        }
        return (/.+AppleWebKit(?!.*Safari)/).test(ua);
    }
    return false;
}

export function isAndroidWebview(ua? : string = getUserAgent()) : boolean {
    if (isAndroid(ua)) {
        return (/Version\/[\d.]+/).test(ua) && !isOperaMini(ua);
    }
    return false;
}

export function isIE() : boolean {

    if (window.document.documentMode) {
        return true;
    }

    return Boolean(
        window.navigator &&
        window.navigator.userAgent &&
        (/Edge|MSIE|rv:11/i).test(window.navigator.userAgent)
    );
}

export function isIECompHeader() : boolean {
    const mHttp = window.document.querySelector('meta[http-equiv="X-UA-Compatible"]');
    const mContent = window.document.querySelector('meta[content="IE=edge"]');
    if (mHttp && mContent) {
        return true;
    }
    return false;
}

export function isElectron() : boolean {
    if (typeof process !== 'undefined' && process.versions && process.versions.electron) {
        return true;
    }
    return false;
}

export function isIEIntranet() : boolean {

    // This status check only works for older versions of IE with document.documentMode set

    if (window.document.documentMode) {
        try {
            const status = window.status;

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

export function isMacOsCna() : boolean {
    const userAgent = getUserAgent();
    return (/Macintosh.*AppleWebKit(?!.*Safari)/i).test(userAgent);
}

export function supportsPopups(ua? : string = getUserAgent()) : boolean {
    return !(isIosWebview(ua) || isAndroidWebview(ua) || isOperaMini(ua) ||
        isFirefoxIOS(ua) || isEdgeIOS(ua) || isFacebookWebView(ua) || isQQBrowser(ua) || isElectron() || isMacOsCna() || isStandAlone());
}

export function isChrome(ua? : string = getUserAgent()) : boolean {
    return (/Chrome|Chromium|CriOS/).test(ua);
}

export function isSafari(ua? : string = getUserAgent()) : boolean {
    return (/Safari/).test(ua) && !isChrome(ua);
}
