# Rutas de Usuarios

Este documento proporciona una breve explicación del uso de las rutas, consultas (queries) y el cuerpo de las solicitudes (body) para el equipo de Frontend.

## Definición de Rutas

Las rutas para gestionar las solicitudes relacionadas con los usuarios están definidas utilizando Express Router. A continuación se presentan las rutas y sus métodos asociados.

## USUARIOS

### `GET "/"`

Ruta para obtener todos los usuarios.

#### Query Parameters (opcional)

- `search`: Filtra usuarios por username o email.

#### Ejemplo de Uso

```http
GET /users ---> Obtiene todos los usuarios
GET /users?search=John ---> Obtiene los usuarios por busqueda de username y email
```

### `GET "/:id"`

Ruta para obtener el usuario por id.

#### Params

- `:id`: por id del usuario

#### Ejemplo de Uso

```http
GET /users/:id ---> Obtiene el usuario por id
```

### `GET "/profile`

Ruta para obtener información del perfil personal.

#### Ejemplo de uso

```http
GET /users/profile ---> información del perfil personal
```

## Projects

### `GET "/"`

Ruta para obtener todos los proyectos.

#### Query Parameters (opcional)

- `search`: Filtra proyectos por title y tags.
- `technologies`: Filtro combinado por technologies (ejemplo, React, Django, Java, etc.)

#### Ejemplo de Uso

```http
GET /projects ---> Obtiene todos los proyectos

GET /projects?search=projTag ---> Obtiene los proyectos por busqueda de title y tags

GET /projects?search=projTag&technologies=Django,React ---> Obtiene los proyectos por búsqueda de title y tags, y además por filtra por al menos una de las tecnologías indicadas
```

### `GET "/:id"`

Ruta para obtener el proyecto por id.

#### Params

- `:id`: por id del proyecto

#### Ejemplo de Uso

```http
GET /projects/:id ---> Obtiene el proyecto por id
```

### `POST "/"`

Ruta para crear proyectos.

#### Body

Se debe enviar el modelo de usuario con los siguientes datos:

- userName
- email
- password
- bio (opcional)
- image (url y opcional)

#### Ejemplo de Uso

```http
POST /signup ---> Crea un nuevo usuario

Body (JSON):
{
    "userName": "miUsuario1",
    "email": "usuario.2000@mail.com",
    "password": "securePassword!"
}
```
