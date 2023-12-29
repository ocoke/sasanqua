import { UAParser } from 'ua-parser-js'
import { v4 as uuid, validate as isUuid } from "uuid"
interface CollectData {
    data: {
        hostname: string,
        language: string,
        referrer: string,
        screen: number[],
        title: string,
        url: string,
        query: string,
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
    region: string,
    city: string,
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
    device: string,
}
interface EditSiteData {
    name: string,
    description: string,
    domain: string,
    features: {
        [key: string]: boolean,
    }
}

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

export default eventHandler(async (event) => {
    const data = await readBody(event)
    const payload: CollectData = data.payload
    const id: string = data.id
    const req = event.node.req

    const geoip: GeoIp = await getGeoIp(req)

    // get user-agent & ip
    const userAgent = getHeader(event, 'user-agent')
    const uid: string = getHeader(event, 'x-sasanqua-id')


    // init storage
    const storage = useStorage('sasanqua')
    const parser = new UAParser(userAgent);
    
    const ua: UaData = UAParse(parser.getResult())

    // get site data

    // const siteData: EditSiteData = await storage.getItem("site:" + id)

    const siteData: EditSiteData = await getCachedSite(id).catch(() => {
        return {
            name: "",
            description: "",
            domain: "",
            features: {},
        }
    })

    const siteResult: CollectedSiteData = (await storage.getItem("data:" + id)) || {}

    const uniqueId = (isUuid(uid) ? uid : uuid()) || uuid()


    const thisData = {
        data: payload,
        geo: geoip,
        ua: ua,
        sid: uuid(),
        visitTime: new Date().getTime(),
        date: new Date().getTime(),
    }


    if (siteData.features.speedInsights) {
        // thisData.data.speed.score = await getSpeedScore(thisData.data.speed)
    } else {
        // remove useless data
        delete thisData.data.speed
    }

    if (!siteData.features.visitTime) {
        // remove useless data
        delete thisData.visitTime
        delete thisData.sid
    }

    // push data

    if (siteResult) {
        if (siteResult[uniqueId]) {
            siteResult[uniqueId].push(thisData)
        } else {
            siteResult[uniqueId] = [thisData]
        }
    }
    // save data
    await storage.setItem("data:" + id, siteResult)

    return {
        code: 200,
        error: null,
        data: {
            uid: uniqueId,
            sid: thisData.sid,
        },
    }
    
})