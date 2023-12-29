import jwt from 'jsonwebtoken'

interface UserData {
    username: string,
    password: string,
}

export default eventHandler(async (event) => {
    // get username and password from request body
    const { username, password } = await readBody(event)

    // check if username and password are valid
    if (!username || !password || username.length > 32 || password.length > 32) {
        return {
            code: 400,
            error: 'invalid username or password',
        }
    }
    // init storage
    const storage = useStorage('sasanqua')

    const userData: UserData = await storage.getItem("user:" + username)

    if (userData != undefined) {
        return {
            code: 400,
            error: 'invalid username or password',
        }
    } else {
        
        // write in user data

        await storage.setItem("user:" + username, {
            username: username,
            password: password,
        })
        

        const token = jwt.sign({
            // exp: 1 day
            exp:  Math.floor(Date.now() / 1000) + (60 * 60 * 24),
            data: {
                username: username,
                password: password,
                type: "user"
            }
        }, useRuntimeConfig().sasanquaSecret || '_sasanqua_')

        return {
            code: 200,
            error: null,
            data: token,
        }

    }

})