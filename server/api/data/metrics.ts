import { validate as isUuid } from "uuid"

export default eventHandler(async (event) => {
    // get uid from request headers
    // const uid = getHeader(event, 'x-sasanqua-id')
    // get site id from request body
    const { id, sid, uid, payload: rawPayload } = await readBody(event)
    // check if id is valid
    if (!id || !isUuid(id) || !sid || !isUuid(sid) || !uid || !isUuid(uid)) {
        return {
            code: 400,
            error: 'invalid id',
        }
    }


    const payload = processMetrics(rawPayload)
    if (!payload) {
        return {
            code: 400,
            error: 'invalid payload'
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
    if (!siteData.features.speedInsights) {
        return {
            code: 400,
            error: 'invalid site',
        }
    }
    // get site data
    const siteResult: CollectedSiteData = (await storage.getItem("data:" + id)) || {}
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
    for(const key in payload) {
        data.data.speed[key as keyof SpeedType] = payload[key as keyof SpeedType];
    }
    data.data.speed['score'] = calcScore(data.data.speed) || null;
    console.log(data.data.speed)
    // save data
    await storage.setItem("data:" + id, siteResult);
    // return result
    return {
        code: 200,
        error: null,
    }
})