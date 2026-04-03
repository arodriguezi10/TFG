# CONTROL DEL DESARROLLO DEL PROYECTO

Estado: EN PROGRESO
Fecha: 18 de enero de 2026

Voy a definir los pasos a seguir para realizar el proyecto (todo está abierto a posibles cambios durante su desarrollo)

Los pasos a seguir van a ser los siguientes:

1. Análisis y definición del proyecto.
    
    Definir las funcionalidades que se implementaran y las que no para la primera versión.
    
    Identificar los posibles tipos de usuarios.
    
    Documentar los requisitos fundamentales y no fundamentales.
    
2. Diseños de la Base de datos.
    
    Definir las entidades: usuarios, rutinas, ejercicios, sesiones de entrenamiento, progresiones, étc.
    
    Crear diagrama entidad-relación.
    
3. Arquitectura de la aplicación.
    
    Tecnologías en backend: Node.js, JAVA, PHP
    
    Planifica la estructura de la API REST
    
    Plataforma donde alojar la app.
    
    Diseño UI/UX en Figma
    
    Wireframes (bocetos básicos)
    
    Mockups de alta fidelidad.
    
    Prototipo interactivo.
    
    Incluir tanto versión escritorio como móvil.
    
4. Desarrollo fronted.
    
    Estructura HTML
    
    Estilo CSS (posible uso de Tailwind o Bootstrap)
    
    JavaScript para la interactividad.
    
    Integración con la API.
    
5. Desarrollo del backend
    
    API REST
    
    Base de datos
    
    Sistema autenticación.
    
    Lógica de negocio.
    
6. Testing y corrección de errores.
7. Documentación del proyecto.
8. Despliegue

**NOTA:** puedo ****hacer el diseño del logo en cualquier otro momento, ahora mismo no es imprescindible.

**¿WEB O MÓVIL?**

La idea inicial es hacer una Progressive Web App (PWA). ¿Qué es una PWA?:

Es una aplicación web que se comporta como una app nativa. Desarrollas una sola vez y funciona en el navegador del ordenador, en el navegador del móvil y se puede “instalar” en el móvil como si fuera una app.

Las ventajas que me va aportar van aportar a la hora de hacer el proyecto es que solo voy ha desarrollar un único código que se va adaptar a diferentes pantallas (diseño responsive), no será necesario desarrollar para apps separadas para Android/IOS. Se actualiza automáticamente y es más fácil de mantener.

Enfoque técnico y tecnologías recomendadas:

Lo voy a diseñar primero para pantallas grandes y después para móvil. Algunas de las tecnologías que usaré son para fronted: React o Angular, backend: Node.js + Laravel (PHP), base de datos: MySQL y para estilos: Tailwind CSS o boostrap.

**IDEAS PARA LAS FUNCIONALIDADES (TODO VAN A SER IDEAS, NO SIGNIFICA QUE VAYA A INTRODUCIR TODAS LAS IDEAS)**

Para usuarios principales puedo añadir rutinas predefinidas por nivel y objetivos, también pudo añadir videos explicativos de los ejercicios. Algunos tutoriales iniciales, un calendario visual de los entrenamientos y recordatorios a modo de notificaciones.

Para los usuarios con experiencia, quiero añadir una la posibilidad de crear rutinas personalizadas, registros de peso, repeticiones, reps in recámera, gráficos de progresión, historial detallado, exportar datos a PDF y notas por ejercicio o sesión.

Como funciones comunes, debo añadir un sistema de inicio de sesión y registro, tanto para la primera vez que se inicia la aplicación, como para cuando ya estas dentro de está. Además, aparte de los entrenamientos de gimnasio, quiero añadir cardio, piscina, entrenamientos y rutinas híbridas, étc. Temporizadores de descanso. También un modo offline para registrar en el gimnasio sin conexión.

## **VIERNES 16 DE ENERO DE 2026 - DOMINGO 18 DE ENERO DE 2026**

En esto días he creado en la aplicación de Notion una carpeta, con la que voy a llevar todo el seguimiento del proyecto. Primero he creado un cronograma donde he definido el tiempo aproximado en el que que quiero llevar cada una de las fases del proyecto. 

