


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

    const data: ListData = await storage.getItem("site:list")


    return {
        code: 200,
        error: null,
        data: data,
    }

})