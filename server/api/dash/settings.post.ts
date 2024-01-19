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

    // get settings data
    const storage = useStorage('sasanqua')
    const { data } = await readBody(event)

    await storage.setItem("conf", data)
    return {
        code: 200,
        data: data,
    }
    
})