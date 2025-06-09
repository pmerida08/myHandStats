# API

## Endpoints y funcionalidades

### Autenticación y Usuarios

| **Funcionalidad**     | **Método** | **Endpoint**                 | **Acceso** |
| --------------------- | ---------- | ---------------------------- | ---------- |
| Login                 | POST       | /login/                      | Público    |
| Login con Google      | POST       | /login/google                | Público    |
| Crear Usuario         | POST       | /register/                   | Público    |
| Registrar con Google  | POST       | /register/google             | Público    |
| Obtener Perfil        | GET        | /usuario/perfil              | Privado    |
| Actualizar Usuario    | PUT        | /usuario/{id}                | Privado    |
| Establecer Contraseña | POST       | /auth/establecer-contrasena/ | Privado    |

### Club

| **Funcionalidad**            | **Método** | **Endpoint**                     | **Acceso** |
| ---------------------------- | ---------- | -------------------------------- | ---------- |
| Obtener Info Club            | GET        | /club/                           | Privado    |
| Actualizar Club              | PUT        | /club/                           | Privado    |
| Obtener Usuarios Club        | GET        | /club/usuarios/                  | Privado    |
| Obtener Equipos Club         | GET        | /club/equipos/                   | Privado    |
| Obtener Entrenadores Club    | GET        | /club/entrenadores/              | Privado    |
| Obtener Entrenador por Id    | GET        | /club/entrenador/{entrenador_id} | Privado    |
| Crear Nuevo Equipo Club      | POST       | /club/nuevo_equipo/              | Privado    |
| Registrar Nuevo Usuario Club | POST       | /club/usuario/register           | Privado    |
| Crear Usuario por Admin      | POST       | /club/crear-por-admin            | Privado    |
| Actualizar Equipo            | PUT        | /club/equipo/{equipo_id}         | Privado    |
| Actualizar Usuario Club      | PUT        | /club/usuario/{usuario_id}       | Privado    |
| Eliminar Usuario Club        | DELETE     | /club/usuario/{usuario_id}       | Privado    |
| Eliminar Club                | DELETE     | /club/{id}                       | Privado    |

### Equipos

| **Funcionalidad**                 | **Método** | **Endpoint**                                                                  | **Acceso** |
| --------------------------------- | ---------- | ----------------------------------------------------------------------------- | ---------- |
| Obtener Equipos Club              | GET        | /equipo/                                                                      | Privado    |
| Obtener Equipo                    | GET        | /equipo/{equipo_id}                                                           | Privado    |
| Obtener Entrenadores Equipo       | GET        | /equipo/{equipo_id}/entrenadores/                                             | Privado    |
| Obtener Entrenador Equipo         | GET        | /equipo/{equipo_id}/entrenador/{entrenador_id}                                | Privado    |
| Actualizar Entrenador             | PUT        | /equipo/{equipo_id}/entrenador/{entrenador_id}                                | Privado    |
| Obtener Jugadores Equipo          | GET        | /equipo/{equipo_id}/jugadores/                                                | Privado    |
| Obtener Jugador Equipo            | GET        | /equipo/{equipo_id}/jugador/{jugador_id}                                      | Privado    |
| Obtener Partido Equipo            | GET        | /equipo/{equipo_id}/partido/{partido_id}                                      | Privado    |
| Actualizar Partido Equipo         | PUT        | /equipo/{equipo_id}/partido/{partido_id}                                      | Privado    |
| Eliminar Partido Equipo           | DELETE     | /equipo/{equipo_id}/partido/{partido_id}                                      | Privado    |
| Obtener Partidos Equipo           | GET        | /equipo/{equipo_id}/partidos/                                                 | Privado    |
| Obtener Jugadores Partido Equipo  | GET        | /equipo/{equipo_id}/partido/{partido_id}/jugadores_partido/                   | Privado    |
| Obtener Jugador Partido Equipo    | GET        | /equipo/{equipo_id}/partido/{partido_id}/jugador_partido/{jugador_partido_id} | Privado    |
| Actualizar Jugador Partido Equipo | PUT        | /equipo/{equipo_id}/partido/{partido_id}/jugador_partido/{jugador_partido_id} | Privado    |
| Obtener Partidos Jugador Equipo   | GET        | /equipo/{equipo_id}/jugador/{jugador_id}/partidos/                            | Privado    |
| Obtener Acciones Partido Equipo   | GET        | /equipo/{equipo_id}/partido/{partido_id}/acciones_partido/                    | Privado    |
| Obtener Accion Partido Equipo     | GET        | /equipo/{equipo_id}/partido/{partido_id}/accion_partido/{accion_partido_id}   | Privado    |
| Obtener Jugadores Partidos Equipo | GET        | /equipo/{equipo_id}/jugadores_partidos/                                       | Privado    |
| Obtener Entrenadores Equipo       | GET        | /equipo/{equipo_id}/entrenadores_equipo/                                      | Privado    |
| Crear Partido                     | POST       | /equipo/{id_equipo}/partido/                                                  | Privado    |
| Crear Jugador Equipo              | POST       | /equipo/{id_equipo}/jugador/                                                  | Privado    |
| Crear Entrenador                  | POST       | /equipo/{equipo_id}/entrenador/                                               | Privado    |
| Crear Jugador Partido Equipo      | POST       | /equipo/{equipo_id}/partido/{partido_id}/jugador_partido/                     | Privado    |
| Crear Equipo Entrenador           | POST       | /equipo/equipo_entrenador/{equipo_id}                                         | Privado    |
| Eliminar Entrenador Equipo        | DELETE     | /equipo/{equipo_id}/entrenador_equipo/{entrenador_id}                         | Privado    |
| Actualizar Jugador                | PUT        | /equipo/{equipo_id}/jugador/{id}                                              | Privado    |
| Actualizar Posición Jugador       | PUT        | /equipo/{equipo_id}/jugador/{jugador_id}/posicion                             | Privado    |

