import { v4 as uuid, validate as isUuid } from "uuid"

interface EditSiteData {
    name: string,
    description: string,
    domain: string,
    features: {
        [key: string]: boolean,
    }
}
interface ReqSiteData {
    id: string,
    data: EditSiteData,
}
interface ListData {
    [key: string]: string[],
}

export default eventHandler(async (event) => {
    // get authorization headers
    const authorization = getHeader(event, 'authorization')
    // check if authorization is valid
    if (!authorization) {
        return {
            code: 401,
            error: 'invalid authorization',
        }
    }
    const token = authorization.substring(7)
    const result = await checkUserToken(token)
    if (!result) {
        return {
            code: 401,
            error: 'invalid authorization',
        }
    }

    // get data
    const data: ReqSiteData = await readBody(event)

    let id = data.id
    let siteData = data.data

    // check if data is valid
    if (!data || !siteData || !siteData.name || !siteData.domain) {
        return {
            code: 400,
            error: 'invalid data',
        }
    }

    // if there is no id, create a new site
    if (!id) {
        id = uuid()
    }

    if (!isUuid(id)) {
        return {
            code: 400,
            error: 'invalid id',
        }
    }
    // init storage
    const storage = useStorage('sasanqua')

    const collectedData = (await storage.getItem("data:" + id)) || {}

    collectedData['_data_'] = siteData
    
    // set site data
    await storage.setItem("data:" + id, collectedData)
    
    const listData: ListData = (await storage.getItem("site:list") || {})

    listData[id] = [siteData.name, siteData.domain]

    await storage.setItem("site:list", listData)

    return {
        code: 200,
        error: null,
        data: {
            id,
            site: siteData,
        },
    }
})