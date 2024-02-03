---
title: Netlify & Netlify Blobs
---

# Netlify & Netlify Blobs

Netlify provides serverless runtime and database at the same time, we recommend it because it is easy to manage your data and integrate the database with the server.

::: warning
We're not sure that this way will work because Netlify Blobs is still in beta experiment.
We received `The environment has not been configured to use Netlify Blobs. To use it manually, supply the following properties when creating a store: siteID, token` error when we're testing, if you have the same problems, please start an issue.
:::

<!--
- New a token https://app.netlify.com/user/applications#personal-access-tokens
- ![image](https://github.com/ocoke/sasanqua/assets/71591824/5e0e73f3-920e-4063-89e3-450cfd9fce30)
- ![image](https://github.com/ocoke/sasanqua/assets/71591824/d77f569d-559d-403f-b6d3-4eae043e53a2)
-->

- Click on the button to new a Sasanqua project.
- [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/ocoke/sasanqua#DATABASE_NAME=netlify-blobs&DATABASE_CONFIG={})
- Click `Connect to GitHub` to connect Netlify with your GitHub account.

![image](https://github.com/ocoke/sasanqua/assets/71591824/1cf082fb-99f9-4363-a599-775efb7d3d51)

- Change the name of the project, and the dataabase settings, then click `Save & Deploy`.
- You can keep the default if you're using Netlify Blobs as the database.

```env
# For Netlify Blbos
DATABASE_NAME=netlify-blobs
DATABASE_CONFIG={"name":"sasanqua"}
```

![image](https://github.com/ocoke/sasanqua/assets/71591824/f81cc51c-3a49-4c76-b494-92bb2e2e668f)

- Netlify will automatically run the build command and deploy the site.

![image](https://github.com/ocoke/sasanqua/assets/71591824/f9947258-8006-481f-82ae-b1c529854f60)

- After deploying the site, you can visit it with the URL.
