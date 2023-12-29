// get site data
import { isUuid } from "uuidv4"
interface EditSiteData {
    name: string,
    description: string,
    domain: string,
    features: {
        [key: string]: boolean,
    }
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
    const result = checkUserToken(token)
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
    const data: EditSiteData = await storage.getItem("site:" + id)


    return {
        code: 200,
        error: null,
        data: {
            id,
            site: data,
        },
    }

})