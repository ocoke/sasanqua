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
    const { id, from, to, query } = await getQuery(event)

    const queries = (<string>query || '').split(',')

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
    const mergedArray = Object.values(data).reduce((acc, val) => acc.concat(val), []);
    const filteredData = mergedArray.filter(item => item.date >= Number(from || 0) && item.date <= Number(to || new Date().getTime()));

    if (queries.includes('data')) {


        filteredData.sort((a, b) => b.date - a.date);

        response['data'] = filteredData
    }
    if (queries.includes('url')) {

        const urls = filteredData.map(item => item.data.data.url);


        const urlCount = urls.reduce((acc, url) => {
            acc[url] = (acc[url] || 0) + 1;
            return acc;
        }, {});


        response['url'] = urlCount
    }
    if (queries.includes('referrer')) {

        const urls = filteredData.map(item => item.data.data.referrer);


        const referrerCount = urls.reduce((acc, url) => {
            acc[url] = (acc[url] || 0) + 1;
            return acc;
        }, {});


        response['referrer'] = referrerCount
    }
    if (queries.includes('country')) {

        const countries = filteredData.map(item => item.geo.country);
        const countryCount = countries.reduce((acc, country) => {
            acc[country] = (acc[country] || 0) + 1;
            return acc;
        }
            , {});
        response['country'] = countryCount
    }
    if (queries.includes('language')) {

        const languages = filteredData.map(item => item.data.data.language);
        const languageCount = languages.reduce((acc, language) => {
            acc[language] = (acc[language] || 0) + 1;
            return acc;
        }
            , {});
        response['language'] = languageCount
    }

    if (queries.includes('screen')) {
        const screens = filteredData.map(item => item.data.data.screen);
        const screenCount = screens.reduce((acc, screen) => {
            acc[screen] = (acc[screen] || 0) + 1;
            return acc;
        }
            , {});
        response['screen'] = screenCount
    }

    if (queries.includes('visit_time')) {
        const averageVisitTime = filteredData.reduce((acc, item) => {
            const visitTime = item.visitTime - item.date;
            return acc + visitTime;

        }, 0) / filteredData.length;

        response['visit_time'] = averageVisitTime / 1000
    }

    if (queries.includes('visitor')) {
        const uniqueVisitors = new Set();

        filteredData.forEach(item => {
            const uniqueId = item.uniqueId;
            uniqueVisitors.add(uniqueId);
        });

        response['visitor'] = uniqueVisitors.size;
    }
    if (queries.includes('visit')) {
        response['visit'] = filteredData.length;
    }
    if (queries.includes('browser')) {
        const browsers = filteredData.map(item => item.ua.browser.name);
        const browserCount = browsers.reduce((acc, browser) => {
            acc[browser] = (acc[browser] || 0) + 1;
            return acc;
        }
            , {});
        response['browser'] = browserCount
    }
    if (queries.includes('os')) {
        const os = filteredData.map(item => item.ua.os.name);
        const osCount = os.reduce((acc, os) => {
            acc[os] = (acc[os] || 0) + 1;
            return acc;
        }
            , {});
        response['os'] = osCount
    }
    if (queries.includes('device')) {
        const devices = filteredData.map(item => item.ua.device);
        const deviceCount = devices.reduce((acc, device) => {
            acc[device] = (acc[device] || 0) + 1;
            return acc;
        }
            , {});
        response['device'] = deviceCount
    }

    return {
        code: 200,
        error: null,
        data: response,
    }

})