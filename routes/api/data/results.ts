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

    const filters = JSON.parse(decodeURIComponent(<string>filter))

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
    if (queries.includes('chart')) {
        // visit/visitor, split by times
        if (Number(to || new Date().getTime()) - Number(from || 0) <= 86400000) {
            // less than 24hrs, split by hours
            const resp = {
                type: 'hours',
                visits: [],
                visitors: [],
                from: Number(from || 0),
                to: Number(to || new Date().getTime()),
            }

            for (let i = 0; i < 24; i++) {
                const start = Number(from || 0) + i * 3600000;
                const end = Number(from || 0) + (i + 1) * 3600000;

                const filtered = filteredData.filter(item => item.date >= start && item.date <= end);

                resp.visits.push(filtered.length || 0);

                resp.visitors.push(new Set(filtered.map(item => item.uniqueId)).size || 0);
            }

            response['chart'] = resp;
        } else if (Number(to || new Date().getTime()) - Number(from || 0) <= 90 * 86400000) {
            // less than 90 days, split by days
            const resp = {
                type: 'days',
                visits: [],
                visitors: [],
                from: Number(from || 0),
                to: Number(to || new Date().getTime()),
            }
            let start = Number(from || 0)
            let end = start + 86400000
            while(end <= Number(to || new Date().getTime())) {
                const filtered = filteredData.filter(item => item.date >= start && item.date <= end);

                resp.visits.push(filtered.length || 0);
                resp.visitors.push(new Set(filtered.map(item => item.uniqueId)).size || 0);

                start += 86400000
                end += 86400000
            }
            response['chart'] = resp
        } else if (Number(to || new Date().getTime()) - Number(from || 0) <= 365 * 86400000) {
            // less than 365 days, split by months
            const febCalc = new Date(Number(from || 0)).getMonth() > 1 ? Number(to || new Date().getTime()) : Number(from || 0)
            const months = [31, 28 + (new Date(febCalc).getFullYear() % 4 === 0 ? 1 : 0), 31, 30, 31, 30, 31, 31, 30, 31, 30 ,31]
            let start = Number(from || 0)
            let end = start + months[new Date(start).getMonth()] * 86400000
            const resp = {
                type: 'months',
                visits: [],
                visitors: [],
                from: Number(from || 0),
                to: Number(to || new Date().getTime()),
                months,
            }
            while(end <= Number(to || new Date().getTime())) {
                const filtered = filteredData.filter(item => item.date >= start && item.date <= end);

                resp.visits.push(filtered.length || 0);
                resp.visitors.push(new Set(filtered.map(item => item.uniqueId)).size || 0);

                start += months[new Date(start).getMonth()] * 86400000
                end += months[new Date(start).getMonth()] * 86400000
            }
            response['chart'] = resp
        }
    }

    if (queries.includes('realtime')) {
        filteredData.sort((a, b) => b.visitTime - a.visitTime);

        response['realtime'] = filteredData
    }

    return {
        code: 200,
        error: null,
        data: response,
    }

})