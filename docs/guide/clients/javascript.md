---
title: "Client: JavaScript"
---

# JavaScript / Default Client

The source code of the default client is located in [`~/client`](https://github.com/ocoke/sasanqua/tree/main/client) dir.

## Usage

1. First, you need to load the JavaScript file inside the `<body>` tag of your HTML.

```html
<script
    src="/script.js"
    data-site-id=""
    data-server-url=""
    data-speed-insights=""
    data-visiting-time=""
    async
    defer
></script>
```

- The source URL of the script could be `[SERVER_URL]/script.js` (the script will automatically build), you can also load it from other CDN providers.

- For example, the URL will be:

```
# jsDelivr
https://cdn.jsdelivr.net/npm/sasanqua@[SERVER_VERSION]/client-dist/script.js

# Unpkg
https://unpkg.com/sasanqua@[SERVER_VERSION]/client-dist/script.js
```

- The value of `data-site-id` should be your site id (in uuid format), and the value of `data-server-url` is the server address with `http` or `https` (e.g. `https://sasanqua.example.com`)
- If you want to collect speed metrics data, please set `data-speed-insights` to `"true"`, if you want to collect visiting time, please set `data-visiting-time` to `"true"`. **And also, you will need to enable them in the dashboard, otherwise, the data will not be collected.**

2. Then, you can visit your site and the data should be showed in the dashboard.

## What does the script do?

- When the page loads, the script will automatically send a request to the server to collect `language`, `url`, `hostname` and other data.
- If you enable speed insights, the script will also collect the performance data with `web-vitals` library. The data will automatically report to the server.
- If you enable visiting time, the script will automatically ping the server every 20 seconds, when the user hides the page, the ping action will stop until the user is back.