### Jugadores-Posiciones

| **Funcionalidad**           | **Método** | **Endpoint**                       | **Acceso** |
| --------------------------- | ---------- | ---------------------------------- | ---------- |
| Get Jugador Posición        | GET        | /jugadores_posiciones/             | Privado    |
| Crear Jugador Posición      | POST       | /jugadores_posiciones/             | Privado    |
| Obtener Jugador Posición    | GET        | /jugadores_posiciones/{jugador_id} | Privado    |
| Eliminar Jugador Posición   | DELETE     | /jugadores_posiciones/{jugador_id} | Privado    |
| Actualizar Jugador Posición | PUT        | /jugadores_posiciones/{jugador_id} | Privado    |

### Posiciones

| **Funcionalidad** | **Método** | **Endpoint** | **Acceso** |
| ----------------- | ---------- | ------------ | ---------- |
| Listar Posiciones | GET        | /posiciones/ | Público    |

### Fases Juego

| **Funcionalidad**  | **Método** | **Endpoint**  | **Acceso** |
| ------------------ | ---------- | ------------- | ---------- |
| Listar Fases Juego | GET        | /fases_juego/ | Público    |

### Acciones Partido

| **Funcionalidad**     | **Método** | **Endpoint**         | **Acceso** |
| --------------------- | ---------- | -------------------- | ---------- |
| Get Acciones Partidos | GET        | /accion_partido/     | Privado    |
| Crear Acción Partido  | POST       | /accion_partido/     | Privado    |
| Update Acción Partido | PUT        | /accion_partido/{id} | Privado    |
| Delete Acción Partido | DELETE     | /accion_partido/{id} | Privado    |

### Accion Fases

| **Funcionalidad**      | **Método** | **Endpoint**       | **Acceso** |
| ---------------------- | ---------- | ------------------ | ---------- |
| Get Accion Fases       | GET        | /accion_fases/     | Privado    |
| Crear Accion Fase      | POST       | /accion_fases/     | Privado    |
| Obtener Accion Fase    | GET        | /accion_fases/{id} | Privado    |
| Eliminar Accion Fase   | DELETE     | /accion_fases/{id} | Privado    |
| Actualizar Accion Fase | PUT        | /accion_fases/{id} | Privado    |

### Entrenadores

| **Funcionalidad**            | **Método** | **Endpoint**                  | **Acceso** |
| ---------------------------- | ---------- | ----------------------------- | ---------- |
| Eliminar Entrenador          | DELETE     | /entrenadores/{entrenador_id} | Privado    |
| Actualizar Entrenador        | PUT        | /entrenadores/{id}            | Privado    |
| Crear Equipo Entrenador      | POST       | /equipos_entrenadores/        | Privado    |
| Obtener Equipo Entrenador    | GET        | /equipos_entrenadores/{id}    | Privado    |
| Actualizar Equipo Entrenador | PUT        | /equipos_entrenadores/{id}    | Privado    |

### Acciones

| **Funcionalidad**         | **Método** | **Endpoint**      | **Acceso** |
| ------------------------- | ---------- | ----------------- | ---------- |
| Obtener Acciones          | GET        | /acciones/        | Público    |
| Filtrar Acciones por Tipo | GET        | /acciones/filtrar | Público    |
