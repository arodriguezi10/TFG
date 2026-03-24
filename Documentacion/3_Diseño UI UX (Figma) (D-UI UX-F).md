# Diseño UI/UX (Figma) (D-UI/UX-F)

Estado: EN PROGRESO
Prioridad: Media
Fecha: 12 de febrero de 2026 → 11 de marzo de 2026

# RUTA DE SEGUIMIENTO:

- [x]  1. Configuración del Entorno (Setup):
    - [x]  1.1. Estructura del archivo Figma:
        - [x]  Crear las páginas esenciales (`Cover`, `Playground` , `UI Kit` , `Wireframes` y `High-Fi` ).
    - [x]  1.2. Configuración del Grid (Rejilla):
        - [x]  Definir las columnas (normalmente 4 para móvil) y los márgenes laterales (ej: 16px o 20px) para asegurar que todo esté alineado.
- [x]  2. Fundamentos del Sistema de Diseño (Design Tokens):
    - [x]  2.1. Regla de Espaciado (The 8pt Grid):
        - [x]  Establecer que todos los espacios y tamaños serán múltiplos de 8 (8, 16, 24, 32...). Esto facilita la programación posterior.
    - [x]  2.2. Paleta de Colores (Color Styles):
        - [x]  Primarios: El color principal de la marca FYLIOS.
        - [x]  Semánticos: Colores funcionales (Verde=Éxito, Rojo=Error, Amarillo=Alerta).
        - [x]  Neutros: Escala de grises para textos, fondos y bordes (importante para el Dark Mode).
    - [x]  2.3. Tipografía (Typography System):
        - [x]  Elegir una familia tipográfica (ej: Inter, Roboto) y definir una escala fija (H1, H2, Body, Caption) para no usar tamaños aleatorios.
    - [x]  2.4. Efectos y Bordes:
        - [x]  Definir el "radio" de las esquinas (¿redondeado o cuadrado?) y las sombras (para dar profundidad).
    - [x]  2.5. Iconografía:
        - [x]  Seleccionar un set de iconos (ej: Phosphor o Heroicons) para mantener consistencia visual.
- [x]  3. Biblioteca de Componentes (Atomic Design)

Creamos las piezas de LEGO con las que montaremos la app.

- [x]  3.1. Elementos Básicos (Átomos):
    - [x]  Crear el botón maestro (con sus variantes: primario, secundario, ghost), inputs de texto y selectores.
- [x]  3.2. Elementos Complejos (Moléculas):
    - [x]  Diseñar las tarjetas (Cards) de las rutinas, las filas de los ejercicios y la barra de navegación (Tab Bar).
- [x]  3.3. Módulo de Entrenamiento (Organismo):
    - [x]  Diseñar el bloque específico donde el usuario introduce Peso, Repeticiones y RPE (el corazón de la app).
- [x]  3.4. Módulo de Comunicación y Nutrición:
    - [x]  Crear las piezas visuales para el chat (burbujas de texto, barra de escritura) y los selectores rápidos para registrar los pre-entrenos y meriendas.
- [x]  4. Diseño de Pantallas (High-Fidelity UI)

Ensamblamos los componentes para crear las vistas finales.

- [x]  4.1. Flujo de Autenticación:
    - [x]  Pantalla de splash screen
    - [x]  Pantallas de Login y Registro (limpias y sencillas).
- [x]  4.2. Dashboard (Home):
    - [x]  Pantalla principal con resumen semanal y accesos rápidos.
- [x]  4.3. Gestión de Rutinas:
    - [x]  Lista de rutinas y vista de detalle (los ejercicios de ese día).
- [x]  4.4. Modo Entrenamiento (Active Workout):
    - [x]  La pantalla más crítica. Debe verse bien el cronómetro, la lista de series y los botones de acción.
- [x]  4.5. Perfil y Progreso:
    - [x]  Pantalla de usuario, tanto para el entrenado como el atleta.
    - [x]  Pantalla de progresión con gráficas simples de evolución.
- [x]  4.6. Mensajería  y Coaching:
    
    ATLETA:
    
    - [x]  Pantalla de enganche (Paywall): Donde te incita a suscribirte.
    - [x]  Pantalla de beneficios: donde se muestra el plan del servicio premium
    - [x]  Pantalla de checkout (formulario de pago): para introducir los datos
    - [x]  Pantalla de confirmación de pago
    - [x]  Pantalla de la bandeja de entrada vacía.
    - [x]  Pantalla con el modal para añadir el código del entrenador.
    - [x]  Pantallas dedicadas a la bandeja de entrada. (donde aparece el entrenador)
    - [x]  Pantalla del chat directo para el *feedback* entre alumno —> entrenador.
    
    ENTRENADOR:
    
    - [x]  Pantalla de bandeja de entrada de atletas vacía con un mensaje tipo "Aún no gestionas a ningún atleta" y un botón de añadir.
    - [x]  Pantalla para generar invitación/buscador: una pantalla o modal donde el entrenador vea su propio "Código de Entrenador" (para pasárselo a sus clientes por WhatsApp, por ejemplo) o un campo para buscar el email del atleta y mandarle una petición.
    - [x]  Pantallas dedicadas a la bandeja de entrada. (ya con los atletas)
    - [x]  Pantalla del chat directo para el *feedback* entre entrenador —> alumno .
