# Documentación

## Clase 121

```shell
yarn add @nestjs/config
```

[Nest JS - DB](https://docs.nestjs.com/techniques/database)

```shell
yarn add @nestjs/typeorm typeorm
yarn add pg
```

## Clase 122

Creamos una api para products

```shell
nest g red products --no-spec
```

## Clase 123

Creé la entidad Products que conecta con la tabla Products

## Clase 124

En `main.ts`

```ts
// Add api prefix -> IP:port/api/...
app.setGlobalPrefix('api');
```

Para los DTO instalar:

```shell
yarn add class-validator class-transformer
```

En `main.ts`

```ts
// Add global pipes
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    //transform: true,
  })
);
```

## 125

HTTP requests

## 126

Tratamiento de excepciones

## 127

Compruba en la clase de la entidad si el dato es correcto.

## 128

Implementar CRUD en Service

## 129

Crear nuevo módulo

```shell
nest g mo nombre-del-modulo
```

Paginación

## 130

Añadir el paquete uuid

```shell
yarn add uuid
yarn add -D @types/uuid
```

## 131 QueryBuilder

```ts
//product = await this.productsRepository.findOneBy({ slug: term });
const queryBuilder = this.productsRepository.createQueryBuilder();
product = await queryBuilder
  .where('UPPER(title) = :title or slug = :slug', {
    title: term.toUpperCase(),
    slug: term.toLowerCase()})
  .getOne();
```

## 132 Update

```ts
async update(id: string, updateProductDto: UpdateProductDto) {

  const product = await this.productsRepository.preload({
    id: id,
    ...updateProductDto
  });

  if (!product) throw new NotFoundException(`Product with id '${id}' not found!`);

  try {
  await this.productsRepository.save(product);
  return product;
  } catch (error) { this.handleDBExceptions(error); }
}
```

## 133 Check before update

Comprobar en la entidad `src/products/entities/product.entity.ts`

```ts
@BeforeUpdate()
checkSlugUpdate() {
  this.slug = this.slug
    .toLowerCase()
    .replaceAll(' ', '_')
    .replaceAll("'", '');
}
```

## 134 Nueva columna en la tabla: Tags

Modifico el dto de create

```ts
@IsString({ each: true })
@IsArray()
@IsOptional()
tags: string[];
```

## 139

[Recursos del curso](https://gist.github.com/Klerith/1fb1b9f758bb0c5b2253dfc94f09e1b6)

## 140 ProductImage entity

* Creo index.ts para entities, ayuda a la exportación. Ver module.ts donde son importados.

## 141 OneToMany - ManyToOne

* Ver las relaciones en las entities

## 142 Crear imagen de producto

Hacer requests y modificación del servicio en create.

## 143 Aplanar las imágenes

* Se añade eager en la entity de Product para que se puedan ver las relaciones en el GET http cuando pasamos id como parámetro.

* Cuando pasamos slug o title como parámetro en el GET, en el service de findOne hemos de moficiar el queryBuilder con leftJoinAndSelect.

* Creo un findOnePlain para aplanar las url.

## 144 Query Runner

* En update del servicio.

## 145 Transacciones Commit/Rollback

* En update del servicio. Mucho código con el queryRunner, es porque hay tablas con referencias.

## 154 Multer

[Enlace a Nest sobre file upload](https://docs.nestjs.com/techniques/file-upload)

```shell
nest g res files --no-spec
```

Instalar multer para tratar archivos

```shell
yarn add -D @types/multer
```

* Uso de interceptores

## 155 Validar archivo

* Creamos el helper para el interceptor de archivo

## 156 Guardar archivo en filesystem

* Añadir config al interceptor como límite, lugar donde guardar.

## 157 Renombrar archivo en filesystem

* Usa uuid

## 158 Servir archivos de manera controlada

* Usa Response de express

## 159 Expone una url pública para las imagenes

* Eso

## 166. Crear Usuario

* Eso

## 168. Encriptar contraseña

```shell
yarn add bcrypt
yarn add -D @types/bcrypt
```

## 169. Login

* eso

## 170. JWT

```shell
yarn add @nestjs/passport passport
yarn add @nestjs/jwt passport-jwt
yarn add -D @types/passport-jwt
```

## 171. Configuración asincrona de JWT

* Pues eso

## 172.173. JWT Strategy

* Un lio de imports, exports, providers, injectables

## 174. Generar jwt

* Se hace al hacer register o login

## 175. Rutas privadas

* En el controlador con guards

## 176. Cambiar email por id en jwt

* fácil

## 179. Custom Guard y Custom Decorator

```shell
nest g gu auth/guards/userRole --no-spec
```

## 180. Verificar rol de usuario

* Se complica la cosa

```shell
nest g d auth/decoratos/roleProtected --no-spec
```

## 181. Custom Decorator - RoleProtected

* Con esto es facil cometer errores, ver siguiente tema.

## 182. Composition decoratos

* Crea una composición de decoradores

## 183. Comprobar usuario y rol en otros módulos

* Import, export de auth

## 203. 204. WEB SOCKETS

* Creamos el módulo

```shell
nest g res messageWs --no-spec
# > WebSockets
# > No

yarn add @nestjs/websockets @nestjs/platform-socket.io

yarn add socket.io
```

## 205. Crear cliente con vite

```shell
yarn add socket.io-client
```

## 209. Datos de cliente a server

* Sencillo con decoradores

## 210. Datsos de server a cliente

* Solo a cliente emisor, a clientes excepto emisor, a todos los cliente.
