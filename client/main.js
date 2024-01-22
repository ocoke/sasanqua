import { getData } from "./utils/data"
import { collect } from "./utils/collect"
import { ping } from "./utils/ping"
import { reportWebVitals } from "./utils/speed"
import { metrics } from "./utils/metrics"
const getAttr = (id) => {
    return document.currentScript.getAttribute(id)
}
const siteId = getAttr('data-site-id') || window.SASANQUA_SITE_ID;
const serverUrl = getAttr('data-server-url') || window.SASANQUA_SERVER_URL;
const enableSpeed = getAttr('data-speed-insights') || window.SASANQUA_SPEED_INSIGHTS;
const enableVisitingTime = getAttr('data-visiting-time') || window.SASANQUA_VISITING_TIME;


if (!siteId) {
    throw new Error('Sasanqua: site id is required.')
}


const collectData = {
    data: getData(),
    speed: {}
}

const SpeedData = {
    FCP: null,
    LCP: null,
    TTFB: null,
    CLS: null,
    FID: null,
}

// send data


setTimeout(() => {
    collect(serverUrl, collectData, siteId)
}, 200)

if (enableSpeed) {
    // get speed insights
    reportWebVitals((data) => {
        SpeedData[data.name] = Number((data.value).toFixed(4))
    })
    window.last_upload_metrics = {}
    window.sa_mt = setInterval(() => {
        let raw = window.last_upload_metrics
        let changed = false
        for (let i in SpeedData) {
            if (raw[i] != SpeedData[i]) {
                changed = true
                break
            }
        }
        if (changed) {
            window.last_upload_metrics = SpeedData
            metrics(serverUrl, SpeedData, siteId, window.SASANQUA_PAGE_SID)
        }
    }, 1000 * 15)
}


if (enableVisitingTime) {
    // interval, ping
    window.sa_vti = setInterval(() => {
        ping(serverUrl, siteId)
    }, 1000 * 20)
    // when page change, clear interval

}

window.addEventListener('beforeunload', () => {
    metrics(serverUrl, SpeedData, siteId, window.SASANQUA_PAGE_SID, localStorage.getItem('sasanqua_uid'))
    window.SASANQUA_PAGE_SID = null
    clearInterval(window.sa_vti)
    clearInterval(window.sa_mt)
})
document.addEventListener('visibilitychange', function () {
    if (document.visibilityState == 'hidden') {
        // user hide the page
        clearInterval(window.sa_vti)
    } else {
        // user back to the page
        window.sa_vti = setInterval(() => {
            ping(serverUrl, siteId)
        }, 1000 * 20)
    }
});