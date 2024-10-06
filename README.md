<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

#ejecutar en desarrollo
1. clonar el repositorio
2. ejecutar
```
yarn install
```
3. tener nest cli instalado
```
nest i -g @nestjs/cli
```
4. levantar la base de datos
```
docker-compose up -d
```
5. clonar el archivo __.env.template__ y renombrar la copia __.env__
6. llenar las variables de entorno definidas en el __.env__
7. ejecutar la aplicación en dev:
```
yarn start:dev
```
8. reconstruir la base de datos con seed
```
http://localhost:3000/api/v2/seed
```
## Stack usado
* MongoDB
* Nest
