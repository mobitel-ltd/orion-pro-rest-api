# orion-pro-rest-api
HTTP REST api to work with orion pro soap

## Install

```
npm i @mobitel.ltd/orion-pro-api
```

## How to use

```
const Api = require('@mobitel.ltd/orion-pro-api');

const api = new Api({url: <your_url>})

api
    .getPersonByTabNumber({tabNum: <user_tabNum>})
    .then(console.log);
```