También he creado un tablero de prioridad el cual me indica que tarea he de hacer primero según un orden de importancia, algo parecido es el tablero de estado que me indica  en que punto está cada fase del proyecto: sin empezar, en progreso o en curso.

Por último, he apuntado en la pizarra la primera fase: Análisis y definición del proyecto, para poder completar la terea en las dos próximas semanas (19 enero - 1 febrero)

## **LUNES 19 DE ENERO DE 2026**

Hoy he comenzado por la primera fase: la de análisis y definición del proyecto. He añadido un grupo de funciones las cuales las he organizado en funciones principales que tendrá la aplicación, las funciones de dominio y algunas funciones adicionales. He estado redactando cada una de las funciones y me he quedado por la función de gestión de errores y notificaciones, que pertenece a las funciones principales.

## **MARTES 20 DE ENERO DE 2026**

Hoy he continuado con la fase 1. He terminado de completar las funciones principales y he empezado por las funciones del dominio, donde lo último que he hecho, a sido, redactar las acciones de gestión de rutinas y planificación.

## **MIÉRCOLES 21 DE ENERO DE 2026**

He terminado de completar la fase de definición del proyecto. En los próximos días estudiaré y apuntaré más cosas acerca de como implementar todas funciones que he definido, es decir, mirar que tecnologías voy a usar, que lenguajes, que tarea puede ser la más difícil, étc.

## **JUEVES 22 DE ENERO DE 2026**

Hoy he continuado con la fase de análisis y definición del proyecto. He añadido el stack tecnológico de herramientas que usaré para desarrollar las funcionalidades. También, aparte de definir que hará la aplicación, también hay que explicar el cómo, por lo que hoy he estado buscado información sobre cómo se desarrollará.

## **VIERNES 23 DE ENERO DE 2026**

Hoy he hecho el análisis del proyecto. He comentado acerca de como se implementarán cada una da las partes importantes.

## **SÁBADO 24 DE ENERO DE 2026 - DOMINGO 25 DE ENERO DE 2026**

He estado investigando, la manera en la que podría organizar cada una de las paginas de código que iba a usar.

## **LUNES 26 DE ENERO DE 2026**

Hoy he empezado a crear un esquema visual para organizar la parte del fronted, en concreto los archivos de javascript que usare. Esté esquema lo mejoraré y crearé los demás esquemas que vaya necesitando.

## **MARTES 27 DE ENERO DE 2026**

Hoy he reorganizado la fase 1, la de análisis y definición del proyecto: he añadido, lo que serán las fases del proyecto y la duración aproximada de cada una. También he hecho un esquema general que explica un poco de cada uno de los puntos de la pagina: fronted, diseño, backend, base de datos y las diferentes herramientas empleadas para su desarrollo. Por último, he añadido una serie de requisitos no funcionales que mejorarán la infraestructura.

## **MIÉRCOLES 28 DE ENERO DE 2026**

Una vez, terminada la fase 1: análisis y definición del proyecto (4 días antes de la fecha estimada), he empezado a buscar más información, a parte de la que ya había definido en la fase 1, a cerca de cómo voy a montar la basa de datos, por donde tengo que empezar, étc. 

Así que, he adelantado el comienzo de la fase 2: Base de datos y arquitectura, 3 días antes (29 enes - 11 feb).

## **JUEVES 29 DE ENERO DE 2026**

He empezado la fase 2: base datos y arquitectura, haciendo una ruta de seguimiento, que me facilitará el proceso.

## **LUNES 2 DE FEBRERO DE 2026**

Hoy he empezado definiendo las reglas a seguir para crear la base de datos. También he creado el modelo entidad-relación de identidad, me faltan el de entrenamiento y el de progreso, además de revisarlos.

## **MARTES 3 DE FEBRERO DE 2026**

He estado dibujando cada uno de los modelos entidad-relación, el de identidad, entrenamiento y el de progreso, además he hecho la normalización hasta alcanzar la Tercera Forma Normal (3FN), lo cual sirve para para evitar la redundancia de información y garantizar la integridad referencial del sistema.

## **MIÉRCOLES 4 DE FEBRERO DE 2026**

Hoy he estado definiendo el diccionario de datos, en el cual he creado 3 tablas divididas en los bloques de identidad, entrenamiento y progreso. De cada tabla he recogido el nombre de la tabla, el campo, el tipo de dato, las restricciones y un breve descripción.

