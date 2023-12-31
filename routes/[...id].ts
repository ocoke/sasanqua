export default eventHandler(async (event) => {
  if (process.env.SASANQUA_DASH) {
    const path = event.node.req.url
    return await fetch(`${process.env.SASANQUA_DASH}${path}`)
  } else {
    return {
      sasanqua: 'server',
      data: 'please check that the dashboard is built successfully or that the environment variables are correct.'
    }
  }
})
