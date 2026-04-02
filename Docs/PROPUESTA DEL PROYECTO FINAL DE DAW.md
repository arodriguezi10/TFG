# PROPUESTA DEL PROYECTO FINAL DE DAW

Estado: EN PROGRESO
Fecha: 15 de octubre de 2025

1. **IDENTIFICACIÓN DEL PROYECTO:**

**CICLO FORMATIVO:**  Desarrollo de Aplicaciones Web (DAW)

**TÍTULO DEL PROYECTO:** FYLIOS

**DESCRIPCIÓN GENERAL:**

El proyecto consiste en el desarrollo de una aplicación web orientada a la planificación, gestión y seguimiento de la actividad deportiva de los usuarios.

La plataforma permitirá registrar y analizar entrenamientos de diferentes disciplinas, -como gimnasio, natación, bicicleta estática o cinta- de una forma sencilla además de visual.

El usuario podrá crear sus propias rutinas de ejercicios, registrar sus progresos, controlar su evolución mediante gráficas y llevar un seguimiento básico de su dieta y peso corporal.

Además, se incluirá la posibilidad de establecer una relación entre deportista y entrenador personal, de modo que el entrenador pueda asignar rutinas, revisar avances y mantener una comunicación directa y centralizada con el deportista a través de un sistema de mensajería interna.

**ALUMNO:**  Alejandro Rodríguez Iglesias

**TELÉFONO:** +34 675 43 28 41                        **E-MAIL:** arodriguezi10@educarex.es

**Fecha presentación:**

---

1. **OBJETIVO:**

Se busca ofrecer una herramienta digital práctica y atractiva que ayude a mejorar la organización, el control y la motivación del usuario en su progreso deportivo. El objetivo es diseñar y desarrollar una aplicación web interactiva que permita planificar, registrar y analizar la actividad física del usuario, ofreciendo una experiencia intuitiva, completa y adaptable a diferentes niveles (principiante, intermedio y avanzado).

Entre los objetivos específicos se incluyen:

- Facilitar la **creación y gestión de rutinas personalizadas** para distintos tipos de entrenamiento.
- Garantizar el registro de sesiones en entornos de baja conectividad (gimnasios, sótanos, étc) mediante persistencia de datos local.
- Permitir el **seguimiento de sesiones deportivas** con registro de pesos, repeticiones, sensaciones y duración.
- Ofrecer **gráficas de evolución** que muestren el progreso físico y la constancia del usuario.
- Implementar un **sistema básico de control de dieta y peso corporal**.
- Integrar una **funcionalidad de conexión entre deportistas y entrenadores personales,** fomentando la personalización y el acompañamiento en los entrenamientos.
- Habilitar un canal de comunicación bidireccional (mensajería) que permita al entrenador enviar feedback cualitativo y al deportista resolver dudas sin salir de la aplicación.
1. **JUSTIFICACIÓN:**

La práctica deportiva es cada vez más común, pero muchas personas tienen dificultades para **organizar, planificar y hacer un seguimiento efectivo** de sus progresos, lo cual genera un abandono por falta de motivación y cambios.

En muchos casos, el uso de cuadernos, hojas de cálculo o aplicaciones genéricas supone una gestión poco práctica y dispersa.

Para ello, esta aplicación web su desarrollo mediante la creación de un sistema de "Plantillas Sincronizables" que elimina la fricción de la carga constante de páginas, permitiendo un uso fluido desde el smartphone

Este proyecto busca cubrir esa necesidad mediante una solución web centralizada, intuitiva y adaptable, que permita al usuario **llevar un control completo de su entrenamiento y evolución** sin perder tiempo en tareas repetitivas o confusas.

Además, al incorporar la figura del entrenador personal(opcional), se promueve una relación digital fluida entre profesional y deportista, facilitando el trabajo remoto y la personalización del entrenamiento.

Desde el punto de vista técnico, el proyecto permite aplicar de forma práctica los conocimientos adquiridos en el ciclo de DAW —desarrollo backend, frontend, bases de datos, interactividad y diseño responsivo—, dando lugar a una aplicación moderna, funcional y escalable.

