export const ping = (serverUrl, siteId) => {
    if (!window.SASANQUA_PAGE_SID) {
        return false
    }
    if (navigator.sendBeacon) {
        // use sendBeacon
        navigator.sendBeacon(`${serverUrl || ''}/api/data/ping?id=${siteId}&sid=${window.SASANQUA_PAGE_SID}&uid=${localStorage.getItem('sasanqua_uid') || null}`, new Blob([]))
    } else {
        // use fetch
        fetch(`${serverUrl || ''}/api/data/ping?id=${siteId}&sid=${window.SASANQUA_PAGE_SID}&uid=${localStorage.getItem('sasanqua_uid') || null}`, {
            method: 'GET',
            mode: 'cors',
        })
    }
}