## **JUEVES 5 DE FEBRERO DE 2026**

Hoy he creado la base de datos en MySQL, con sus tablas y sus relaciones.

## **VIERNES 6 DE FEBRERO DE 2026**

Hoy he hecho un reajuste en la ruta de seguimiento de la fase 2. Lo primero que he hecho ha sido modificar el archivo de la propuesta, añadiendo el uso de Docker en la Herramientas, también he modificado el archivo de la fase 2: BD y Arquitectura, añadiendo todos los paso nuevos en la ruta de seguimiento, relacionados con Docker. 

Finalmente he definido la ruta nueva, y he comenzado creando el repositorio en github y una carpeta local.

## **SÁBADO 7 DE FEBRERO DE 2026 - DOMINGO 8 DE FEBRERO DE 2026**

He continuado con la ruta de seguimiento de la fase 2, instalando y configurando Docker Desktop y MySQL Workbench

## **LUNES 9 DE FEBRERO DE 2026**

Hoy he he creado una serie de archivos de configuración de Docker en la carpeta local del proyecto, la cual he subido a GitHub. Además, también he conectado esta carpeta local con Docker, mediante un comando, el cual ha generado automáticamente un nuevo directorio en la carpeta del proyecto y ha creado un servidor en Docker.

## **MARTES 10 DE FEBRERO DE 2026**

Hoy configurado MySQL Workbench para que apunte a el contenedor Docker, también le  he pasado el dibujo del modelo entidad-relación, para que con la función Forward Engineering de MySQL Workbench generase la base de datos automáticamente.

## **MIÉRCOLES 11 DE FEBRERO DE 2026**

Hoy he estado haciendo las comprobaciones finales, en la base de datos

## **JUEVES  12 DE FEBRERO DE 2026**

Hoy he definido la ruta de seguimiento de la fase 3: Diseño UI/UX (Figma).

## **VIERNES 13 DE FEBRERO DE 2026**

Hoy he establecido los cimientos estructurales del sistema de diseño de FYLIOS, pasando de un lienzo en blanco a un entorno de trabajo profesional. 

Para empezar he creado la estructura de archivos en Figma en cinco páginas, además he configurado el grid (márgenes y columnas) para móviles. Por último, he definido las reglas de espaciado, para que todos los espacios y tamaños sean múltiplos de 8, facilitando así la programación.

## **SÁBADO 14 DE FEBRERO DE 2026 - DOMINGO 15 DE FEBRERO DE 2026**

Nada

## **LUNES 16 DE FEBRERO DE 2026**

Hoy he comenzado definiendo las reglas visuales inmutables (Tokens), configurando una paleta de 5 colores globales, una escala tipográfica jerarquizada y normas de bordes suavizados (8px y 16px), además de integrar la librería de iconos Phosphor.

## **MARTES 17 DE FEBRERO DE 2026**

Hoy he establecido los primeros componentes inteligentes ("Átomos"): un sistema de Botones flexible con tres variantes (Sólido, Borde y Texto) que se adapta al contenido mediante Auto Layout, y un Campo de Texto (Input) estructurado que separa la etiqueta del contenedor para mejorar la usabilidad en los formularios. Ya tenemos las piezas esenciales listas para empezar a ensamblar las tarjetas de entrenamiento en la próxima sesión.

## **MIÉRCOLES 18 DE FEBRERO DE 2026**

Hoy he diseñado el núcleo central de mi aplicación, pasando de simples elementos a crear un sistema de tarjetas de entrenamiento inteligente y adaptable. He logrado construir tres versiones de la tarjeta de ejercicio (Avanzado, Intermedio y Básico) que se ajustan perfectamente a la experiencia del usuario, integrando columnas de objetivos, autorregulación con RIR y un área de notas dinámica que crece sola al escribir mis sensaciones. Lo más importante es que ahora tengo una estructura técnica profesional, alineada al milímetro y capaz de gestionar desde una progresión básica hasta un mesociclo avanzado con total claridad visual.

## **JUEVES 19 DE FEBRERO DE 2026**

Hoy he creado una modelo de pantalla de un día de gimnasio (PUSH A), en este he añadido el título de la rutina, un cronometro, un icono de stop y un menú desplegable que muestra la tarjeta de ejercicio dependiendo del tipo de esta.

