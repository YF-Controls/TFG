# HOME ASSISTANT PROJECT

## Information

| Item | Description |
|:-----|:------------|
| Author | Christian Yáñez Fonseca |
| Project | TFG |

## Backend

### Install enviroment variables config

Module to handle enviroment variables.

```shell
yarn add @nestjs/config
```

### Install ORM driver and PostgreSQL connector

Driver to handle Databases with ORM.

```shell
yarn add @nestjs/typeorm typeorm
```

PostgreSL module.

```shell
yarn add pg
```

### Install Class validator and transformer

Module to valite and transfor a class.

```shell
yarn add class-validator class-transformer
```

### Install UUID

Module to generate UUID for database table ID.

```shell
yarn add uuid
yarn add -D @types/uuid
```

### Encrypt password

```shell
yarn add bcrypt
yarn add -D @types/bcrypt
```

### JSON Web Token

```shell
yarn add @nestjs/passport passport
yarn add @nestjs/jwt passport-jwt
yarn add -D @types/passport-jwt
```

### Web Sockets

```shell
yarn add @nestjs/websockets @nestjs/platform-socket.io socket.io
yarn add -D @types/socket.io
```

### Cookie Protection

```shell
yarn add cookie-parser
yarn add -D @types/cookie-parser
```

### PostgreSQL Database

#### Table: `Users`

| Field | Type |
|:------|:-----|
| id | uuid |
| email | string |
| fullname | string |
| password | string |
| isActive | bool |
| roles | string[] |

Create nest resource:

```shell
nest g res auth --no-spec
```

#### Table: `Devices`

| Field | Type |
|:------|:-----|
| id | uuid |
| name | string |
| type | string |
| isActive | bool |

Create nest resource:

```shell
nest g red devices --no-spec
```

* Swagger - Documentation Open Api

```shell
yarn add @nestjs/swagger
```

## Frontend

```shell
ng new frontend
```

* To start the app.

```shell
cd frontend
ng serve -o
```

### Install Tailwind and Daisy UI

* Tailwind

```shell
npm install daisyui@latest tailwindcss@latest @tailwindcss/postcss@latest postcss@latest --force
npm i -D daisyui@latest
```

* `.postcssrc.json`

```ts
{
  "plugins": {
    "@tailwindcss/postcss": {}
  }
}
```

* `src/styles.css`

```css
@import "tailwindcss";
@plugin "daisyui";
```

* Adding Daisy UI themes

> Modify `src/styles.css`

```css
@import "tailwindcss";
@plugin "daisyui" {
  themes: light --default, dark --prefersdark, halloween;
}
```

> Modify `src/index.html`

```html
<html lang="en" data-theme="halloween">
```

### Modal Components

```shell
npm i @angular/cdk
```

### Toast

[Video](https://www.youtube.com/watch?v=qpKUf_9Ut9k)

```shell
npm i @angular/material
```

### Translate

```shell
cd frontend
npm i @ngx-translate/core @ngx-translate/http-loader
```

### Charts

```shell
cd frontend
npm i chart.js
```

### WebSockets

```shell
cd frontend
npm i socket.io-client
```

## Development

1. Backend listen on 0.0.0.0

2. Windows firewall ruler:

```shell
New-NetFirewallRule -DisplayName "Node Backend" -Direction Inbound -Protocol TCP -LocalPort 4000 -Action Allow
```

Notes de fallos y otras cosas:

* Frontend. He puesto IP y ya no voy por local host, pero la petición HTTP la sigue haciendo con localhost

> Op. 1: En el navegador vamos a DevTools -> Network -> Check en Disable chache
> Op. 2: Limpiar la caché de compilación de angular: ve a `frontend/.angular` y elimina la carpeta `/cache`
