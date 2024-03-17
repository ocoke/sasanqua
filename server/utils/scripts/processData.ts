export const processData = (data: CollectData) => {
    for (let key in data.data) {
        let val = data.data[key]
        switch (key) {
            case 'hostname':
                try {
                    data.data.hostname = new URL('http://' + data.data.hostname).hostname
                } catch(e) {
                    return false;
                }
                break;
            case 'language':
                if (val.length > 10) {
                    return false;
                }
                break
            case 'referrer':
                try {
                    data.data.referrer = new URL(data.data.referrer).hostname
                } catch(e) {
                    data.data.referrer = ""
                }
                break
            case 'screen':
                try {
                    if (Number(val[0]) < 10000 && Number(val[1]) < 10000) {
                        continue
                    }
                } catch(e) {
                    return false;
                }
                break
            case 'title':
                try {
                    data.data.title = val.substring(0, 100)
                } catch(e) {
                    return false;
                }
                break
            case 'url':
                try {
                    data.data.url = new URL(data.data.url, 'http://localhost').pathname
                } catch(e) {
                    return false;
                }
                break
            case 'query':
                try {
                    <object>data.data.query = Object.fromEntries(new URLSearchParams(<string>data.data.query))
                } catch(e) {
                    data.data.query = {}
                }
                break
            default:
                break;
        }
    }
    return data
}


