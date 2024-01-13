// get site data
import { validate as isUuid } from "uuid"

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

    // init storage

    const storage = useStorage('sasanqua')

    // get data
    
    const { id } = await readBody(event)

    if (!id || !isUuid(id)) {
        return {
            code: 400,
            error: 'invalid id',
        }
    }
    const data: EditSiteData = (await storage.getItem("data:" + id))['_data_']


    return {
        code: 200,
        error: null,
        data: {
            id,
            site: data,
        },
    }

})