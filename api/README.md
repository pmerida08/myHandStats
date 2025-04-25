# API
## Funcionalidades de la API
### Usuarios
| **Funcionalidad**         | **Método** | **Endpoint**               |**Acceso**   |
|---------------------------|------------|----------------------------|-------------|
| Registro de Usuarios      | POST       | /register/                 |Publico      |
| Inicio de Sesión          | POST       | /login/                    |Publico      |
| Actualizar Usuario        | PUT        | /usuarios/                 |Privado      |
| Listar Usuario por email  | GET        | /usuarios/                 |Privado      |

### Equipos
| **Funcionalidad**                   | **Método** | **Endpoint**               |**Acceso**   |
|-------------------------------------|------------|----------------------------|-------------|
| Creación de equipos                 | POST       | /equipos/                  |Privado      |
| Listado de equipos de usuario       | GET        | /equipos/                  |Privado      |
| Listado de equipo de usaurio por id | GET        | /equipos/{id}              |Privado      |
| Actualizar Equipo                   | PUT        | /equipos/{id}              |Privado      |
| Eliminar Equipo                     | DELETE     | /equipo/                   |Privado      |


### Jugadores
| **Funcionalidad**           | **Método** | **Endpoint**               |**Acceso**   |
|-----------------------------|------------|----------------------------|-------------|
| Creación de Jugador         | POST       | /equipos/jugador/          | Privado     |
| Listar Jugadores Equipo     | GET        | /equipos/jugador/          | Privado     |
| Listar Jugador Equipo       | GET        | /equipos/jugador/{id}      | Privado     |
| Actualizar Jugadores Equipo | PUT        | /equipos/jugador/          | Privado     |
| Actualizar Jugador Equipo   | PUT        | /equipos/jugador/{id}      | Privado     |


### Posiciones
| **Funcionalidad**           | **Método** | **Endpoint**               |**Acceso**   |
|-----------------------------|------------|----------------------------|-------------|
| Listar Posiciones           | GET        | /posiciones/               | Publico     |


### Fases Juego
| **Funcionalidad**           | **Método** | **Endpoint**               |**Acceso**   |
|-----------------------------|------------|----------------------------|-------------|
| Listar Fases Juego          | GET        | /fases_juego/              | Publico     |


### Tipos Acción
| **Funcionalidad**           | **Método** | **Endpoint**               |**Acceso**   |
|-----------------------------|------------|----------------------------|-------------|
| Listar Tipos acción         | GET        | /tipos_acción/             | Publico     |


### Tipos Lanzamientos
| **Funcionalidad**           | **Método** | **Endpoint**               |**Acceso**   |
|-----------------------------|------------|----------------------------|-------------|
| Listar Tipos Lanzamientos   | GET        | /tipos_lanazmientos/       | Publico     |


### Tipos Lanzamientos 7m
| **Funcionalidad**             | **Método** | **Endpoint**               |**Acceso**   |
|-------------------------------|------------|----------------------------|-------------|
| Listar Tipos Lanzamientos 7m  | GET        | /tipos_acción_7m           | Publico     |


### Tipos Perdida
| **Funcionalidad**             | **Método** | **Endpoint**               |**Acceso**   |
|-------------------------------|------------|----------------------------|-------------|
| Listar Tipos Perdidas Balon   | GET        | /perdidas/                 | Publico     |


### Zonas Lanzamiento
| **Funcionalidad**             | **Método** | **Endpoint**               |**Acceso**   |
|-------------------------------|------------|----------------------------|-------------|
| Listar Zonas Lanzamiento      | GET        | /zonas_lanzamientos/       | Publico     |


### Acciones Partido
| **Funcionalidad**             | **Método** | **Endpoint**               |**Acceso**   |
|-------------------------------|------------|----------------------------|-------------|
| Añadir Acción                 | POST       | /acciones_partido/         | Privado     |
| Listar Acciones por equipo    | GET        | /equipos/acciones_partido  | Privado     |
| Listar Acciones por Partido   | GET        | /acciones_partido/         | Privado     |
| Listar Acción                 | GET        | /acciones_partido/{id}     | Privado     |
| Actulizar Acción              | PUT        | /acciones_partido/{id}     | Privado     |
| Eliminar Acción Partido       | DELETE     | /acción_partido/{id}       | Privado     |
