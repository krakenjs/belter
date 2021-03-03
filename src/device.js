/* @flow */

export function getUserAgent() : string {
    return window.navigator.mockUserAgent || window.navigator.userAgent; // eslint-disable-line compat/compat
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
    return (window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches); // eslint-disable-line compat/compat
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
        window.navigator && // eslint-disable-line compat/compat
        window.navigator.userAgent && // eslint-disable-line compat/compat
        (/Edge|MSIE|rv:11/i).test(window.navigator.userAgent) // eslint-disable-line compat/compat
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

export function inWebView() : boolean {
    const iPhoneScreenHeightMatrix = {
        '926': {
            device:          'iPhone 12 Pro Max',
            textSizeHeights: [
                752, 748, 744, 738
            ],
            zoomHeight: {
                '1.15': [ 752, 747, 744, 738 ],
                '1.25': [ 753, 748, 744, 738 ],
                '1.5':  [ 752, 749, 744, 738 ],
                '1.75': [ 753, 747, 744, 739 ],
                '2':    [ 752, 748, 744 ],  // 738 removed as same in Safari
                '2.5':  [ 753, 748 ],       // 745, 738 removed as same in Safari
                '3':    [ 753, 744 ]        // 747, 738 removed as same in Safari
            }
        },
        '896': {
            device:          'iPhone XS Max, iPhone 11 Pro Max, iPhone XR, iPhone 11',
            textSizeHeights: [
                721, 717, 713, 707
            ],
            zoomHeight: {
                '1.15': [ 721, 716, 713, 707 ],
                '1.25': [ 721, 718, 713, 708 ],
                '1.5':  [ 722, 717, 713 ], // 707 removed as same in Safari
                '1.75': [ 721, 718, 712, 707 ],
                '2':    [ 722, 718, 714, 708 ],
                '2.5':  [ 720, 718, 713, 708 ],
                '3':    [ 720, 717, 708 ] // 714 removed as same in Safari
            }
        },
        '844': {
            device:          'iPhone 12, iPhone 12 Pro',
            textSizeHeights: [
                670, 666, 662, 656
            ],
            zoomHeight: {
                '1.15': [ 670, 666, 662 ], // 656 removed as same in Safari
                '1.25': [ 670, 666, 663, 656 ],
                '1.5':  [ 671, 666, 662 ], // 656 removed as same in Safari
                '1.75': [ 670, 667, 662, 656 ],
                '2':    [ 670, 666, 662 ], // 656 removed as same in Safari
                '2.5':  [ 670, 663 ], // 665, 655 removed as same in Safari
                '3':    [ 669, 666, 663, 657 ] // 663 removed as same in Safari
            }
        },
        '812': {
            device:          'iPhone X, iPhone XS, iPhone 11 Pro, iPhone 12 Mini',
            textSizeHeights: [
                641, 637, 633, 627
            ],
            zoomHeight: {
                '1.15': [ 641, 637, 633, 627 ],
                '1.25': [ 641, 638, 633, 628 ],
                '1.5':  [ 641, 638, 633, 627 ],
                '1.75': [ 641, 637, 634 ], // 627 removed as same in Safari
                '2':    [ 642, 638, 634, 628 ],
                '2.5':  [ 640, 638, 633, 628 ],
                '3':    [ 642, 633 ] // 636, 627 removed as same in Safari
            }
        },
        '736': {
            device:          'iPhone 6 Plus, iPhone 6S Plus, iPhone 7 Plus, iPhone 8 Plus',
            textSizeHeights: [
                628, 624, 620, 614
            ],
            zoomHeight: {
                '1.15': [ 628, 624, 620, 614 ],
                '1.25': [ 628, 624, 620, 614 ],
                '1.5':  [ 629, 624, 620 ], // 614
                '1.75': [ 628, 625, 620, 614 ],
                '2':    [ 628, 624, 620 ], // 614
                '2.5':  [ 628, 625, 620, 615 ],
                '3':    [ 627, 624, 615 ] // 621
            }
        },
        '667': {
            device:          'iPhone 6, iPhone 6S, iPhone 7, iPhone 8,  iPhone SE2',
            textSizeHeights: [
                559, 555, 551, 545
            ],
            zoomHeight: {
                '1.15': [ 559, 555, 551, 545 ],
                '1.25': [ 559, 555, 551, 545 ],
                '1.5':  [ 560, 555, 551 ], // 545
                '1.75': [ 558, 555, 551 ], // 544
                '2':    [ 560, 556, 552, 546 ],
                '2.5':  [ 560, 555, 550 ], // 545
                '3':    [ 558, 555, 546 ] // 552
            }
        },
        '568': {
            device:          'iPhone 5, iPhone 5S, iPhone 5C, iPhone SE',
            textSizeHeights: [
                0
            ],
            zoomHeight: {
                '1.15': [ 0 ],
                '1.25': [ 0 ],
                '1.5':  [ 0 ],
                '1.75': [ 0 ],
                '2':    [ 0 ],
                '2.5':  [ 0 ],
                '3':    [ 0 ]
            }
        }
    };
    const height = window.visualViewport.height;
    const scale = Math.round(window.visualViewport.scale * 100) / 100;
    const outerHeight = iPhoneScreenHeightMatrix[window.outerHeight];
    const computedHeight = Math.round(height * scale);

    return outerHeight &&
           scale > 1 ? outerHeight.zoomHeight[scale].includes(computedHeight) : outerHeight.textSizeHeights.includes(computedHeight);
}
