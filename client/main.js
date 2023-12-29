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
const refrerrer = document.referrer || ''
const screen = [window.screen.availWidth || window.innerWidth, window.screen.availHeight || window.innerHeight]
const title = document.title
const url = location.pathname
const query = location.search

const collectData = {
    data: {
        hostname,
        language,
        refrerrer,
        screen,
        title,
        url,
        query,
    },
    speed: {}
}

// send data
setTimeout(() => {
    const reqUrl = `${serverUrl || ''}/api/collect`
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
}