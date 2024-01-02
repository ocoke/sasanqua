# Sasanqua

> 📈 Simple, privacy-friendly, real-time traffic insights at the edge.


## How does Sasanqua work?

The rule for naming our API routes is: `/api/[category]/[action]`.

Sasanqua uses Nitro to run and collect data at the edge. It can be compatible with multiple platforms. When you're building Sasanqua to deploy, you will need to run `yarn && yarn build` to install the dependencies and build the script, dashboard, and server separately.

### User

- Before you start, you will need to sign up (`/api/user/signup`) for an account for Sasanqua. You need to provide your username and password, this action will return you a token that is in JWT format.
- You can use `/api/user/token` to check your token if that is valid. In Sasanqua, you can provide your token with `Authorization: Bearer [TOKEN]` in the request header.
- If your token is expired, you can use `/api/user/signin` to sign in again to get a new token.

### Site

- You can create a new site in Sasanqua or edit settings from `/api/site/edit`, you will need to provide the data of the site. If you are editing an existing site, you will also need to provide the id.

```ts
interface EditSiteData {
    name: string,
    description: string,
    domain: string,
    features: {
        [key: string]: boolean,
    }
}
```

- You can get the settings of a site from `/api/site/get` by providing an ID.
- You can all the sites in the database by accessing `/api/site/list`.

### Data Collecting

- You can send data to the server by using `/api/data/collect`. Your payload needs to include `id` (your site id) and `payload` (the data). In the `payload`, there should be hostname, language, referrer and other data. If you're collecting the speed data, you also need to collect FCP, TTFB and other performance data. The lighthouse real-experience score will be calculated on the server. The Country/Region and device data (based on IP and UA) will also be parsed on the server. Then, the server will return you a `uid` and a `sid` (if you enable visiting time collecting).
- You will need to store your `uid` (for example, you can put it in `localStorage`). This is used to identify unique users. The `sid` is used to calculate the visiting time of the user. It should only used in a single session on a single page. (for example, you can put it in `window`). 
- If there is an existing `uid`, you will need to put it in `x-sasanqua-id` in the request header in the request.
- If you are calculating visiting time, request `/api/data/ping` regularly and also put the `sid` and the interval time in the request payload *(todo)*.


```ts
interface CollectData {
    data: {
        hostname: string,
        language: string,
        referrer: string,
        screen: number[],
        title: string,
        url: string,
    },
    speed: {
        FCP: number,
        TTFB: number,
        LCP: number,
        CLS: number,
        FID: number,
        INP: number,
        score: number,
    }
}
```

