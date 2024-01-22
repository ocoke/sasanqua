export const metrics = (serverUrl, speedData, siteId, sid,) => {
    const reqUrl = `${serverUrl || ''}/api/data/metrics`
    const uid = localStorage.getItem('sasanqua_uid') || null
    const res = fetch(reqUrl, {
        method: 'POST',
        body: JSON.stringify({
            payload: speedData,
            id: siteId,
            sid: sid,
            uid: uid,
        }),
        headers: {
            'Content-Type': 'application/json',
            'x-sasanqua-id': uid,
        },
    }).then(res => res.json()).then(res => {})
}