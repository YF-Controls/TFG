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
yarn add @nestjs/websockets @nestjs/platform-socket.io
yarn add socket.io
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