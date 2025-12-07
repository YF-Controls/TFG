# Docker

```shell
# borra todo
docker system prune -f

# crear los contenedores y si cierras
# la termina no se paran
docker compose up -d
# --con build reconstruye todo si has cambiado el código del proyecto
docker compose up -d --build

# borrar
docker compose down
```
