import { filterIs, getDataResults,  } from "../../utils/scripts/filterResults"
export default eventHandler(async (event) => {
    // auth
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

    // id: site id, from/to: timestamp
    const { id, from, to, query, filter } = await getQuery(event)

    const queries = (<string>query || '').split(',')

    let filters = {}

    if (filter) {
        try {
            filters = JSON.parse((<string>filter))
        } catch (e) {
            console.warn(e)
        }
    }

    if (!id) {
        return {
            code: 400,
            error: 'invalid id',
        }
    }

    // init storage
    const storage = useStorage('sasanqua')

    // get data
    const data = await storage.getItem("data:" + id)

    if (!data) {
        return {
            code: 404,
            error: 'not found',
        }
    }


    const response = {}
    const mergedArray = Object.entries(data).reduce((acc, [key, valueArray]) => {
        const itemsWithKey = valueArray.map(item => ({ ...item, uniqueId: key }));
        return acc.concat(itemsWithKey);
    }, []);
    let filteredData = mergedArray.filter(item => item.date >= Number(from || 0) && item.date <= Number(to || new Date().getTime()));

    for (let key in filters) {
        let val = filters[key]
        filteredData = filteredData.filter(item => {
            try {
                if (filterIs(item, key, val)) {
                    return true
                } else {
                    return false
                }
            } catch (e) {
                return false
            }
        })
    }


  
    
    return {
        code: 200,
        error: null,
        data: {
            ...response,
            ...getDataResults(filteredData, query, Number(from || 0), Number(to || new Date().getTime())),
        },
    }

})