## **VIERNES 20 DE FEBRERO DE 2026 - DOMINGO 22 DE FEBRERO DE 2026**

Nada

## **LUNES 23 DE FEBRERO DE 2026**

Hoy he rediseñado la pantalla del modo entrenamiento

## **MARTES 24 DE FEBRERO DE 2026**

Hoy he creado la pantalla de creación de rutinas, donde he diseñado 3 casos: cuando no hay ningún ejercicio añadido, cuando le damos añadir ejercicio y elegimos el que queramos y cuando ya hemos elegido y configurado el ejercicio.

## **MIÉRCOLES 25 DE FEBRERO DE 2026**

Hoy he creado la pantalla de rutinas, que es donde se guardan las rutinas ya creadas.

## **JUEVES 26 DE FEBRERO DE 2026**

Hoy he terminado de crear las diferentes pantallas de las sección de rutinas, primero he hecho la pantalla de se muestra cuando no hay ninguna rutina añadida, mostrando una pantalla diciendo que no hay rutinas añadidas. También he creado la pantalla que se muestra cuando le das al botón de eliminar rutina., que en este caso sería como una confirmación de que de verdad se quiere eliminar dicha rutina.

Además, repasando un poco lo llevo haciendo durante estos dias, me he dado cuenta que faltaban los módulos de comunicación y nutrición. Para los módulos de comunicación, he creado el input de enviar el mensaje junto con el icono y un ejemplo de como serian los mensajes tanto del atleta y del entrenador. Para la nutrición he creado las tarjetas de pre y post entreno, que por defecto están diseñadas como si estuviesen inactivas/sin hacer y configuradas para que cuando se pulsen se activen y se marquen como hechas.

## **VIERNES 27 DE FEBRERO DE 2026**

Hoy he empezado la pantalla principal (dashboard), como no tenía mucha idea de como hacerlo, he empezado haciendo varios diseños a mano, hasta dar con alguno que me gustase. 

## **SÁBADO 28 DE FEBRERO DE 2026**

Hoy he traspasado el boceto que hice ayer a papel a figma. He empezado haciendo la parte del saludo, junto con el icono de usuario, y también he creado la barra de navegación.

## **DOMINGO 1 DE MARZO DE 2026**

Hoy he terminado de hacer la página del Dashboard, donde además del saludo y la barra de navegación añadidas ayer, he completado añadiendo el bloque donde te dice el entrenamiento de hoy y te permite empezarlo, la confirmación de comida, tanto el pre-entreno como el post-entreno, el bloque que permite registrar el peso y por último el bloque de la racha semanal, donde se muestra el día que es y si los demás han sido completados.

## **LUNES 2 DE MARZO DE 2026**

Lo primero que he hecho hoy a sido corregir algunas pantallas anteriores, añadiendo la barra de navegación que se me había olvidado. Después he hecho la pantalla de los mensajes tanto desde la vista de el atleta como la del entrenador. La primera pantalla que he hecho es la principal del chat, la bandeja de entrada y después he hecho la pantalla de los mensajes, simulando una conversación. Esto lo he hecho para las dos vista, la del atleta y la del entrenador.

## **MARTES 3 DE MARZO DE 2026**

Hoy he hecho las pantallas de autenticación: iniciar sesión, crear cuenta y la pantalla para cuando se nos olvida la contraseña.

## **MIÉRCOLES 4 DE MARZO DE 2026**

Lo primero que he hecho hoy a sido la pantalla Splash Screen (o también pantalla de carga), que es la primera pantalla que aparece cuando abres la aplicación. Luego lo que he hecho es modificar el bloque de mensajería y coaching, donde he añadido varias pantallas tanto al entrenado como al atleta. Para el entrenado le he añadido dos pantallas más: una pantalla con la bandeja de alumnos vacía y otra para poder añadir o invitar a un atleta. Luego, para el atleta he añadido una pantalla con la bandeja de entrenadores vacía, otra para poder vincularse con el entrenado, ambas parecidas a las añadidas a la parte del entrenador. Además, he añadido dos pantallas mas: la que se muestra al no tener ningún plan, es decir, no tener entrenador contratado y otra pantalla con los beneficios de contratar el plan premium y un botón para poder contratar el servicio.

