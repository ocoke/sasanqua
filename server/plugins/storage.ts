import redisDriver from "unstorage/drivers/redis"
import cloudflareKVBindingDriver from "unstorage/drivers/cloudflare-kv-binding"
import cloudflareKVHTTPDriver from "unstorage/drivers/cloudflare-kv-http"
import cloudflareR2BindingDriver from "unstorage/drivers/cloudflare-r2-binding"
import httpDriver from "unstorage/drivers/http"
import fsDriver from "unstorage/drivers/fs"
import githubDriver from "unstorage/drivers/github"
import memoryDriver from "unstorage/drivers/memory"
import netlifyBlobsDriver from "unstorage/drivers/netlify-blobs"
// Vercel KV
import vercelKVDriver from "unstorage/drivers/vercel-kv"

const dbType = process.env.DATABASE_NAME || "memory"
const _env = process.env.DATABASE_CONFIG || "{}"

let envObj = {}
try {
	envObj = JSON.parse(_env)
} catch (e) {
	console.log(e)
}
const dbConfObj: object = envObj || {}

export default defineNitroPlugin(() => {
	const storage = useStorage()

	const storageBase = dbType
	let driver

	switch (storageBase) {
		case "cloudflare-kv-binding":
			driver = cloudflareKVBindingDriver(dbConfObj)
			break
		case "cloudflare-kv-http":
			driver = cloudflareKVHTTPDriver(dbConfObj)
			break
		case "cloudflare-r2-binding":
			driver = cloudflareR2BindingDriver(dbConfObj)
			break
		case "fs":
			driver = fsDriver(dbConfObj)
			break
		case "http":
			driver = httpDriver(dbConfObj)
			break
		case "github":
			driver = githubDriver(dbConfObj)
			break
		case "memory":
			driver = memoryDriver(dbConfObj)
			break
		// case "mongodb":
		// 	driver = mongodbDriver(dbConfObj)
		// 	break
		case "redis":
			driver = redisDriver(dbConfObj)
			break
		case "vercel-kv":
			driver = vercelKVDriver(dbConfObj)
			break
		case "netlify-blobs":
			driver = netlifyBlobsDriver(dbConfObj)
			break
		default:
			driver = memoryDriver(dbConfObj)
			break
	}

	// Mount driver
	storage.mount("sasanqua", driver)
})