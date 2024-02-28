var window: any;
var localStorage: any
var document: any
var sessionStorage: any

export const WEBVIEW_URL = 'https://www.aveloair.com/';
export const WEBVIEW_URL_MYACCOUNT = 'https://www.aveloair.com/my-account#/summary';
export const whiteListedLocalStorageKeys = [
    '1630888:session-data', 'low_fare'
]
export const ALL_STORAGE_READ_KEY = 'ALL_STORAGE_READ';
export const ALL_STORAGE_STORE_KEY = 'ALL_STORAGE_STORE';

export const script1 = `(function () {
    window.ReactNativeWebView.postMessage('MESSAGE 1111');
})()`

export const script2 = `(function () {
    window.ReactNativeWebView.postMessage('MESSAGE 2222');
})()`

export const beforeloadtInjectingScript = `(function () {
    localStorage.setItem('TEST_LOCALSTORAGE_ITEM', 'TEST_USER');
    document.cookie = 'TEST_LOCALSTORAGE_ITEM=TEST_USER; expires=Thu, 18 Dec 2025 12:00:00 UTC; path=/';
})()`

// localStorage.setItem('TEST_LOCALSTORAGE_ITEM', 'YOGENDER_SINGH');
//     document.cookie = 'TEST_LOCALSTORAGE_ITEM=YOGENDER_SINGH; expires=Thu, 18 Dec 2025 12:00:00 UTC; path=/';
export const startInjectingScript = `(function () {
    
})()`

export const injectedScriptRead = `(function () {
    function allStorage() {
        var values = [],
            keys = Object.keys(localStorage),
            i = keys.length;
        while (i--) {
            values.push({
                key: keys[i],
                value: localStorage.getItem(keys[i]),
            });
        }
        console.log('allStorage readed values ::', values)
        return values;
    }
    function allSession() {
        var sessionStorageValues = {};
        for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i);
            const value = sessionStorage.getItem(key);
            sessionStorageValues[key] = value;
        }
        return sessionStorageValues;
    }
    function allCookie() {
        return document.cookie.split(';').reduce((ac, str) => Object.assign(ac, { [str.split('=')[0].trim()]: str.split('=')[1] }), {});
    }
    window.ReactNativeWebView.postMessage(JSON.stringify({
        messageType: '${ALL_STORAGE_READ_KEY}',
        payload: {
            localstorage: allStorage(),
            cookies: allCookie(),
            session: allSession()
        }
    }))
})()`;

export const injectedScriptStore = `(function () {
    function allStorage() {
        var values = [],
            keys = Object.keys(localStorage),
            i = keys.length;
        while (i--) {
            values.push({
                key: keys[i],
                value: localStorage.getItem(keys[i]),
            });
        }
        console.log('allStorage readed values ::', values)
        return values;
    }
    function allSession() {
        var sessionStorageValues = {};
        for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i);
            const value = sessionStorage.getItem(key);
            sessionStorageValues[key] = value;
        }
        return sessionStorageValues;
    }
    function allCookie() {
        return document.cookie.split(';').reduce((ac, str) => Object.assign(ac, { [str.split('=')[0].trim()]: str.split('=')[1] }), {});
    }
    window.ReactNativeWebView.postMessage(JSON.stringify({
        messageType: '${ALL_STORAGE_STORE_KEY}',
        payload: {
            localstorage: allStorage(),
            cookies: allCookie(),
            session: allSession()
        }
    }))
})()`;
