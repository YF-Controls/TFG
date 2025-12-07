# Docker

```shell
# Acceso a NAS con putty

# Ir al usuario root
sudo -i

# borra todo
docker system prune -f

# crear los contenedores y si cierras
# la termina no se paran
docker compose up -d
# --con build reconstruye todo si has cambiado el código del proyecto
docker compose up -d --build

# borrar
docker compose down

# se puede levantar o para un solo contenedor
docker compose up container-name -d --build
docker compose down container-name
```
