import { validate as isUuid } from "uuid"

interface CollectedSiteData {
    [key: string]: {
        data: CollectData,
        geo: GeoIp,
        ua: UaData,
        sid: string,
        visitTime: number,
        date: number,
    }[],
}
interface CollectData {
    data: {
        hostname: string,
        language: string,
        referrer: string,
        screen: number[],
        title: string,
        url: string,
    },
    speed: {
        FCP: number,
        TTFB: number,
        LCP: number,
        CLS: number,
        FID: number,
        INP: number,
        score: number,
    }
}
interface GeoIp {
    country: string,
    city: string,
    country_code: string,
}

interface UaData {
    browser: {
        name: string,
        version: string,
    },
    os: {
        name: string,
        version: string,
    },
    mobile: boolean,
}
interface EditSiteData {
    name: string,
    description: string,
    domain: string,
    features: {
        [key: string]: boolean,
    }
}

export default eventHandler(async (event) => {
    // get uid from request headers
    // const uid = getHeader(event, 'x-sasanqua-id')
    // get site id from request body
    const { id, sid, uid } = await getQuery(event)
    // check if id is valid
    if (!id || !isUuid(id) || !sid || !isUuid(sid) || !uid || !isUuid(uid)) {
        return {
            code: 400,
            error: 'invalid id',
        }
    }
    // init storage
    const storage = useStorage('sasanqua')
    // get site data
    const siteData: EditSiteData = await getCachedSite(id).catch(() => {
        return {
            name: "",
            description: "",
            domain: "",
            features: {},
        }
    })
    if (!siteData.features.visitTime) {
        return {
            code: 400,
            error: 'invalid site',
        }
    }
    // get site data
    const siteResult: CollectedSiteData = await storage.getItem("data:" + id)
    if (!siteResult[uid]) {
        return {
            code: 400,
            error: 'invalid uid',
        }
    }
    // match sid
    const data = siteResult[uid].find((item) => {
        return item.sid === sid
    })
    if (!data) {
        return {
            code: 400,
            error: 'invalid sid',
        }
    }
    // update data
    data.visitTime = new Date().getTime()
    // save data
    await storage.setItem("data:" + id, siteResult)
    // return result
    return {
        code: 200,
        error: null,
    }
})