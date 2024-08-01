import { sfvcScreens } from "./screenHeights";
export function getUserAgent() {
  return window.navigator.mockUserAgent || window.navigator.userAgent;
}
var TABLET_PATTERN = /ip(a|ro)d|silk|xoom|playbook|tablet|kindle|Nexus 7|GT-P10|SC-01C|SHW-M180S|SM-T320|SGH-T849|SCH-I800|SHW-M180L|SPH-P100|SGH-I987|zt180|HTC( Flyer|_Flyer)|Sprint ATP51|ViewPad7|pandigital(sprnova|nova)|Ideos S7|Dell Streak 7|Advent Vega|A101IT|A70BHT|MID7015|Next2|nook|FOLIO|MB511.*RUTEM|Mac OS.*Silk/i;
export function isDevice(userAgent) {
  if (userAgent === void 0) {
    userAgent = getUserAgent();
  }
  if (userAgent.match(/Android|webOS|iPhone|iPad|iPod|bada|Symbian|Palm|CriOS|BlackBerry|IEMobile|WindowsMobile|Opera Mini/i)) {
    return true;
  }
  return false;
}
export function isTablet(userAgent) {
  if (userAgent === void 0) {
    userAgent = getUserAgent();
  }
  return TABLET_PATTERN.test(userAgent);
}
export function isWebView(ua) {
  if (ua === void 0) {
    ua = getUserAgent();
  }
  return /(iPhone|iPod|iPad|Macintosh).*AppleWebKit(?!.*Safari)|.*WKWebView/i.test(ua) || /\bwv\b/.test(ua) || /Android.*Version\/(\d)\.(\d)/i.test(ua);
}
export function isStandAlone() {
  return window.navigator.standalone === true || window.matchMedia("(display-mode: standalone)").matches;
}
export function isFacebookWebView(ua) {
  if (ua === void 0) {
    ua = getUserAgent();
  }
  return /FBAN/.test(ua) || /FBAV/.test(ua);
}
export function isInstagramWebView(ua) {
  if (ua === void 0) {
    ua = getUserAgent();
  }
  return /Instagram/.test(ua);
}
export function isMetaWebView(ua) {
  if (ua === void 0) {
    ua = getUserAgent();
  }
  return isFacebookWebView(ua) || isInstagramWebView(ua);
}
export function isMetaInAppBrowser(ua) {
  if (ua === void 0) {
    ua = getUserAgent();
  }
  return /IABMV\/1/.test(ua);
}
export function isFirefox(ua) {
  if (ua === void 0) {
    ua = getUserAgent();
  }
  return /Firefox/i.test(ua);
}
export function isFirefoxIOS(ua) {
  if (ua === void 0) {
    ua = getUserAgent();
  }
  return /FxiOS/i.test(ua);
}
export function isEdgeIOS(ua) {
  if (ua === void 0) {
    ua = getUserAgent();
  }
  return /EdgiOS/i.test(ua);
}
export function isOperaMini(ua) {
  if (ua === void 0) {
    ua = getUserAgent();
  }
  return /Opera Mini/i.test(ua);
}
export function isAndroid(ua) {
  if (ua === void 0) {
    ua = getUserAgent();
  }
  return /Android/.test(ua);
}
export function isIos(ua) {
  if (ua === void 0) {
    ua = getUserAgent();
  }
  return /iPhone|iPod|iPad/.test(ua);
}
export function isIOS14(ua) {
  if (ua === void 0) {
    ua = getUserAgent();
  }
  return /iPhone.*OS.*(1)?(?:(1)[0-4]| [0-9])_/.test(ua);
}
export function isGoogleSearchApp(ua) {
  if (ua === void 0) {
    ua = getUserAgent();
  }
  return /\bGSA\b/.test(ua);
}
export function isQQBrowser(ua) {
  if (ua === void 0) {
    ua = getUserAgent();
  }
  return /QQBrowser/.test(ua);
}
export function isIosWebview(ua) {
  if (ua === void 0) {
    ua = getUserAgent();
  }
  if (isIos(ua)) {
    if (isGoogleSearchApp(ua)) {
      return true;
    }
    return /.+AppleWebKit(?!.*Safari)|.*WKWebView/.test(ua);
  }
  return false;
}
export function isSFVC(ua) {
  if (ua === void 0) {
    ua = getUserAgent();
  }
  if (isIos(ua)) {
    var height = window.innerHeight;
    var scale = Math.round(window.screen.width / window.innerWidth * 100) / 100;
    var computedHeight = Math.round(height * scale);
    var device = null;
    if (isIOS14(ua)) {
      device = sfvcScreens[window.outerHeight];
    } else {
      if (scale !== 1) {
        return true;
      }
      device = sfvcScreens[window.outerHeight];
    }
    if (!device) {
      return true;
    }
    if (scale > 1 && device.zoomHeight && device.zoomHeight[scale]) {
      return device.zoomHeight[scale].indexOf(computedHeight) !== -1;
    } else {
      return device.textSizeHeights.indexOf(computedHeight) !== -1 || device.textSizeHeightsNoTabs.indexOf(computedHeight) !== -1;
    }
  }
  return false;
}
export function isSFVCorSafari(ua) {
  if (ua === void 0) {
    ua = getUserAgent();
  }
  if (isIos(ua)) {
    var sfvc = isSFVC(ua);
    var device = isIOS14(ua) ? sfvcScreens[window.outerHeight] : null;
    if (!device) {
      return false;
    }
    var height = window.innerHeight;
    var scale = Math.round(window.screen.width / window.innerWidth * 100) / 100;
    var computedHeight = Math.round(height * scale);
    var possibleSafariSizes = device.maybeSafari;
    var maybeSafari = false;
    if (scale > 1 && possibleSafariSizes[scale] && possibleSafariSizes[scale].indexOf(computedHeight) !== -1) {
      maybeSafari = true;
    }
    return sfvc || maybeSafari;
  }
  return false;
}
export function isAndroidWebview(ua) {
  if (ua === void 0) {
    ua = getUserAgent();
  }
  if (isAndroid(ua)) {
    return /Version\/[\d.]+/.test(ua) && !isOperaMini(ua);
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
  if (typeof process !== "undefined" && process.versions && process.versions.electron) {
    return true;
  }
  return false;
}
export function isIEIntranet() {
  if (window.document.documentMode) {
    try {
      var status = window.status;
      window.status = "testIntranetMode";
      if (window.status === "testIntranetMode") {
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
  return /Macintosh.*AppleWebKit(?!.*Safari)/i.test(userAgent);
}
export function supportsPopups(ua) {
  if (ua === void 0) {
    ua = getUserAgent();
  }
  return !(isWebView(ua) || isIosWebview(ua) || isAndroidWebview(ua) || isOperaMini(ua) || isFirefoxIOS(ua) || isEdgeIOS(ua) || isFacebookWebView(ua) || isQQBrowser(ua) || isElectron() || isMacOsCna() || isStandAlone());
}
export function isChrome(ua) {
  if (ua === void 0) {
    ua = getUserAgent();
  }
  return /Chrome|Chromium|CriOS/.test(ua) && !/SamsungBrowser|Silk|EdgA/.test(ua);
}
export function isSafari(ua) {
  if (ua === void 0) {
    ua = getUserAgent();
  }
  return /Safari/.test(ua) && !isChrome(ua) && !/Silk|FxiOS|EdgiOS/.test(ua);
}
export function isIpadOs(ua) {
  if (ua === void 0) {
    ua = getUserAgent();
  }
  if (!/iPhone|iPod/.test(ua)) {
    if (/iPad/.test(ua) || isSafari(ua) && navigator.maxTouchPoints >= 1) {
      return true;
    }
  }
  return false;
}
export function isApplePaySupported() {
  try {
    if (window.ApplePaySession && window.ApplePaySession.supportsVersion(3) && window.ApplePaySession.canMakePayments()) {
      return true;
    }
  } catch (e) {
    return false;
  }
  return false;
}
export function isCrossSiteTrackingEnabled(expectedCookieKey) {
  return window.document.cookie.indexOf(expectedCookieKey) === -1;
}