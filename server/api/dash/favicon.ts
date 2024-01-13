export default eventHandler(async (event) => {
    let { domain } = await getQuery(event)
    if (!domain) {
        domain = 'example.com'
    }
    const img = await fetch(`https://www.google.com/s2/favicons?sz=128&domain=${domain}`)
    const buffer = await img.arrayBuffer()
    const headers = {
        'content-type': 'image/png',
    }
    return new Response(buffer, { headers })

})