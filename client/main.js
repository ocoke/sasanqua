import { getData } from "./utils/data"
import { collect } from "./utils/collect"
import { ping } from "./utils/ping"

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

// send data
setTimeout(() => {
    collect(serverUrl, collectData, siteId)
}, 200)

if (enableSpeed) {
    // get speed insights
}

if (enableVisitingTime) {
    // interval, ping
    window.sa_vti = setInterval(() => {
        ping(serverUrl, siteId)
    }, 1000 * 20)
    // when page change, clear interval
    window.addEventListener('beforeunload', () => {
        window.SASANQUA_PAGE_SID = null
        clearInterval(window.sa_vti)
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
}