- [ ]  5. Prototipado e Interacción

Damos vida al diseño para ver cómo se siente.

- [ ]  5.1. Conexión de Flujos:
    - [ ]  Enlazar los botones para que lleven a las pantallas correctas (Navegación).
- [ ]  5.2. Micro-interacciones:
    - [ ]  Añadir pequeños detalles (ej: que el botón cambie de color al pulsarlo o un check verde al completar una serie).

## CONFIGURACIÓN DEL ENTORNO (set up):

### ESTRUCTURA DEL ARCHIVO FIGMA:

Se ha configurado el entorno de trabajo digital creando un archivo maestro (FYLIOS - App Design) con una estructura de páginas segregada para mantener el orden durante el desarrollo:

- Cover & Playground: Espacios para identificación del proyecto y pruebas de concepto libres ("sandbox").
- UI Kit & Tokens: Repositorio centralizado de estilos y componentes. Actúa como la "fuente de la verdad" (Single Source of Truth) del sistema.
- Wireframes & High-Fi: Separación estricta entre los bocetos funcionales de baja fidelidad y el diseño visual final de alta fidelidad.

### CONFIGURACIÓN DEL GRID (REJILLA):

También se han establecido las guías visuales para asegurar la alineación de elementos en dispositivos móviles (iPhone 14/15 como base):

- Configuración: se ha configurado un sistema de 4 columnas (estándar móvil), con un margen lateral de 20px (zona segura para evitar bordes curvos) y un medianil (gutter) de 16px entre columnas.
    
    Se ha hecho así ya que esta retícula asegura que la interfaz sea visualmente equilibrada y que los contenidos se adapten correctamente a diferentes anchos de pantalla, facilitando la maquetación CSS posterior.
    

## FUNDAMENTOS DEL SISTEMA DE DISEÑO (DESING TOKENS):

### REGLA DE ESPACIADO (THE 8PT GRID):

Se ha definido la regla matemática fundamental del sistema de diseño: todos los espaciados y tamaños deben ser múltiplos de 8.

- Acción Técnica: se ha modificado las preferencias de "Nudge Amount" (Desplazamiento) en Figma, cambiando el valor de Shift + Flecha de 10px a 8px.
    
    Esto lo que hace es forzar el uso de múltiplos de 8 (8, 16, 24, 32...), eliminado las decisiones arbitrarias ("números mágicos") y preparar el diseño para un sistema de variables CSS (rem) limpio y predecible. Además reduce la carga cognitiva tanto en el diseño como en la programación.
    

### PALETA DE COLORES (COLOR STYLES):

Se ha establecido y sistematizado la identidad visual de la app. Lo primero que he hecho ha sido seleccionar 5 colores clave (Primary, Background, Surface, Text High y Text Low), los cuales he guardado como Estilos de Figma.

Al guardarlos como variables, Estilos de Figma , garantizamos la consistencia (siempre es el mismo color) y la mantenibilidad, ya que, si mañana decidimos cambiar algún color, solo editamos la variable maestra y esta se actualizará en toda la aplicación automáticamente.

### TIPOGRAFÍA (TYPOGRAPHY SYSTEM):

Se ha creado una jerarquía de textos clara para guiar la lectura del usuario. Hemos definido una escala de 4 tamaños (H1, H2, Body, Caption) usando la tipografía Inter. Además, también lo he guardado como Estilos de Figma.

Definiendo esta guía evitamos el “caos tipográfico”. Esto mejora la legibilidad y acelera el desarrollo del código, ya que cada estilo tiene su equivalencia directa en CCS/Fronted

### EFECTOS Y BORDES:

Con la aplicación de estos estilos se le ha dado “suavidad visual” a la interfaz. Para ello, hemos establecido dos reglas sagradas para las esquinas: 8px para componentes pequeños, como botones o inputs y 16px para contenedores grandes, como tarjetas.

Esto se hace, porque la consistencia de los bordes da una sensación de pulcritud y acabado premium, evitando que en la aplicación web  se mezclen botones cuadrados y redondos.

### ICONOGRAFÍA:

Para los iconos se ha integrado una librería gráfica profesional, que hemos instalado y hemos configurado el plugin: Phosphor Icons. Esta es la mejor opción porque en lugar de buscar iconos suelto en internet con diferentes estilos, usamos una familia coherente. Así, nos aseguramos que todos los iconos tengan el mismo peso visual (stroke) y lenguaje, vital para una buena experiencia del usuario (UX).