## **JUEVES 5 DE MARZO DE 2026**

Hoy he creado las pantalla que tienen que ver con la suscripción a un entrenado personal. Estas aparecen son las que aparece después de darle al botón de “Cambiar a premium”. La primera pantalla es la de checkout, la cual consiste en una pantalla que contiene información sobre la cuota,  un formulario para añadir la tarjeta de crédito, otro formulario para añadir la dirección, un resumen de sencillo de la suscripción y el botón de confirmar el pago. La segunda pantalla es la de la confirmación de la transacción; está contiene un mensaje de confirmación, un resumen de los datos añadidos y de información relevante como la duración de la suscripción o el día de renovación, finalmente cuenta con el botón de vincular con un entrenador.

## **VIERNES 6 DE MARZO DE 2026**

No he hecho nada.

## **SÁBADO 7 DE MARZO DE 2026**

Hoy he empezado creando las pantalla del bloque de progreso, la cual cuenta con tres pantalla. Hoy he hecho la primera pantalla (CARGA), que es la inicial del bloque de progreso, esta pantalla permite ver el progreso de cargas de un ejercicio durante un tiempo, donde si quieres ver datos de mas tiempo atrás se deberá pagar el premium, ademas tambien contiene un cálculo del posible peso máximo con el que se podría hacer un repetición (RM) y de las repeticiones en recámara (RIR) que podría haber.

## **DOMINGO 8 DE MARZO DE 2026**

Hoy la segunda pantalla del bloque de progreso (VOLUMEN), esta pantalla permite ver el volumen total de las rutinas. Cuenta con un desplegable para poder elegir la rutina o conjunto de rutinas y los datos sobre ese volumen de entrenamiento, dividido por músculo.. He finalizado este bloque de progreso haciendo la última pantalla (CUERPO), que permite ver una gráfica del peso corporal, que son los datos guardados de poner todos los dias el peso en el apartado que hay en le dashboard. En esta pantalla también he puesto un pequeño “cuestionario” de sensaciones tanto para el usuario como para el entrenador.

## **LUNES 9 DE MARZO DE 2026**

Hoy cerramos oficialmente el bloque de Perfil y Gestión de Usuario. Diseñamos el dashboard principal del atleta, el formulario de ajustes de datos y la sección completa de suscripción premium, abarcando los flujos de *checkout* y confirmación. También dejamos construidos los modales superpuestos para acciones críticas, como el cierre de sesión y la cancelación del plan, estructurando una interfaz lógica y orientada a la retención.

## **MARTES 10 DE MARZO DE 2026**

Hoy nos hemos enfocado en el control de calidad visual y la puesta en marcha del prototipo interactivo. Corregimos problemas de jerarquía de capas en los modales y aplicamos *Auto Layout* anidado para integrar fluidamente la opción de cambiar la foto de perfil. Tras esto, comenzamos a enrutar la navegación principal y secundaria, lo que nos ha servido para auditar el sistema y documentar varias pantallas intermedias faltantes que diseñaremos mañana.

## **MIÉRCOLES 11 DE MARZO DE 2026**

Hoy he seguido corrigiendo la calidad visual y la mejora de las pantallas, aportándole un toque mas moderno.

## **JUEVES 12 DE MARZO DE 2026**

Hoy he seguido corrigiendo la calidad visual y la mejora de las pantallas, aportándole un toque mas moderno.

## **VIERNES 13 DE MARZO DE 2026**

Hoy he seguido corrigiendo la calidad visual y la mejora de las pantallas, aportándole un toque mas moderno.

## **SÁBADO 14 DE MARZO DE 2026**

Hoy he seguido corrigiendo la calidad visual y la mejora de las pantallas, aportándole un toque mas moderno.

## **DOMINGO 15 DE MARZO DE 2026**

Hoy he seguido corrigiendo la calidad visual y la mejora de las pantallas, aportándole un toque mas moderno.

## **LUNES 16 DE MARZO DE 2026**

Hoy he seguido corrigiendo la calidad visual y la mejora de las pantallas, aportándole un toque mas moderno.

## **MARTES 17 DE MARZO DE 2026**

Hoy he seguido corrigiendo la calidad visual y la mejora de las pantallas, aportándole un toque mas moderno.

## **MIÉRCOLES 18 DE MARZO DE 2026**