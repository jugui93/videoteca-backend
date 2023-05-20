# videoteca-backend
Este repositorio contiene el código fuente del backend para una aplicación de gestión de vídeos.El backend está desarrollado en Node.js y utiliza el framework Express.js para la creación de la API. Proporciona endpoints para el manejo de usuarios, autenticación, CRUD de vídeos, búsqueda y otras funcionalidades relacionadas con la gestión de vídeos.
## Características principales:
* Sistema de autenticación basado en tokens JWT (JSON Web Tokens) para proteger las rutas sensibles.
* Modelo de datos y base de datos PostgreSQL para almacenar información de usuarios y vídeos.
* Endpoints para realizar operaciones CRUD en usuarios y vídeos.
* Funcionalidades para obtener vídeos por usuario, obtener vídeos públicos o privados, y obtener vídeos mejor calificados.
* Mecanismo de validación de datos de entrada en las solicitudes a los endpoints.
Utilización de middlewares para la autenticación, manejo de errores y otras funcionalidades.
* Pruebas unitarias implementadas utilizando la biblioteca de pruebas Mocha.
* Documentación de la API utilizando Swagger para facilitar su comprensión y uso.

Este repositorio se estructura en directorios siguiendo una arquitectura modular, con controladores, modelos, rutas y servicios claramente separados. También se utiliza un sistema de gestión de paquetes, como npm o Yarn, para administrar las dependencias del proyecto.

Si estás interesado en contribuir al proyecto o utilizar el backend para tu propia aplicación de gestión de vídeos, siéntete libre de clonar este repositorio y explorar el código fuente. También te animamos a abrir problemas (issues) para reportar errores, sugerir mejoras o hacer preguntas relacionadas con el proyecto.