## BIBLIOTECA DE COMPONENTES (ATOMIC DESING):

### ELEMENTOS BÁSICO (ÁTOMOS):

PARTE A: sistema de botones (Interacción):

En esta parte se ha creado un grupo de botones capaz de adaptarse al contenido y jerarquizar las acciones del usuario.

- Ingeniería elástica (auto layout): en vez de usar formas fijas, los contenedores se han configurado con relleno (padding) vertical y horizontal, permitiendo que el botón crezca automáticamente según la longitud del texto y asegurando que nunca se rompa el diseño.
- Gestión de estados (variantes): hay tres estilos visuales en un único componente (Buttons) lo que facilita el mantenimiento.
    1. Primary (sólido): color corporativo. Sirve para la acción principal de la pantalla; como iniciar sesión.
    2. Secondary (outline): solo borde. Este estilo es para acciones alternativas o de menor peso; por ejemplo el botón Editar.
    3. Ghost (solo texto): sin contendor. Para acciones terciarias o enlaces discretos; como, por ejemplo “¿Olvidaste la contraseña?”

PARTE B: campos de texto (Entrada de datos):

En la segunda parte se ha diseñado una elemento estándar para capturar la información (inputs), priorizando la usabilidad (UX) y la claridad.

- Arquitectura anidada (nested auto layout): básicamente es una estructura construida como “Padre e Hijo”, la cual sirve para agrupar elementos lógicamente.
    - El contenedor (input box): es un marco con bordes y radio definido que actúa como zona de escritura.
    - La etiqueta (label): un texto descriptivo posicionado mediante Auto Layout Vertical.
- Decisión de UX (label externo): se ha colocado el título fuera y arriba de la caja, esto evita que la instrucción desaparezca cuando el usuario empieza a escribir, reduciendo la carga cognitiva y evitando errores duranta la introducción de los datos.

### ELEMENTOS COMPLEJOS (MOLÉCULAS):

En este apartado se han creado los sistemas de entrada de datos inteligentes.

- Se han diseñado los inputs de datos, es decir, los datos a rellanar por el usuario, para ello he creado una estructura de celdas de manera horizontal, cuyos datos son los títulos:  KG, REPS, RIR y OBJ. Esta estructura de celdas las he unido mediante el método Auto Layout no solo para alinear, sino también para crear una tabla que se comporta de forma matemática.
- Una vez creado la primera estructura de celdas, se ha implementado una técnica de espejo, que consiste en usar la misma estructura de la fila de títulos para la fila de inputs de los datos. Esto garantiza que el encabezado y las columnas estén alineados al píxel, independientemente del tamaño de la pantalla.

### MÓDULO DE ENTRENAMIENTO (ORGANISMO):

El núcleo de la aplicación se basa en el diseño de las tarjetas de entrenamiento, donde se han diseñado 3 tipos permitiendo diferenciar a los usuarios dependiendo de su nivel.

- Variante Elite (Avanzada):
    - Control Total: dispone de una columna adicional: OBJETIVOS y de opción de elegir el tipo de serie: TopSet, BackOff, Rest Pause, étc.
    
    Notas Dinámicas: se ha configurado el área de sensaciones con "Hug Contents" y "Auto-height", es decir, si escribes un párrafo sobre una molestia en el hombro o una mejora técnica, la tarjeta crece sola sin romperse.
    
- Variante Intermedia:
    - Simplificación: para esta tarjeta se ha eliminado la columna de los OBJETIVOS, con el objetivo de mantener un diseño limpio.
- Variante Básica:
    - Foco Absoluto: se ha reducido todo a KG y REPS. Es una interfaz limpia de distracciones, ideal para quien está empezando y solo necesita registrar su progresión de carga.

### MÓDULO DE COMUNICACIÓN Y NUTRICIÓN:

En este apartado se ha creado los elementos base para la comunicación fluida entre el deportista y le entrenador:

- Burbujas de mensaje dinámicas: Construidas con *Auto Layout* para que se adapten automáticamente a la longitud del texto. Configuramos dos variantes visuales (mensaje-atleta y mensaje-entrenador), utilizando la paleta de colores y un radio de borde asimétrico (el "pico" inferior) para diferenciar claramente al emisor del receptor.
- Barra de entrada (Input): Un componente responsivo que incluye el campo de texto y el botón de envío, configurado para estirarse correctamente al ancho de cualquier dispositivo móvil.

También hemos diseñado una solución UX orientada a la usabilidad rápida para llevar el control de ingestas estratégicas (pre-entreno y merienda):

