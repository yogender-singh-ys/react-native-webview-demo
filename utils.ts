export const logLocalStorageValue = (parsedLocalStorage: any, logHelper?: string) => {
    logHelper && console.log('############ LS STARTS =============' + logHelper + '============= STARTS LS ############');
    let str = '';
    for (const key in parsedLocalStorage) {
        if (Object.prototype.hasOwnProperty.call(parsedLocalStorage, key)) {
            const element = parsedLocalStorage[key];
            console.log(element['key'] + ' :: ', element['value']);
            str += `localStorage.setItem('${element['key']}', '${element['value']}');`
        }
    }
    // console.log('logLocalStorageValue output :: ', str);
    logHelper && console.log('############ ENDS =============' + logHelper + '============ ENDS ############')
    return str;
}

export const logCookieValue = (parsedCookie: any, logHelper?: string) => {
    logHelper && console.log('############ COOKIE STARTS=============' + logHelper + '============= COOKIE STARTS ############');
    let str = '';
    for (const cookieKey in parsedCookie) {
        if (Object.prototype.hasOwnProperty.call(parsedCookie, cookieKey)) {
            const element = parsedCookie[cookieKey];
            console.log(cookieKey + ' :: ', element);
            str += `document.cookie = '${cookieKey}=${element}; expires=Thu, 18 Dec 2025 12:00:00 UTC; path=/';`
        }
    }
    // console.log('logCookieValue output :: ', str);
    logHelper && console.log('############ ENDS =============' + logHelper + '============ ENDS ############');
    return str;
}

export const logSessionValue = (parsedSession: any, logHelper?: string) => {
    logHelper && console.log('############ SESSION STARTS =============' + logHelper + '============= SESSION STARTS ############');
    let str = '';
    for (const sessionKey in parsedSession) {
        if (Object.prototype.hasOwnProperty.call(parsedSession, sessionKey)) {
            const element = parsedSession[sessionKey];
            console.log(sessionKey + ' :: ', element);
            str += `sessionStorage.setItem('${sessionKey}', '${element}'); `
        }
    }
    // console.log('logCookieValue output :: ', str);
    logHelper && console.log('############ ENDS =============' + logHelper + '============ ENDS ############');
    return str;
}