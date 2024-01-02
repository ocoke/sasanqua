export default eventHandler(async (event) => {
    // read header, authorization
    const authorization = getHeader(event, 'authorization')
    // check if authorization is valid
    if (!authorization) {
        return {
            code: 401,
            error: 'invalid authorization',
        }
    }
    // check if authorization is valid
    if (!authorization.startsWith('Bearer ')) {
        return {
            code: 401,
            error: 'invalid authorization',
        }
    }
    // get token
    const token = authorization.substring(7)
    const result = await checkUserToken(token)
    if (result == null) {
        return {
            code: 401,
            error: 'invalid authorization',
        }
    } else {
        return {
            code: 200,
            error: null,
            data: result,
        }
    }
})