- Tarjetas interactivas (Toggle Cards): Un componente visual con dos estados. Un estado inactivo (neutro/gris) y un estado de éxito (borde verde y elementos iluminados). Al programar la interacción (*Al hacer clic -> Cambiar a*) en el propio componente maestro, permitimos que el usuario registre su ingesta con un solo toque, evitando la carga cognitiva de los contadores de gramos o calorías.

## **DISEÑO DE PANTALLAS (HIGH-FIDELITY UI):**

Este punto se ha hecho de lo mas complicado a lo mas sencillo.

### MODO ENTRENAMIENTO (ACTIVE WORKOUT):

Esta es la una de las pantallas mas críticas de la apliación.

Para empezar a trabajar en esta pantalla hemos empezado preparando el lienzo, para ello hemos creado una capa en High-Fi del tamaño estándar de un teléfono móvil. En esta paso hemos ido probando diferentes propuestas de diseño has obtener un diseño en cuanto a estructuración limpio y claro. Hemos pivotado hacia una estética de producción *High-Fidelity* basada en el estándar de la industria del fitness (estilo *Dark Mode*), que ha permitido que la pantalla, siguiendo la regla 60-30-10 y una limpieza estética , logre encapsular una alta densidad de datos (kilos, repeticiones, RIR, cronómetro) manteniendo una interfaz limpia, profesional y nada saturada.

Funciones técnicas que hemos incluido.

1. Arquitectura Dinámica (El Acordeón):  hemos finalizado la tarjeta de ejercicio interactiva usando Variantes y *Smart Animate*, que permiten al usuario desplegar los detalles (series, RIR, peso) de forma jerarquizada sin perder el contexto.
    - La pantalla incluye campos reales de entrada, un botón "+ Añadir serie" y un área de "Sensaciones" post-ejercicio. Al abrirse, el resto de la lista se desplaza orgánicamente hacia abajo.
2. Dominio de Auto Layout y Comportamientos de Scroll:
    - Scroll Horizontal Encapsulado: configuramos la zona de *inputs* numéricos con un tamaño fijo y la propiedad *Clip Content*, permitiendo un deslizamiento lateral sin deformar la tarjeta principal. (esta función, era para dar solución al problema de falta de espacio en la tarjeta de usuarios avanzados)
    - Scroll Vertical y Header Adhesivo: solucionamos el desbordamiento de rutinas largas activando el scroll vertical. Además, extrajimos el cronómetro del flujo mediante Posición Absoluta para fijarlo en la parte superior (*Sticky Header*), garantizando que siempre sea visible.
3. Resolución de Errores (Debugging UI):
    - Anclajes dinámicos: esto se ha hecho configurado el título del ejercicio en "Rellenar contenedor" (*Fill container*), logrando que los nombres largos salten de línea automáticamente mientras empujan y fijan el icono de la papelera en el extremo derecho.
    - Cascada de alturas: solucionamos el *bug* de las "series ocultas" corrigiendo las alturas fijas por elásticas ("Ajustado" / *Hug contents*) en toda la cadena de capas. Ahora, al añadir una nueva serie, el componente crece y empuja el resto de la interfaz correctamente.

### GESTIÓN DE RUTINAS:

Para esta parte hemos diseñado varias pantalla que corresponden con las rutinas y todas las acciones que se pueden hacer. Aquí también he empezado por la pantalla mas trabajosa.

Creación de rutinas:

Para esta función hemos creado tres pantalla diferentes, donde se muestran el progreso de creación de una rutina.

- La primera pantalla, corresponde con la pantalla inicial que el usuario se encuentra al darle al botón de crear rutina. Esta pantalla dispone de un un titulo junto con un icono de cerrar pantalla (x), ademas cuenta con dos inputs (nombre de la rutina y descripción) y con dos botones (añadir ejercicio y guardar rutina).
- La segunda pantalla representa el diseño de cuando el usuario le da al botón de añadir ejercicio en la anterior pantalla. Esta pantalla tiene lo mismo que la pantalla inicial, mas una tarjeta adicional que corresponde a un buscador/selector de ejercicios.
    
    (NOTA: Dibuje a mano la idea de la pantalla del buscador/selector de ejercicio y ese mismo boceto lo pase a figma, haciendo un diseño de alta fidelidad en Componente Maestro. Creamos una interfaz tipo tarjeta desplegable superpuesta, con su barra de búsqueda y filtros por músculos deslizables.).
    
- La tercera pantalla, es cuando ya se ha elegido el ejercicio. Al igual que la segunda pantalla, esta también cuenta exactamente con los mismos elementos que la primera pantalla, mas la tarjeta PLANTILLA del ejercicio, donde, además, contiene diferente información del ejercicio.
    
    (NOTA: la tarjeta adicional de PLANTILLA ha sido creada en la página de UI Kit & Tokens. En Componente Maestro diseñamos una variante específica para la planificación de rutinas. Le quitamos la caja de "Sensaciones" para limpiar el diseño, ya que ese dato solo sirve para después de entrenar).
    

