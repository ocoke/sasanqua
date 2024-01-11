// get site id
const siteId = document.currentScript.getAttribute('data-site-id') || window.SASANQUA_SITE_ID;
const serverUrl = document.currentScript.getAttribute('data-server-url') || window.SASANQUA_SERVER_URL;
const enableSpeed = document.currentScript.getAttribute('data-speed-insights') || window.SASANQUA_SPEED_INSIGHTS;
const enableVisitingTime = document.currentScript.getAttribute('data-visiting-time') || window.SASANQUA_VISITING_TIME;
if (!siteId) {
    throw new Error('Sasanqua: site id is required.')
}

const hostname = location.hostname || ''
const language = navigator.language || ''
const referrer = document.referrer || ''
const screen = [window.screen.availWidth || window.innerWidth, window.screen.availHeight || window.innerHeight]
const title = document.title
const url = location.pathname
const query = location.search

const collectData = {
    data: {
        hostname,
        language,
        referrer,
        screen,
        title,
        url,
        query,
    },
    speed: {}
}

// send data
setTimeout(() => {
    const reqUrl = `${serverUrl || ''}/api/data/collect`
    const uid = localStorage.getItem('sasanqua_uid') || null
    const res = fetch(reqUrl, {
        method: 'POST',
        body: JSON.stringify({
            payload: collectData,
            id: siteId,
        }),
        headers: {
            'Content-Type': 'application/json',
            'x-sasanqua-id': uid,
        },
    }).then(res => res.json()).then(res => {
        if (res.data.uid) {
            localStorage.setItem('sasanqua_uid', res.data.uid)
        }
        if (res.data.sid) {
            window.SASANQUA_PAGE_SID = res.data.sid
        }
    })
}, 200)

if (enableSpeed) {
    // get speed insights
}

if (enableVisitingTime) {
    // interval, ping
    const visitingTimeInterval = setInterval(() => {
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
    }, 1000 * 20)
    // when page change, clear interval
    window.addEventListener('beforeunload', () => {
        window.SASANQUA_PAGE_SID = null
        clearInterval(visitingTimeInterval)
    })
}