# Docker

## Comandos para levantar/eliminar un contenedor o gruopo de ellos

```shell
# Acceso a NAS con putty

# Ir al usuario root
sudo -i

# Ir a la ruta del proyecto
cd /volume1/ruta/del/proyecto

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

## Comandos para crear carpetas y modificar sus permisos

```shell
# Crear el directorio si no existe
mkdir -p /volume1/ruta/carpeta

# Dar permisos al usuario postgres (UID 999 en el contenedor)
chown -R 999:999 /volume1/ruta/carpeta

# O dar permisos completos (menos seguro pero más simple)
chmod -R 777 /volume1/ruta/carpeta
```

## Otros de docker

```shell
# Ver solo los que están corriendo
docker compose ps

# Ver todos los contenedores (corriendo y detenidos)
docker compose ps -a

# Ver los logs de un contenedor: las últimas 50 líneas
docker compose logs nombre-del-contenedor --tail=50

# Ver los logs en tiempo real
docker compose logs nombre-del-contenedor -f

# Combinar: últimas 50 líneas + seguir en tiempo real
docker compose logs backend --tail=50 -f
```