Algunos de los arreglos que hemos tenido que hacer son: 

- Arreglamos el "esqueleto" de la pantalla: en las tres pantallas, tanto el título+icono, como el botón de guardar rutina los hemos configurado como FIJOS, para que al hacer scroll siempre se mantuviesen en la misma posición. Los demás elementos los hemos configurado en DESPLAZAMIENTO vertical, para que al hacer scroll se puedan mover, permitiendo ver toda la pantalla.
- Ajustamos las métricas a nivel experto: Para evitar el volumen basura y ajustar la intensidad inteligentemente, dejamos 4 columnas clave en cada serie (#, OBJ KG, OBJ RIR, OBJ REPS). Además, sacamos el "Descanso" fuera de la tabla para que el diseño respire y no parezca saturado.

Rutinas (con rutinas añadidas):

Esta es la pantalla donde se presentan las rutinas ya creadas.  Esta contiene el título de la pantalla, el botón de crear rutina y una tarjeta que representa a una rutina ya creada, la cual ha sido creada en Componente Maestro.

Rutinas (sin rutinas añadidas):

Esta es la pantalla que se muestra cuando no hay ninguna rutina añadida. Esta contiene el título de la pantalla, el botón de crear rutina y un icono con un subtítulo indicando que no hay rutinas, la cual ha sido creada en Componente Maestro. 

Rutinas (confirmar borrado de rutina):

Esta pantalla se muestra cuando le damos al botón de eliminar rutina. En este caso se ha duplicado la pantalla de Rutine (con rutina añadida), y en Componente Maestro se a creado un modal de confirmación. Para conseguir este efecto se ha superpuesto una capa negra, con opacidad, del mismo tamaño que la pantalla junto con el modal, que juntos forma un grupo.

### DASHBOARD:

El proceso de creación del Dashboard ha seguido una metodología de diseño de producto muy profesional, avanzando de menor a mayor fidelidad. Primero se empezó con un boceto a lápiz y papel, (*wireframing*). Esta etapa inicial permitió definir la arquitectura de la información y la jerarquía visual de forma rápida, sin las distracciones que a veces genera el software. En ese papel establecimos los pilares funcionales de la pantalla: la llamada a la acción principal para empezar a entrenar, un sistema de registro de nutrición rápido, el control del peso corporal y el refuerzo motivacional de la racha semanal.

Una vez validada esa estructura lógica, dimos el salto a Figma para construir la interfaz en Alta Fidelidad (High-Fi) utilizando un entorno de modo oscuro (*Dark Mode*). Empezamos delimitando el lienzo sobre un marco de dispositivo móvil y asentando los extremos de la pantalla. Fijamos la barra de navegación en la parte inferior, destacando de forma elegante el estado activo para que el usuario sepa siempre dónde está, y colocamos la cabecera de contexto en la parte superior. Al configurar estos elementos para que se mantengan fijos durante el *scroll*, creamos un contenedor robusto y escalable para albergar el resto del contenido.

Para ensamblar el núcleo de la pantalla, aplicamos las mejores prácticas del Diseño Atómico y el uso intensivo del *Auto Layout* (el equivalente a *Flexbox* en programación). Rescatamos las piezas modulares que ya habíamos fabricado previamente, como la gran tarjeta de la rutina diaria y los selectores rápidos de las ingestas estratégicas. Al agrupar todos estos bloques en un contenedor vertical dinámico, garantizamos que la pantalla sea completamente adaptable. El espaciado entre elementos es matemáticamente uniforme y la estructura está preparada para crecer o menguar en el futuro sin que el diseño se rompa, manteniendo una arquitectura limpia y fácil de mantener.

Finalmente, realizamos un pulido de usabilidad (UX) para garantizar una experiencia de "cero fricción" y sin volumen visual basura. Se han tomado decisiones estratégicas como eliminar botones secundarios redundantes en la sección del peso, asegurando que el gran botón azul de "Empezar" retenga todo el protagonismo y dirija al atleta directamente a la acción. Además, construimos el sistema de la racha semanal con distintos estados visuales que se adaptan automáticamente al ancho de la pantalla, ofreciendo un resumen instantáneo de la consistencia del usuario. El resultado final es un panel de control realista, eficiente, visualmente muy atractivo y técnicamente preparado para pasar a la fase de desarrollo.

### MENSAJERIA Y COACHING:

Para el módulo de mensajería entre el atleta y entrenador, y viceversa, se ha seguido una progresión lógica desde la estructura base hasta el pulido de la experiencia de los usuarios, siempre aplicando un diseño escalable.

Como paso previo a la comunicación, hemos implementado la lógica de negocio y vinculación. En la ruta del atleta, el acceso a esta función opera bajo un modelo Freemium, protegiendo la entrada con una pantalla de suscripción (Paywall). Aplicando el patrón de "Pestaña Bloqueada", mantuvimos la barra de navegación inferior intacta para otorgar control total al usuario, utilizando técnicas de divulgación progresiva y tarjetas de precios con alto contraste visual para comunicar los beneficios de forma persuasiva y no invasiva.

Para materializar la conversión tras el Paywall, diseñamos una pasarela de pago (*checkout*) a pantalla completa. Descartamos deliberadamente el uso de ventanas modales en este punto para evitar conflictos espaciales con el teclado virtual del dispositivo y para dotar a esta vista crítica de la máxima seguridad percibida. A nivel estructural, empleamos la disposición automática (*Auto Layout*) para agrupar campos cortos optimizando el espacio, e implementamos un comportamiento de desplazamiento (*scroll*) vertical fluido, manteniendo fijos tanto la cabecera de escape como el botón principal de pago en la parte inferior. Añadimos también elementos de confianza transaccional, como etiquetas de conexión segura y la previsualización de la tarjeta. Este flujo comercial concluye con una pantalla de confirmación, diseñada como un refuerzo psicológico positivo que desglosa los datos clave de la transacción (ID, importe y fecha de renovación) y guía al usuario directamente hacia la funcionalidad Premium recién adquirida.

Una vez completado el pago y superado el acceso, abordamos el momento en el que las bandejas de entrada aún no tienen contactos mediante el diseño de estados vacíos (Empty States) limpios, incorporando llamadas a la acción jerarquizadas (iconos en la cabecera para el atleta y botones de acción flotante o FAB para el entrenador). La acción de vincular usuarios se resuelve sin cambiar de pantalla a través de un modal inferior (Bottom Sheet), aislado del resto de la interfaz mediante un fondo atenuado (Overlay). En este componente, priorizamos la conexión mediante un código alfanumérico único por su nula fricción técnica, estructurando el envío por correo electrónico como una vía secundaria.

Superada la fase de vinculación, establecimos la bandeja de entrada como vista central, anclando la barra de navegación en la parte inferior para garantizar una transición fluida. En esta pantalla, dividimos claramente la arquitectura mediante el uso de contenedores fijos para la cabecera y el buscador, liberando el resto del lienzo para el desplazamiento vertical de la lista de chats, asegurando así un comportamiento nativo y realista.

Una vez asentada la base, iteramos sobre las tarjetas de perfil para elevar la interfaz al estándar actual de la industria. Transformamos bloques de información básicos en componentes interactivos, añadiendo previsualizaciones de texto, marcas de tiempo y estados visuales claros para los mensajes leídos y no leídos. Para lograr esto de forma eficiente, aprovechamos el sistema de variantes de Figma, lo que nos permitió alternar entre distintos estados de la interfaz de manera ágil y sin duplicar trabajo, consolidando un sistema de diseño limpio y fácil de mantener de cara a la etapa de programación.

Finalmente, abordamos la vista interior de la conversación aplicando la regla de los niveles de profundidad. Al ser una pantalla de foco secundario donde el usuario va a escribir, retiramos la barra de navegación principal para evitar toques accidentales y fijamos la zona de introducción de texto en el borde inferior. El cuerpo del chat se construyó ensamblando los componentes de las burbujas de mensaje que ya habíamos creado, utilizando la disposición automática (Auto Layout) para gestionar los márgenes y el espaciado de forma matemática. El uso estratégico del contraste cromático, asignando tonos neutros a los mensajes recibidos y el color de acento principal a los enviados, reduce la carga cognitiva del usuario y da como resultado un módulo de comunicación profesional, bidireccional y listo para desarrollo.

### FLUJO DE AUTENTICACIÓN:

Para el módulo del flujo de autenticación, la puerta de entrada de la aplicación, se ha seguido una progresión lógica desde la estructura base hasta el pulido de la experiencia de los usuarios, siempre aplicando un diseño escalable. Como punto de partida, implementamos una *Splash Screen* (pantalla de arranque) minimalista que actúa como enrutador inicial lógico. Esta vista, protagonizada únicamente por la identidad visual centrada matemáticamente, utiliza un evento de prototipado automático basado en tiempo (*After delay*) con una transición de disolución suave, simulando el comportamiento de carga y validación nativo de una aplicación real. Tras esta apertura, establecimos la pantalla de Iniciar Sesión (Login) como vista principal de acceso, descartando el uso de ventanas modales flotantes para garantizar el espacio necesario ante el despliegue del teclado virtual nativo. En esta pantalla, dividimos claramente la arquitectura mediante el uso de Disposición Automática (Auto Layout), apilando los campos de texto, llamadas a la acción y enlaces con un comportamiento *responsive* de "Llenar contenedor", liberando el diseño de medidas fijas y asegurando así una adaptabilidad matemática a los márgenes del dispositivo.

Una vez asentada la base, iteramos sobre esta estructura para construir la vista de Registro aplicando el principio de no repetición (DRY) al duplicar la base ya maquetada. Transformamos el diseño para dar cabida a un formulario de datos más extenso sin sacrificar la usabilidad. Para lograr esto de forma eficiente, en lugar de reducir el tamaño de los elementos para forzar su encaje visual, aprovechamos el motor de prototipado configurando un desplazamiento (*scroll*) vertical realista, lo que nos permitió mantener áreas táctiles amplias y accesibles, consolidando un sistema de diseño limpio, ordenado y fácil de mantener de cara a la etapa de programación.

Finalmente, abordamos la interacción de estas vistas con desplazamiento aplicando la regla de los niveles de profundidad estructural (*z-index*). Al configurar elementos como cabeceras de navegación y botones principales como bloques fijos, aplicamos rellenos opacos sólidos para garantizar que el contenido del formulario o las tarjetas se oculte limpiamente al pasar por debajo, evitando un solapamiento de textos que rompa la interfaz. El cuerpo del flujo se cerró ensamblando la pantalla de Recuperar Contraseña mediante los módulos ya creados, añadiendo márgenes interiores (*padding*) estratégicos en la parte inferior de los contenedores para evitar que los últimos elementos queden tapados. El uso de estas reglas estrictas de maquetación reduce la fricción de navegación y da como resultado un módulo de acceso profesional, sólido y listo para desarrollo.

### PERFIL Y PROGRESIÓN:

PROGRESIÓN:

El módulo de Progreso se ha conceptualizado como el núcleo analítico de la aplicación. Su objetivo es transformar los datos brutos registrados por el usuario en información visual y procesable, permitiendo una programación inteligente del entrenamiento. Para evitar la sobrecarga cognitiva y estructurar la información con claridad, la interfaz se divide en tres vistas fundamentales: Carga, Volumen y Cuerpo.

1. Vista de Carga: Rendimiento Mecánico: esta pantalla está destinada a monitorizar la evolución de la sobrecarga progresiva en ejercicios específicos de la rutina.

- Filtros temporales: Se ha implementado un selector de rango rápido (1M, 3M, 6M, 1A) que permite analizar la tendencia del rendimiento tanto en microciclos recientes como a lo largo de un macrociclo completo.
- Gráfica de tendencia: Una visualización de líneas que muestra la progresión del peso levantado, diseñada con curvas suaves para una lectura rápida de los picos de rendimiento y estancamientos.
- Métricas Clave (KPIs): La gráfica se complementa con tarjetas de datos de alto contraste que muestran el RM Estimado y el RIR Medio. Esta disposición es crucial para ajustar el esfuerzo inteligentemente: permite al entrenador cruzar la fuerza bruta con el carácter de esfuerzo real, priorizando ejercicios seguros y validando la relación estímulo/fatiga.

2. Vista de Volumen: Gestión del Estímulo y Prevención de Fatiga: esta pantalla representa el diferencial técnico de la aplicación, diseñada específicamente para controlar el volumen semanal por grupo muscular y erradicar el "volumen basura".

- Visualización de Volumen Relativo: En lugar de gráficas de barras absolutas, se utiliza un patrón de diseño de "barra de estado" que indica el porcentaje de llenado respecto a la capacidad máxima recuperable del atleta.
- Etiquetado de Estados: Mediante un código de colores (con su respectiva leyenda superior), cada grupo muscular se categoriza en estados clave: Mantenimiento, Adecuado, Bajo, Excesivo o Prioridad. Esto permite auditar de un simple vistazo si la programación está optimizada o si existe riesgo de sobreentrenamiento.
- Auditoría por Mesociclo: El selector superior permite aislar la información del bloque actual, facilitando la toma de decisiones para el siguiente mesociclo (por ejemplo, pasar un músculo de "Mantenimiento" a "Prioridad").

3. Vista de Cuerpo: Recuperación y Adaptación Biológica: el rendimiento mecánico carece de contexto sin el análisis de la recuperación. Esta vista monitoriza la respuesta biológica del usuario ante las cargas impuestas.

- Evolución del Peso Corporal: Una gráfica independiente que permite correlacionar las fluctuaciones del peso (fases de volumen o definición) con el progreso en las cargas.
- Panel de Sensaciones Cualitativas: Un sistema de lectura rápida mediante etiquetas (*badges*) que evalúa la Calidad del sueño, Motivación, Nivel de energía, Fatiga muscular (DOMS) y Molestias articulares. El registro de estas variables (especialmente la motivación y las molestias) actúa como un radar clínico para detectar la fatiga del Sistema Nervioso Central a tiempo, permitiendo descargar el entrenamiento antes de que ocurra una lesión.

PERFIL:

El módulo de Perfil se ha conceptualizado como el centro de control administrativo y de identidad del atleta dentro de la aplicación, con el objetivo de centralizar la gestión de datos biométricos, el estatus contractual del usuario y la configuración de seguridad. Para estructurar esta información con claridad y profesionalidad, la interfaz se divide en áreas críticas que abarcan desde la monitorización del estatus actual hasta los sistemas de seguridad y fricción. El Dashboard de Usuario actúa como la pantalla de aterrizaje principal, ofreciendo una radiografía inmediata de la situación del atleta sin necesidad de navegar por submenús complejos. En esta vista se ha implementado una cabecera de identidad visual que incluye el avatar y el nombre, reforzada por un panel de métricas rápidas con tarjetas de alto contraste que muestran el Peso Actual, la Racha de Constancia y el Mesociclo Activo. Esta disposición permite al usuario validar su compromiso y ubicación temporal dentro de su macrociclo de entrenamiento de un solo vistazo, facilitando una navegación estructurada mediante un sistema de menús en lista con iconos minimalistas que culminan en una acción de cierre de sesión diferenciada cromáticamente para prevenir ejecuciones accidentales.

La gestión de datos y suscripción representa la vertiente técnica y económica de la relación entre el usuario y su programación inteligente. Para ello, se ha diseñado un formulario de edición de datos personales optimizado con campos de entrada en blanco sobre fondo oscuro, garantizando una legibilidad superior y una actualización fluida de las variables físicas que alimentan los algoritmos de progresión. Esta sección se complementa con la visualización del control de membresía a través de una tarjeta de Plan Premium que detalla los servicios activos, como el análisis biomecánico y el chat directo, reforzando la percepción de valor del servicio recibido. Asimismo, la integración de una vista de método de pago vinculado facilita la transparencia financiera y permite la edición rápida de los datos de facturación, asegurando que el flujo administrativo sea tan eficiente como el propio entrenamiento.

Finalmente, se han implementado sistemas de seguridad y fricción para aquellas acciones críticas que podrían comprometer la experiencia del usuario o su permanencia en la plataforma. Mediante una arquitectura de capas basada en el uso de modales o ventanas emergentes, se aplica un fondo atenuado con un 50% de opacidad que bloquea la interfaz trasera, eliminando distracciones y forzando el foco atencional en la toma de decisiones importantes. Estos componentes se han construido con una opacidad del 100% para garantizar que los textos de advertencia en procesos de cierre de sesión o cancelación de suscripción sean totalmente legibles. En este último caso, se aplica un diseño de fricción ética utilizando botones de texto plano para reducir la tasa de bajas impulsivas, asegurando que el atleta sea plenamente consciente de la pérdida de beneficios estratégicos, como el coaching personalizado o el control estricto de la evolución, antes de confirmar la acción definitiva.

## **PROTOTIPADO E INTERACCIÓN**

La fase de prototipado e interacción ha transformado el lienzo estático de la aplicación en un producto digital navegable, estableciendo la arquitectura de la información y los modelos mentales del usuario. La conexión de flujos se ha estructurado en dos niveles de profundidad. Por un lado, la navegación principal a través de la barra inferior se ha configurado con transiciones instantáneas, emulando el rendimiento nativo de los sistemas operativos móviles para garantizar una respuesta inmediata al cambiar entre los módulos principales. Por otro lado, la navegación secundaria y de detalle, como el acceso a los ajustes personales o la configuración de suscripciones, se ha implementado mediante animaciones de desplazamiento lateral. Esta decisión técnica ayuda al atleta a construir un mapa espacial de la interfaz, comprendiendo visualmente cuándo avanza hacia una configuración específica y cuándo retrocede al panel principal.

Para reducir la fricción cognitiva y mejorar la usabilidad, se han integrado microinteracciones que actúan como bucles de retroalimentación constante. La interfaz ahora responde a las acciones del usuario mediante cambios de estado visuales, como la alteración de opacidad o color en los botones al ser pulsados y la aparición de validaciones visuales tras ejecutar acciones en la aplicación. Estos detalles de diseño de interacción aseguran que el sistema comunique en todo momento su estado, confirmando que las instrucciones se han procesado correctamente y aportando robustez profesional a la experiencia de uso.

Durante la auditoría de usabilidad y el proceso de enrutamiento de esta fase final, el testeo de los flujos de interacción ha puesto de manifiesto ciertas brechas en la arquitectura del producto. Al simular los recorridos completos de extremo a extremo y conectar los nodos, se ha detectado la ausencia de algunas pantallas intermedias y funciones específicas que no fueron contempladas en la etapa de conceptualización estática inicial. Esta identificación temprana es uno de los propósitos fundamentales del prototipado en el desarrollo de software. Todos estos casos límite y vistas faltantes han sido documentados en un registro técnico, programando su diseño e integración funcional para la sesión de mañana, lo que garantizará un ecosistema de navegación completamente hermético antes de dar por concluido el prototipo.