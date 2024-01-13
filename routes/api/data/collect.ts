import { UAParser } from 'ua-parser-js'
import { v4 as uuid, validate as isUuid } from "uuid"


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

    const siteResult: CollectedSiteData = (await storage.getItem("data:" + id)) || {}

    const siteData: EditSiteData = await getCachedSite(id).catch(() => {
        return {
            name: "",
            description: "",
            domain: "",
            features: {},
        }
    })

    const uniqueId = (isUuid(uid) ? uid : uuid()) || uuid()

    // rewrite data
    try {
        payload.data.referrer = new URL(payload.data.referrer).hostname
    } catch(e) {
        payload.data.referrer = ""
    }

    try {
        <object>payload.data.query = Object.fromEntries(new URLSearchParams(<string>payload.data.query))
    } catch(e) {
        payload.data.query = {}
    }


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