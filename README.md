# Prisma Authorized Starter

---

### Download

**Opt 1 - via Standard Method**

1.  `git clone https://github.com/servexyz/prisma-authorized-starter` (required)
2.  `git clone https://github.com/servexyz/aws-sls-auth-starter` (required)
3.  `git clone http://github.com/servexyz/aws-sls-auther` (optional)
4.  `npm install` dependencies across directories

**Opt 2 - via Repogen**

1.  `git clone https://github.com/servexyz/prisma-authorized-starter`
2.  `npm install -g repogen`
3.  `repogen .repogen.js`

### Run

> requires 2 terminal tabs/windows

4.  `cd prisma-authorized-starter && npm start`
5.  `cd aws-sls-auther starter && npm start`

### Customize

1.  Replace `aws-sls-auther` with your own custom authentication functions.

---

## What, Where, Why

### Environment Variables

| What              | Where                          | Why                       |
| :---------------- | :----------------------------- | :------------------------ |
| `AUTHER_ENDPOINT` | aws-sls-auther, prisma-service | Prefixed to `Route` types |
| `PRISMA_ENDPOINT` | prisma-service                 | Init GraphQLServer        |

### Code

| Where                     | Why                               |
| :------------------------ | :-------------------------------- |
| prisma-service/`src`      | Our service which utilizes Prisma |
| prisma-service/`database` | MySQL                             |

### Servers

| What        | Where            |
| :---------- | :--------------- |
| Our Service | localhost:`4000` |
| Prisma      | localhost:`4466` |
| Database    | localhost:`3306` |

---
