export const collect = (serverUrl, collectData, siteId) => {
    const reqUrl = `${serverUrl || ''}/api/data/collect`
    const uid = localStorage.getItem('sasanqua_uid') || null
    const res = fetch(reqUrl, {
        method: 'POST',
        body: JSON.stringify({
            payload: collectData,
            id: siteId,
        }),
        headers: {
            'Content-Type': 'application/json',
            'x-sasanqua-id': uid,
        },
    }).then(res => res.json()).then(res => {
        if (res.data.uid) {
            localStorage.setItem('sasanqua_uid', res.data.uid)
        }
        if (res.data.sid) {
            window.SASANQUA_PAGE_SID = res.data.sid
        }
    })
}