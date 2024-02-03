---
title: Vercel & Vercel KV
---

# Vercel & Vercel KV

Vercel provides serverless runtime and Key-Value database at the same time, we recommend it because it is easy to manage your data and integrate the database with the server.

- Click on the button to new a Sasanqua project.

- [![Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Focoke%2Fsasanqua&env=DATABASE_NAME,DATABASE_CONFIG&envDescription=Database%20Settings%20for%20the%20Sasanqua&envLink=https%3A%2F%2Fgithub.com%2Focoke%2Fsasanqua&project-name=sasanqua-project&repository-name=sasanqua-project)

- Enter `vercel-kv` for the `DATABASE_NAME` and `{}` for the `DATABASE_CONFIG`.

```env
DATABASE_NAME=vercel-kv
DATABASE_CONFIG={}
```

- Click `Deploy` to deploy Sasanqua in your Vercel account.
- Go to your Sasanqua project and click on the `Storage` tab.

![image](https://github.com/ocoke/sasanqua/assets/71591824/4f8af488-f70d-4671-8b03-12b59b8933f2)

- Then, click `Connect Store` to connect with your Vercel KV database.

![image](https://github.com/ocoke/sasanqua/assets/71591824/222c84eb-b1e1-41a6-a841-c148d23789b8)

- You can select an existing KV database or create a new one.

![image](https://github.com/ocoke/sasanqua/assets/71591824/e846c906-c841-4798-aabb-60d623a217b1)

- Select all the environments and click `Connect` to connect with your Sasanqua Analytics.

![image](https://github.com/ocoke/sasanqua/assets/71591824/d8448f8d-3013-4b6d-a7f3-279735d6a3eb)

- You may need to redeploy your Sasanqua app to make sure that the environment variables were set.