1. **ASPECTOS PRINCIPALES QUE SE PRETENDEN ABORDAR:**
- Gestión de usuarios con diferentes roles (deportista y entrenador).
- Planificación y creación de rutinas de entrenamiento, con ejercicios, series, repeticiones, peso y observaciones.
- Registro de sesiones deportivas y almacenamiento de resultados individuales, mediante almacenamiento local y sincronización posterior por lotes (Batch Processing)
- Visualización de estadísticas y evolución mediante gráficas dinámicas.
- Control básico de alimentación y peso corporal.
- Implementación de un módulo de mensajería asíncrona para la gestión del feedback y consultas entre entrenador y deportista.
- Diseño adaptable (responsive) y enfoque en la usabilidad.
- Implementación de una arquitectura moderna basada en cliente–servidor, con API REST y base de datos relacional o documental.
1. **MEDIOS QUE SE UTILIZAN:**

| CATEGORÍA | TECNOLOGÍAS | JUSTIFICACIÓN |
| --- | --- | --- |
| 
 
Desarrollo Frontend | HTML5, CSS3, JavaScript | Base para la interfaz del usuario. El framework me permitirá crear una SPA moderna, interactiva y con un diseño adaptable para su uso |
|  | Frameworks: React o Angular |  |
|  | Estilos: Tailwind CSS |  |
| 
 
Desarrollo
Backend | Lenguaje: PHP(con Laravel/Symfony) o Jav(con Spring Boot) | Creación de la lógica de negocio, gestión de las peticiones del cliente y comunicación con la base de datos y la API RESTful para garantizar un comunicación eficiente y escalable. |
|  | Arquitectura: API RESTful |  |
| 
Base de datos | 
SGBD: MySQL Workbench y MySql Server | Almacenamiento de la información (usuarios, rutinas, ejercicios, registros de entrenamientos, datos de peso, étc) |
|  | Docker  | Se usará para la gestión de la base de datos. Esta tecnología de contenedorización permitirá virtualizar una instancias de MySQL 8.0 de forma aislada, garantizado que el entorno de desarrollo sea limpio, portable y no interfiera en la configuración del sistema operativo. MySQL Workbench se conectará a este contenedor para realizar las tareas de diseño y administración |
| 
Herramientas de Desarrollo | IDE: Visual Studio Code | Entorno de desarrollo para la codificación y depuración y Git, fundamental para el control y la colaboración en el código del proyecto. |
|  | Control de versiones: Git y GitHub |  |
| Diseño y maquetación | Figma (para el prototipado y diseño de la interfaz) | Creación de wireframes y prototipos de alta fidelidad para asegurar la usabilidad y la experiencia de usuario (UX/UI). |
|  |  |  |
1. **ÁREAS DE TRABAJO Y OTROS ELEMENTOS ESTABLECIDOS POR EL EQUIPO DOCENTE DEL CICLO FORMATIVO A EFECTOS DE VALORACIÓN DE LA PROPUESTA:**
- Programación y lógica de negocio:
- Desarrollo del Backend: implementación de toda la lógica de negocio (creación de rutinas, registro de sesiones, cálculo de progreso, gestión de la conexión entrenador-deportista).
- Diseño e Implementación de la API REST: Creación de endpoints seguros para la comunicación entre el frontend y el backend, incluyendo autenticación y autorización de usuarios con diferentes roles (deportista/entrenador).
- Bases de Datos y Gestión de Datos:
- Diseño de la Base de Datos: Creación de un modelo relacional o documental eficiente que soporte la estructura de la aplicación (usuarios, ejercicios, rutinas, registros, datos de evolución, dietas).
- Implementación de Consultas: Uso de lenguajes de consulta (SQL o NoSQL) para recuperar, insertar, actualizar y eliminar datos de manera óptima.
- Desarrollo de Interfaces Web (Frontend):
- Diseño Web Responsivo (Responsive Design): Uso de CSS media queries o frameworks de grid para asegurar que la aplicación se vea y funcione correctamente en cualquier dispositivo (móvil, tablet, escritorio).
- Usabilidad (UX/UI): Enfoque en una interfaz intuitiva y atractiva, especialmente para la visualización de datos de progreso (gráficas dinámicas).
- Interactividad: Implementación de gráficas dinámicas (p. ej., con Chart.js o D3.js) y formularios interactivos para el registro ágil de entrenamientos.
- Sistemas Informáticos y Despliegue:
- Control de Versiones: Uso de Git para la gestión y seguimiento de los cambios en el código.
- Despliegue: Configuración del entorno de producción y despliegue final de la aplicación (p. ej., utilizando contenedores Docker o servicios PaaS/IaaS).
- Seguridad y Mantenimiento:
- Autenticación y Autorización: Implementación de mecanismos seguros (como JWT) para la gestión de sesiones y roles de usuario.
- Validación de Datos: Asegurar la integridad de los datos de entrada (inputs) tanto en el cliente como en el servidor para prevenir vulnerabilidades.