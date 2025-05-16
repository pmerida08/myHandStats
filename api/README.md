# API

## Funcionalidades de la API

### Usuarios

| **Funcionalidad**        | **Método** | **Endpoint**       | **Acceso** |
| ------------------------ | ---------- | ------------------ | ---------- |
| Registro de Usuarios     | POST       | /register/         | Publico    |
| Inicio de Sesión         | POST       | /login/            | Publico    |
| Actualizar Usuario       | PUT        | /usuario/          | Privado    |
| Listar Usuario por JWT   | GET        | /usuario/perfil/   | Privado    |


### Entrenadores

| **Funcionalidad**          | **Método** | **Endpoint**          | **Acceso** |
| -------------------------- | ---------- | --------------------- | ---------- |
| Registro de entrenador     | POST       | /entrenador/register/ | Privado    |
| Listar entrenador          | GET        | /entrenador/{id}      | Privado    |
| Listar entrenadores club   | GET        | /club/entrenadores/   | Privado    |
| Listar entrenadores equipo | GET        | /equipo/entrenadores  | Privado    |
| Actualizar entrenador      | PUT        | /entrenador/{id}      | Privado    |
| Eliminar entrenador        | DELETE     | /entrenador/{id}      | Privado    |

### Club

| **Funcionalidad**       | **Método** | **Endpoint**           | **Acceso** |
| ----------------------- | ---------- | ---------------------- | ---------- |
| Listar club             | GET        | /club/{id}             | Privado    |
| Actualizar Club         | PUT        | /club/{id}             | Privado    |
| Eliminar club           | DELETE     | /club/{id}             | Privado    |
| Listado usuarios club   | GET        | /club/usuarios/        | Privado    |
| Eliminar Usuario por id | DELETE     | /club/usuario/{id}     | Privado    |
| Crear nuevo Usuario     | POST       | /club/usuario/register | Privado    |

### Equipos

| **Funcionalidad**           | **Método** | **Endpoint**          | **Acceso** |
| --------------------------- | ---------- | --------------------- | ---------- |
| Creación de equipo          | POST       | /club/nuevo_equipo/   | Privado    |
| Listado de equipos del club | GET        | /club/equipos/        | Privado    |
| Listado de equipo por id    | GET        | /equipo/{id}          | Privado    |
| Actualizar Equipo           | PUT        | /club/equipos/{id}    | Privado    |
| Eliminar Equipo             | DELETE     | /club/equipo/{id}     | Privado    |

### Jugadores

| **Funcionalidad**         | **Método** | **Endpoint**         | **Acceso** |
| ------------------------- | ---------- | -------------------- | ---------- |
| Creación de Jugador       | POST       | /equipo/jugador/     | Privado    |
| Listar Jugadores Equipo   | GET        | /equipo/jugadores/   | Privado    |
| Listar Jugador Equipo     | GET        | /equipo/jugador/{id} | Privado    |
| Actualizar Jugador Equipo | PUT        | /equipo/jugador/{id} | Privado    |
| Eliminar Jugador Equipo   | DELETE     | /equipo/jugador/{id} | Privado    |

### Posiciones

| **Funcionalidad** | **Método** | **Endpoint** | **Acceso** |
| ----------------- | ---------- | ------------ | ---------- |
| Listar Posiciones | GET        | /posiciones/ | Publico    |

### Fases Juego

| **Funcionalidad**  | **Método** | **Endpoint**  | **Acceso** |
| ------------------ | ---------- | ------------- | ---------- |
| Listar Fases Juego | GET        | /fases_juego/ | Publico    |

### Acciones Partido

| **Funcionalidad**           | **Método** | **Endpoint**                          | **Acceso** |
| --------------------------- | ---------- | ------------------------------------- | ---------- |
| Añadir Acción               | POST       | /equipo/accion_partido/               | Privado    |
| Listar Acciones por equipo  | GET        | /equipo/acciones_partido              | Privado    |
| Listar Acciones por Partido | GET        | /equipo/acciones_partido/{id_partido} | Privado    |
| Listar Acción               | GET        | /equipo/accion_partido/{id}           | Privado    |
| Actualizar Acción           | PUT        | /equipo/accion_partido/{id}           | Privado    |
| Eliminar Acción Partido     | DELETE     | /equipo/accion_partido/{id}           | Privado    |


### Jugadores-Partido
| **Funcionalidad**           | **Método** | **Endpoint**                          | **Acceso** |
| --------------------------- | ---------- | ------------------------------------- | ---------- |
| Añadir Jugador Partido      | POST       | /equipo/jugador_partido/               | Privado    |


### Acciones

| **Funcionalidad**   | **Método** | **Endpoint**                   | **Acceso** |
| ------------------- | ---------- | ------------------------------ | ---------- |
| Listar Tipos acción | GET        | /acciones/                     | Publico    |
| Filtrar acción      | GET        | /acciones/filtrar?tipo_accion= | Publico    |
