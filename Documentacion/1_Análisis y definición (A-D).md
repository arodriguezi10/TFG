# Análisis y definición (A-D)

Estado: HECHO
Prioridad: Crítica
Fecha: 19 de enero de 2026 → 28 de enero de 2026

# **FASES DEL PROYECTO:**

- Análisis y definición del proyecto - (2 semanas).
- Base de datos y arquitectura - (2 semanas).
- Diseño UI/UX en figma - (4 semanas). —> en la que me encuentro ahora
- Desarrollo del fronted - (6 semanas).
- Desarrollo del backend - (5 semanas).
- Testing y errores - (2 semanas).
- Documentación - (3 días).

# **MODELO DE ESQUEMA GENERAL:**

[https://whimsical.com/estructura-de-la-pagina-24nvxYyCdg2rR7p8ETcJZo](https://whimsical.com/estructura-de-la-pagina-24nvxYyCdg2rR7p8ETcJZo)

# **DEFINICIÓN DE LAS FUNCIONALIDADES:**

## **Funcionalidades estructurales (Bases del sistema):**

Necesarias para que la web funcione como software seguro y robusto:

### Gestión de usuarios.

- Registro de usuario (Sing up): proceso por el cual un nuevo visitante se convierte en un usuario registrado.
    
    Consistirá en un formulario donde el usuario debe introducir sus datos: nombre, apellidos, email, nombre de usuario, contraseña, confirmación de contraseña, confirmación de email (enlace o código), a veces de número de teléfono (SMS). Además pedirá algunos datos adicionales como la fecha de nacimiento, así como el país de procedencia. Por ultimo, pedirá al usuario la aceptación de términos y condiciones y políticas de privacidad.
    
    Algunos puntos técnicos que se debe tratar por ejemplo, es que el email debe ser único en la base de datos y tener formato válido.
    
- Inició de sesión (Login): verificación de identidad para darle acceso a la zona privada.
    
    El usuario tendrá que enviar su email y contraseña, y el sistema verificará si coinciden con los datos almacenados.
    
    Lo ideal sería implementar JWT (JSON Web Tokens) al ser una arquitectura Cliente-Servidor (API REST), es decir, que cuando el login sea correcto, el servidor envié un token. Que el frontend guarde ese token y lo envié a la cabecera de cada petición para decir “soy yo, déjame pasar”.
    
- Recuperación de la contraseña (Password Reset): función para cuando el usuario olvide su clave.
    
    El beneficiario tendrá que introducir su email y recibirá un enlace para restablecer su contraseña.
    
    Se tendrá que generar un token temporal único con caducidad (ej: 1 hora) que se envía por correo. Que cuando se haga clic, el usuario puede establecer una contraseña nueva sobrescribiendo la anterior (previamente hasheada).
    
- Dar de baja la cuenta (Delete Account): proceso que permite eliminar una cuenta de la plataforma.
    
    El usuario puede decidir dejar de usar la aplicación y borrar sus datos.
    
    **IMPORTANTE:** en esta función hay dos opciones para el desarrollado, hard delete: que hace un borrado de la fila de la base de datos, el cual es irreversible o un soft delete: que marca al usuario como “inactivo” o “eliminado” en la columna de la base de datos históricos por integridad, aunque obviamente impidiendo que pueda volver a iniciar sesión.
    

### **Gestión de perfiles.**

- Visualización del Perfil (Ver datos): autorizará al usuario ver su información actual en una pantalla dedicada.
    
    El sistema cargará los datos del usuario logueado desde la base datos y los mostrará en el fronted.
    
    Un detalle importante es que es una petición GET a la API (ej: /api/profile) que devuelve un JSON con todos los datos, para pintar la vista.
    
- Edición de la información personal: permitirá modificar los datos de identificación, que consistirá en un formulario para cambiar nombre, apellidos o nombre de usuario visible.
    
    Se necesitará realizar una petición PUT o PATCH donde se valida que los nuevos datos cumplan con los requisitos.
    
- Gestión de foto de perfil (avatar): es una función fundamental para humanizar la aplicación, en especial en la lista de clientes del entrenador.
    
    Con esta función como bien indica su nombre, se podrá subir desde el dispositivo una imagen para usarla como avatar.
    
    IMPORTANTE: implica subir ficheros (multipart/form-data). Hay que decidir si guardas la imagen en una carpeta del servidor (sistema de archivos) o en la base de datos (menos recomendado), y guardar la URL en la tabla del usuario.
    
- Configuración de datos físicos (solo deportista): se presentarán como datos estáticos o poco cambiante, pero necesarios para los cálculos.
    
    Por ejemplo, se hará un registro de la altura, de la fecha de nacimiento (para calcular la edad automáticamente) y el género.
    
    IMPORTANTE: a diferencia del peso (que son datos cambiantes que se monitorizan en otro módulo), la altura y la edad son parte de la identidad base para calcular métricas de salud más adelante.
    
- Configuración profesional (solo entrenadores): incluirá un conjunto de información específica para el rol de entrenador.
    
    Contará con una tabla en la que se pueda añadir una “Biografía” o “Especialidad” (ej: hipertrofia, pérdida de peso, étc).
    
    Esto en un futuro, servirá para que los deportistas puedan ver el perfil del entrenador antes de contratarlo.
    

### **Gestión de roles y permisos.**

- Asignación de roles: se podrá definir si un usuario es Deportista o Entrenador.
    
    Al registrarse, el usuario elige su tipo de cuenta, y su elección se guarda de forma permanente en su perfil.
    
    Un detalle, es que, en la base de datos (tabla usuario), tendrá que haber una columna llamada rol (o una tabla relacionada), la cual guardará los valores como ‘ROL_ATLETA’ O ‘ROL_ENTRENADOR’.
    
- Protección de rutas (Backend Middleware): barrera de seguridad invisible que protegerá mi API.
    
    Esto asegurará que únicamente los usuarios con el rol adecuado puedan ejecutar ciertas accionen. Por ejemplo, un “atleta” no debería de poder enviar una petición de “Crear dieta” si esa función es exclusiva de los entrenadores.
    
    Se va a implementar **Middlewares** o "Guardias" en el backend. Antes de ejecutar la función del controlador, el sistema verifica el token del usuario. Si no tiene el rol necesario, devuelve un error **403 Forbidden** (Prohibido).
    
- Adaptación de la interfaz (Fronted): para que el usuario pueda modificar lo que ve según quien sea.
    
    Mostrará menús y botones diferentes:
    
    - Entrenador: con botones como “Gestionar alumnos”, “Asignar dietas”.
    - Deportista: con botones como “Registrar peso”, “Ver mi rutina”, “Ver progreso”.
    
    En el framework que emplea, ya sea React o Angular, usaré condicionales para renderizar componentes. (Ej: `if (user.role === 'COACH') { mostrarBotonCrear() }`).
    
- Control de propiedad (Ownership): nivel más profundo de permisos, no basta con tener el rol, este tiene que ser el “dueño” del dato.
    
    Se empleará para evitar que un usuario tenga acceso a los datos de otro usuario, aunque tengan el mismo rol. Es decir, que un deportista, solo puede ver sus registros y un entrenador solo puede ver los datos de los clientes que tiene asignados.
    
    Para la consulta a la base de datos siempre se filtra por ID del usuario.
    

### Gestión de errores y notificaciones.

- Feedback de Acciones (Notificaciones “Toast” o “Snackbars”): se mostrarán mensajes temporales para informar del resultado de una operación al usuario.
    
    Es decir, que cuando el usuario haga alguna acción como: registrar un nuevo peso o eliminar un ejercicio, aparezca un mensaje visual. (Por ejemplo: “Éxito: rutina guardada correctamente” o “Error: no se puede conectar con el servidor”).
    
    En el fronted se usarán librerías como SweetAlert, Toastify o los componentes nativos de Material UI/Tailwind para mostrar estos avisos sin recargar la página.
    
- Manejo de errores HTTP (API response): para que el backend comunique al fronted que tipo de problema ha ocurrido.
    
    La API debe ser semántica, no debe devolver siempre un “200 OK” si algo falla. Por lo que se debe implementar una estructura coherente de códigos estados:
    
    - **200/201:** Todo bien / Creado.
    - **400 Bad Request:** El usuario envió datos mal formados.
    - **401 Unauthorized:** No estás logueado.
    - **403 Forbidden:** Estás logueado, pero no tienes permiso para esto.
    - **404 Not Found:** El ejercicio o usuario que buscas no existe.
    - **500 Internal Server Error:** Fallo inesperado en tu código del servidor (bug).
- Validación de formularios (Feedback en inputs): que ayudará al usuario a corregir datos antes de enviarlos.
    
    Para que avise al usuario, si este a introducido un email sin “@” o si a puesto una contraseña de 2 letras.
    
    Un detalle, es que, en la parte visual (Fronted) aparezca con bordes rojos, mensajes de texto debajo, étc, todo en tiempo real y que en cuanto a la validación final de seguridad (Backend), si los datos llegasen mal al servido este devuelva por ejemplo un array de errores, que el fronted debe leer y mostrar.
    
- Gestión de estados vacíos (Empty states): se empleará para cuando no haya datos.
    
    Es decir, para que, cuando el usuario entre por primera vez en la página no se muestre una tabla vacía o un error, sino un diseño más amigable invitando a la acción.
    
- Página de error 404 (Ruta no encontrada): por si el usuario escribe una URL inexistente en el navegador. Esto lo que permitirá al usuario es volver al inicio sin sentirse perdido o creer que la web se ha roto.

### Dashboard/panel de control.

- Vista personalizado por rol: se creará un Dashboard diferente, adaptado a cada rol.
    
    Por ejemplo, que para los deportistas, haya preguntas a responder como: ¿Cómo voy? o ¿Qué me toca hacer hoy? y que para los entrenadores, haya preguntas como: ¿Cómo van mis alumnos? o ¿Quién necesita ayuda?.
    
    Que el fronted consulté el rol del usuario y renderice componentes distinto dependiendo del rol.
    
- Resumen de actividad (KPIs - Key Performance Indicators): se usarán tarjetas visuales con números grandes para informar de un vistazo
    
    Para el deportista:
    
    - Días de esta semana.
    - Último peso corporal registrado:
    - Próximo entrenamiento programado.
    
    Para el entrenador:
    
    - Nº total de alumnos activos.
    - Rutinas pendientes de asignar.
    - Alertas de alumnos estancados.
- Accesos directos (Quick actions): se creará botones para las acciones más frecuentes, facilitando la navegación.
    
    Esto reducirá el menor número de clics para las tareas repetitivas como: 
    
    - **Botón "Iniciar Entrenamiento":** Lleva directamente a la pantalla de registro de la sesión de hoy.
    - **Botón "Registrar Peso":** Abre un modal rápido para poner el peso del día.
    - **Botón "Crear Rutina" (Entrenador):** Va directo al constructor de planes.
- Estructura de navegación (Layout Principal): el panel de control.
    
    Habrá una barra lateral o una barra superior, siempre presente. Esto permitirá navegar entre todas las secciones principales y resaltar la sección en la que se encuentra el usuario actualmente. Para el móvil, sería un menú hamburguesa.
    

## **Funcionalidades del dominio (Core del negocio):**

Cumplen los objetivos específicos de la aplicación:

### Gestión de los ejercicios (Biblioteca):

- Biblioteca de ejercicios (Repositorio global): catálogo donde se almacenará todos los ejercicios disponibles en la plataforma.
    
    Será una vista tipo “lista” o “grid” donde se muestren todos los ejercicios.
    
    IMPORTANTE: como idea de negocio podremos implementar una lista de ejercicios base (creados por el administrador), comunes para todos, y que si quieren disponer de todos los ejercicios paguen una suscripción, por ejemplo.
    
    También es un detalle que consultar GET a la base de datos recuperando la lista paginada (para no cargar 500 páginas de golpe) .
    
- Creación de ejercicios personalizados (Custom Exercises): permitiendo cubrir la necesidad de que no todos los gimnasios tienen las mismas máquinas.
    
    Además, de que si hay un ejercicio que no existe en el gimnasio el usuario o entrenado pueda crearlo o buscar una variante. Para ello, se creará un formulario para introducir: nombre del ejercicio, grupo muscular principal y tipos (Fuerza, cardio, flexibilidad).
    
    IMPORTANTE: una cosa que habrá que tener en cuentas es poder diferenciar los ejercicios “base” (visibles para todos) de los “propios” creados por un usuario (solo visibles para el).
    
- Categorías y etiquetas (Tags):  esta función será esencial para organizar la biblioteca y no tener un caos de datos.
    
    Cada ejercicio debe tener asociados metadatos para poder clasificarlos.
    
    - **Grupo Muscular:** Pectoral, Dorsal, Pierna, Bíceps...
    - **Equipamiento:** Barra, Mancuernas, Peso Corporal, Máquina...
    - **Patrón de Movimiento:** Empuje, Tracción, Sentadilla (opcional, nivel avanzado).
    
    Esto será muy útil, porque luego ser podrá filtrar: “Ejercicio de empuje”.
    
- Buscador y filtrado inteligente: mejorará la usabilidad cuando la lista de ejercicios crezca.
    
    Se pondrá una barra de búsqueda en la parte superior de la biblioteca, en la que se busque el nombre del ejercicio mediante búsqueda por texto y se emplea dropdowns para seleccionar “Solo ejercicios de pierna”.
    
    IMPORTANTE: se puede hacer el filtrado en el cliente (Frontend) si son pocos datos, o en el servidor (Backend) mediante parámetros en la URL (ej: `/api/ejercicios?grupo=pierna`) si son muchos.
    
- Ficha técnica del ejercicio (Detalles): al hacer clic en un ejercicio, se pueda ver su información completa. Información que puede incluirse, por ejemplo: el nombre y grupo muscular, instrucciones para su ejecución junto con un video demostrativo de YouTube o una imagen, que seria muy útil para los principiantes.

### Gestión de las rutinas y planificación:

- El listado de “Mis rutinas” (La Biblioteca Personal): en la sección de rutinas, presentaremos una cuadrícula o lista de tarjetas. Cada tarjeta representará un plan de entrenamiento completo, como Torso Hipertrofia, Pierna Fuerza o Full body A.
    
    Esto funcionará como el menú principal de entrenamiento. El usuario vendrá aquí para revisar qué opciones tiene o para elegir una rutina y empezar a editarla.
    
    Cada tarjeta tendrá botones rápidos, como un icono de un lápiz para editar o una papelera para borrar si ya no sirve.
    
- El constructor de rutinas (Formulario maestro): cuando el usuario pulse el botón “Crear nueva rutina”, le llevaremos a una pantalla nueva o abriremos un modal grande, cuyo contenido será el siguiente:
    - Cabecera: aquí rellenara un input de texto con el nombre de la rutina (obligatorio) y un área de texto para una descripción o notas generales.
    - El selector de ejercicios: debajo, habrá un botón llamativo que diga “Añadir ejercicio” que al pulsarlo, se desplegará la lista de ejercicios que definimos en el punto anterior. El usuario podrá buscar el nombre del ejercicio, seleccionarlo y este se añadirá a la lista de rutina actual.
    - Para qué servirá: Este es el contenedor. Sin esto, no podemos agrupar ejercicios bajo un mismo día de entrenamiento.
- Configuración de series y repeticiones (El detalle técnico): esta será la parte mas importante para la base de datos (la tabla intermedia). Una vez que el ejercicio aparece en la lista de la rutina:
    - Los inputs: justo al lado o debajo del nombre del ejercicio, mostraremos inputs numéricos vacíos donde el usuario especificará:
        
        Series: (ej: `4`)
        
        Repeticiones Objetivo: (ej: `8-12`)
        
        Descanso (seg): (ej: `90`)
        
        RIR/RPE (Intensidad): (Opcional, un input para indicar el esfuerzo percibido).
        
    
    Esto transformará un ejercicio genérico en una instrucción precisa. No es lo mismo que solo te ponga el ejercicio a que también te diga el número de repeticiones que tienes que hacer, el grado de esfuerzo que debe emplear, étc. Aquí es donde se define la carga de trabajo teórica.
    
- Reordenamiento de Ejercicios (Drag & Drop - Opcional, pero recomendado): imaginemos que un usuario a añadido “Bíceps” ante que “Espalda”, pero ahora prefiere hacer espalda antes que bíceps. Deberíamos poner un pequeño icono al lado del cada ejercicio que permita arrastrar y soltar para cambiar el orden.
    
    Esto si serviría porque el orden de los factores si altera el producto en el entrenamiento. Ayudará a dar flexibilidad para corregir la estructura sin tener que hacerlo todo de nuevo. **NOTA:** si se complica programar el Drag & Drop, se pueden poner flechas de “subir” y ”bajar”.
    
- Asignación (solo para el rol de entrenador): si quien está usando esta pantalla es un entrenador, al final del formulario aparecerá un campo extra:
    
    Un dropdown o una lista desplegable con los nombre de sus clientes.
    
    Para qué servirá: Aquí es donde ocurre la magia de la relación N:M. El entrenador selecciona "Pepito Pérez" y le da a "Guardar". En ese momento, esa rutina aparece automáticamente en el perfil de Pepito.
    

### Registro de sesiones (Tracking)

- El selector de “Inicio de Entrenamiento”: cuando el usuario llegue al gimnasio, en su Dashboard tendrá un botón grande: “Iniciar entrenamiento”:
    
    Al pulsarlo, le preguntaremos: *"¿Qué vas a entrenar hoy?"*. Entonces le mostraremos una lista con sus rutinas planificadas (las que creamos en el punto anterior) para que elija una (ej: "Torso A").
    
    También pondremos una opción de "Entrenamiento Vacío" por si ese día decide improvisar ejercicios sobre la marcha.
    
- La “Hoja de papel” digital (La vista de diseño): Una vez seleccionada la rutina, cargaremos una pantalla limpia, pensada para móvil (Mobile First).
    
    Este verá una lista vertical con los ejercicios de ese día.
    
    Debajo del nombre del ejercicio (ej: Press Banca), mostraremos en pequeño (o en gris) lo que el usuario se *propuso* hacer (ej: "Objetivo: 4 series de 8 reps"). Esto servirá para: Que el usuario no tenga que memorizar su plan; la app se lo recuerda en el momento justo.
    
- Los inputs de registro (Rellenar la realidad): aquí es donde el usuario interactúa en cada serie. Debajo de cada ejercicio, desplegaremos una "tabla" editable.
    
    Fila por Serie: Por cada serie, habrá tres casillas (inputs) que el usuario rellenará:
    
    1. Kg (Peso): Aquí escribirá cuánto ha levantado (ej: `80`).
    2. Reps: Aquí pondrá cuántas ha hecho realmente (ej: `7`, aunque el objetivo fueran 8).
    3. RPE/Sensaciones (Opcional): Un selector del 1 al 10 para indicar cuánto le costó.
    
    Botón de "Check": Al lado de cada fila, pondremos un checkbox o botón de validación. Al pulsarlo, la fila se marcará en verde.
    
    Esto servirá para: Confirmar que la serie está terminada y descansada. Además, da satisfacción visual al usuario ver cómo completa el trabajo.
    
- Historial (Feedback histórico): será una función top de mucho valor.
    
    Justo al lado de donde el usuario tiene que escribir el peso de hoy, le mostraremos un texto pequeño que diga: *"Anterior: 75kg x 8"*.
    
    Esto servirá para: La Sobrecarga Progresiva. El usuario sabrá inmediatamente qué hizo la semana pasada para intentar superarlo hoy. Sin esto, el usuario entrena a ciegas.
    
- El cronómetro de descanso (Opcional pero útil):
    
    Cuando el usuario marque el "Check" de haber terminado una serie, podríamos hacer que salte automáticamente un contador (ej: 90 segundos) en una esquina de la pantalla.
    
    Esto servirá para: Que el usuario controle sus tiempos de descanso sin salir de tu aplicación para ir a la app de "Reloj" del móvil.
    
- Finalizar y guardar:  al final de la lista de ejercicios, habrá un botón fijo y llamativo: "Finalizar Entrenamiento".
    
    Al pulsarlo, la aplicación recopilará todos esos números, calculará la duración total (hora inicio - hora fin), el volumen total de carga (kilos x repeticiones) y guardará todo ese paquete de datos en la base de datos como una "Sesión Completada".
    
    Feedback: Inmediatamente después, le mostraremos un mensaje de felicitación o un resumen rápido ("¡Buen trabajo! Has levantado 5.000kg en total hoy").
    
- Sincronización asíncrona (Offline-First): permitirá al usuario registrar todo su entrenamiento aunque no tenga conexión a internet en el gimnasio.
    
    Los datos se guardarán en el almacenamiento local del móvil mientras el usuario entrena. Al finalizar, la app detecta si hay conexión y envía el paquete completo al servidor. Si no hay red, los datos quedan pendientes hasta que se recupere la cobertura, evitando la perdida de información
    

### Gestión de medidas y salud:

- El registro de peso corporal (La báscula): una pantalla muy sencilla y rápida de cargar, porque esto es algo que el usuario suele hacer por la mañana medio dormido.
    
    Será un  formulario minimalista con dos campos clave:
    
    1. Fecha: por defecto, la de hoy, pero editable por si se le olvidó registrarlo ayer.
    2. Peso (kg): un input numérico grande y claro.
    
    Esto servirá para crear na serie temporal de datos. Vital para que luego, en las gráficas, podamos dibujar esa línea de tendencia y ver si el peso sube, baja o se mantiene.
    
- La hoja de parámetros (la cinta métrica): será un formulario más detallado.
    
    Un formulario con varias casillas etiquetadas con partes del cuerpo: *Cintura, Cadera, Pecho, Brazo derecho, Brazo izquierdo, Muslo, Gemelo*.
    
    Como ayuda visual sería ideal acompañar estos inputs con un pequeño esquema o dibujo del cuerpo humano indicando dónde poner la cinta métrica, para que el usuario siempre mida en el mismo sitio.
    
    Esto servirá para: Evaluar la recomposición corporal. Si la cintura baja y el brazo sube, el entrenamiento está funcionando, aunque el peso sea el mismo.
    
- Álbum de fotos (progreso visual): los números son fríos, pero una imagen motiva mucho más.
    
    Se verá una apartado donde el usuario pueda subir tres fotos por fecha de revisión: frente, perfil y espalda, que al subirlas el sistema etiquetará con la fecha.
    
    Esto servirá para crear un antes y un después. Para el Entrenador es la herramienta más valiosa para corregir posturas o ver desequilibrios que los números no muestran.
    
- El semáforo nutricional (control de dieta básico): sería un control super básico de las comidas.
    
    La Configuración (Entrenador/Usuario): Primero, habrá un lugar donde establecer el "Objetivo Diario". Por ejemplo: *2500 Calorías y 160g de Proteína*.
    
    El Registro Diario (Usuario): Cada día, el usuario tendrá unos inputs simples para decir cuánto ha consumido en total: *"Hoy he comido 2450 kcal"*.
    
    Esto servirá para: Rendición de cuentas (Accountability). No hace falta registrar cada lechuga, pero sí tener una consciencia global de si se está cumpliendo el plan nutricional o no.
    

### Visualización de estadísticas:

- La Gráfica de Evolución de Peso (La Tendencia): sería un gráfico de líneas clásico, muy limpio.
    
    En el eje horizontal (X) tendremos las fechas y en el vertical (Y) los kilos. Se dibujará una línea que une todos los pesajes que el usuario registró en el bloque de "Salud". Cuando se pase el ratón (o el dedo) por encima de un punto de la línea, aparecerá una etiqueta flotante (tooltip): *"12 de Marzo: 78.5 kg"*.
    
    Esto servirá para que el usuario entienda que el peso fluctúa día a día, pero lo importante es la tendencia a largo plazo (si la línea va hacia arriba o hacia abajo).
    
- El Analizador de Fuerza (Progreso en Cargas):
    
    Primero, habrá un desplegable donde el usuario elige un ejercicio clave, por ejemplo: "Sentadilla". Automáticamente, se generará una gráfica de líneas. Pero, ¡ojo!, no pintaremos solo el peso levantado, sino el 1RM Estimado (Repetición Máxima Teórica).
    
    - *Nota técnica:* Usarás una fórmula matemática (como la de Epley) en el código para calcular esto basándote en el peso y las repeticiones que registró el usuario.
    
    Esto validará que el usuario se está volviendo más fuerte. Si la línea sube, el entrenamiento funciona.
    
- El Mapa de Calor de Constancia (Consistency Heatmap): Aquí vamos a "gamificar" un poco la experiencia.
    
    Haremos algo similar a GitHub y sus cuadraditos verdes. Un calendario anual donde cada día es un cuadro.
    
    - Si el usuario no entrenó, el cuadro es gris.
    - Si entrenó suave, es verde claro.
    - Si entrenó duro (mucho volumen), es verde oscuro.
    
    Esto motivará al  usuario que querrá ver su calendario lleno de color y evitará "romper la racha". Es un refuerzo psicológico muy potente.
    
- La Distribución del Entrenamiento (El Gráfico de "Quesito"): Será un gráfico circular (Pie Chart) o de radar para ver el equilibrio.
    
    Un círculo dividido en secciones coloreadas que representan los grupos musculares trabajados en el último mes (ej: 40% Pierna, 30% Pecho, 30% Espalda). Permitirá detectar desequilibrios. Si el usuario ve que el 80% de su gráfico es "Pecho" y solo el 5% es "Pierna", se dará cuenta visualmente de que está entrenando mal y necesita corregirlo (o el entrenador se lo dirá).
    
- Comparativa de Medidas (El Radar): un **Gráfico de Radar** (o de araña). Cada punta del polígono es una parte del cuerpo (brazo, cintura, muslo).
    
    Pintaremos dos líneas de diferente color superpuestas:
    
    - *Azul:* Medidas de hace 3 meses.
    - *Rojo:* Medidas actuales.
    
    Se podrá ver la recomposición corporal de un vistazo. Si el polígono rojo es más ancho en "brazo" pero más estrecho en "cintura" que el azul, ¡éxito total!
    

### Gestión de vinculación (Entrenador - deportista):

- El sistema de invitaciones (El handshake): para que un entrenador pueda ver los datos de un deportista, primero deben "darse la mano" digitalmente.
    
    De parte del entrenador, este tendrá un botón que dice “Añadir alumno”. Al pulsarlo, sale un pequeño formulario, donde escribes el correo del cliente
    
    Del lado del alumno, este le aparecerá una notificación en su perfil: *El entrenador Juan quiere vincularse contigo. ¿Aceptar o Rechazar?"*.
    
    Esto garantizará la privacidad (GDPR). Nadie podrá ver los datos de salud sin un consentimiento explícito previo.
    
- La cartera de clientes (El panel de mando de Coach): una vez aceptada la solicitud, el entrenador podrá acceder a su vista principal.
    
    En ella, aparecerá una tabla o lista de tarjetas, donde cada tarjeta es uno de los alumnos activos.
    
    En esa tarjeta no solo se verá el nombre y la foto de perfil, sino un resumen rápido tipo “semáforo”:
    
    - *Último entreno:* Hace 2 horas (Verde).
    - *Adherencia:* 90% (Verde).
    - *Estado:* Activo.
    
    Esto permitirá al entrenador ver de un vistazo quién esta cumpliendo y quién se está “escaqueando” sin tener que entrar uno por uno.
    
- El “Modo espectador” (ver perfil del alumno): esta parte es interesante, cuando el entrenador hace clic en el alumno.
    
    El sistema le llevará al Dashboard del deportista, entonces el entrenador verá exactamente las mismas gráficas, calendarios y registros que ve el alumno, pero en modo lectura (o con permisos de edición si decide corregir algo).
    
    Lo que permitirá esto es una supervisión remota. El entrenador podrá entrar, ver que el cliente falló el peso en la última serie de Sentadilla, por ejemplo, y prepararse para darle feedback.
    
- La asignación de rutinas: esto tendrá que ver con la creación de rutinas visto antes.
    
    Esto permitirá al entrenador crear una rutina y en lugar de guardarla para él, pulsa el botón de “Asignar a … “ y selecciona al usuario al que le quiera asignar la rutina. 
    
    Esto dará ventaja ya que el entrenador programará una vez la rutina y está la podrá distribuir a mucho, por lo que, también ahorrara tiempo.
    
- El canal del Feeddback (notas del entrenador): en cada sesión del alumno habilitaremos un campo de texto especial para que solo el entrenador pueda escribir sus notas a cerca de su alumno.
    
    Por ejemplo, el entrenador escribe: *"He visto que bajaste reps en la última serie, descansa más la próxima vez"*. Al alumno le aparecerá ese comentario destacado en su historial. Esto ayudará a mantener la comunicación humana y el asesoramiento, que es el valor real del entrenador personal.
    
- Sistema de mensajería interna (Chat Asíncrono):  Se habilitará un canal de comunicación bidireccional entre entrenador y deportista, independiente de las notas de las sesiones.
    - Bandeja de entrada: Una vista donde el usuario puede ver su historial de conversaciones ordenado cronológicamente. Diferenciará visualmente los mensajes enviados (alineados a la derecha) de los recibidos (alineados a la izquierda).
    - Notificaciones de lectura: Implementación de un indicador visual (punto rojo o contador) en el icono del chat cuando existan mensajes nuevos sin leer (estado is read = false), garantizando que el usuario sepa cuándo tiene novedades.

## **Funcionalidades adicionales (Valor añadido):**

Funciones que elevarían y mejorarían la experiencia del usuario (UX):

### Calculadora de RM (Repetición máxima) integrada:

Esto es un cálculo para conocer teórica y aproximadamente cuan fuerte es una persona sin necesidad de jugarse el cuerpo levantando el peso máximo real.

Esto se puede implementar como un pequeño widget en el Dashboard o un como una herramienta en el menú lateral llamada “Calculadora”.

La interacción con esta función sería muy sencilla, el usuario vería dos casillas: Peso levantado y repeticiones hechas. Por ejemplo: 100kg y 5 repeticiones. El resultado, sería al instante, la app le dice: “Tu 1RM es de 115kg”. Además, le muestra una tabla con los porcentajes, es decir “Para trabajar al 70%, usa 80 kg”.

Esto le será de gran utilidad tanto para el usuario que va por cuenta propia, como al entrenador que lleve a los atletas, a la hora de planificar las cargas de entrenamiento de forma inteligente si necesidad de pasarse de peso o quedarse corto.

### Historial de récords personales (PRs):

Esto aportará un poco de gamificación automática.

Cuando el usuario termina su sesión, al guardarla, el backend lo comprobará silenciosamente con el historial. Si el peso que acaba de levantar es mayor que su máximo anterior, aparecerá una notificación de felicitaciones o se le otorgará alguna medalla en el resumen del entrenamiento.

Esta función como ya he comentado, dará un subidón de dopamina al usuario. Es la mejor forma de fidelizarlo: celebrar sus victorias automáticamente.

### Clonado de rutinas:

Esta función me parece muy importante, ya que ahorrará mucho tiempo tanto al usuario como al entrenador personal. 

Esto permitirá cambiar algún ejercicio de cualquier rutina ya creada, simplemente con un botón: “Duplicar”, que añadiremos en la rutina existente, ahorrándose de tener que crear una nueva desde cero.

Se creará al instante una copia llamada “NombreRutina-copia” y simplemente el usuario entra y cambia ese ejercicio y también podrá renombrar la rutina.

Esto mejorará la usabilidad, reduciendo el uso de clics.

### Exportación de datos:

Será muy útil sobre todo para el entrenador, o para los usuarios que le gusten guardar las cosas a papel.

Habrá un botón en la sección de “Estadísticas” que diga: “Descargar informe mensual” y la aplicación generará un archivo PDF limpio que incluirá: 

- Resumen de días entrenados.
- Gráfica de peso corporal.
- Listas de mejores marcas del mes.

Esto ayudará a personalizar el servicio, ya que si eres entrenado, entregar este documento a tus clientes a fin de mes justifica tu precio y muestra de calidad.

### Biblioteca multimedia básica:

Sobre todo va dirigido para los principiantes, para evitar lesiones y poder mejorar la técnica sin abandonar la aplicación.

Esto servirá para que los usuarios no tengan que buscar en YouTube la realización de un ejercicio, ya que en la ficha de cada ejercicio (visto al principio), añadiremos un enlace directo a un vídeo (ya sea mío o de un canal fiable).

Entonces, cuando el usuario este entrenado y le toqué un ejercicio del que no sepa bien la técnica, pulsaré el enlace (que será en forma de icono) y se abrirá el vídeo ahí mismo. 

### Diccionario de datos:

- `weight_kg`: **DECIMAL(5,2)** (para permitir pesos como 72.50 kg).
- `role`: **ENUM('ADMIN', 'COACH', 'ATHLETE')**.
- `photos_url`: **VARCHAR(255)** o **TEXT** (si vas a guardar varias URLs).

### **Notificaciones Push (Mejora futura):**

Evolución del sistema de mensajería para enviar alertas al dispositivo móvil del usuario incluso cuando la aplicación está cerrada, utilizando Service Workers y la API de Web Push.

# **REQUISITOS NO FUNCIONALES:**

- **Seguridad:** Implementación de **CORS** para que solo tu frontend pueda hablar con tu backend.
- **Escalabilidad:** Uso de **Lazy Loading** en React/Angular para que la página de estadísticas no tarde una eternidad en cargar.
- **Disponibilidad:** Estrategia de **Mobile First** para garantizar que la app sea usable con una sola mano en el gimnasio.
    - Resiliencia de datos: el sistema deberá garantizar que el progreso del usuario no se pierda por fallos de red. Se implementará una estrategia de persistencia en el cliente (LocalStorage) para asegurar que la aplicación sea 100% funcional en modo lectura/escritura de sesión sin acceso al servidor.

# **STACK TECNOLÓGICO:**

- Base de Datos:
    - Motor de la base de datos: MySQL 8.0 (Ejecutado en contenedor Docker).
    - Gestor de Base de datos (Cliente): MySQL Workbench.
- Backend: PHP (Laravel) o Java (Spring Boot) -> Lo llamaremos "API".
- Frontend: React (o Angular) -> Lo llamaremos "Cliente". Uso de Web Storage API (LocalStorage) para la gestión de datos en modo offline.
- Herramientas: VS Code, Git, Postman (para probar la API).

# ANÁLISIS (”EL CÓMO”):

A continuación, se presenta la propuesta técnica estructurada, basada en el *Stack Tecnológico* (MySQL + Laravel/Spring + React/Angular):

### **1. Modelo de Datos (Diseño de la Base de Datos)**

Aquí definimos la estructura de las tablas en **MySQL**. Es el cimiento de todas las funcionalidades estructurales y de dominio que has definido.

**Tablas Principales (Entidades):**

• **`users` (Usuarios):**

◦ Almacena la identidad.

◦ *Columnas clave:* `id`, `email` (unique), `password` (hash), `role` (ENUM: 'ADMIN', 'COACH', 'ATHLETE'), `first_name`, `avatar_url`.

◦ *Soft Delete:* Incluir columna `deleted_at` para la funcionalidad de "Dar de baja" sin perder integridad histórica.

• **`user_profiles` (Detalles del usuario):**

◦ Separamos los datos médicos/físicos de la cuenta para no sobrecargar la tabla `users`.

◦ *Columnas:* `user_id` (FK), `birth_date`, `height`, `gender`, `bio` (para entrenadores).

• **`exercises` (Biblioteca Global):**

◦ *Columnas:* `id`, `name`, `muscle_group`, `equipment`, `video_url`, `is_custom` (boolean), `created_by` (FK nullable a users),

◦ *Lógica:* Si `is_custom` es false, es visible para todos. Si es true, solo lo ve el `created_by`.

• **`routines` (Cabecera de Rutina):**

◦ *Columnas:* `id`, `name`, `description`, `owner_id` (FK a users - Entrenador o Atleta).

• **`routine_exercises` (Tabla Pivote / Intermedia):**

◦ Aquí ocurre la magia de la "Configuración de series y repeticiones".

◦ *Columnas:* `routine_id`, `exercise_id`, `order_index` (para el reordenamiento), `target_sets`, `target_reps`, `target_rpe`, `rest_seconds`.

• **`sessions` (Entrenamientos realizados):**

◦ *Columnas:* `id`, `user_id`, `routine_id` (nullable, por si es entrenamiento libre), `start_time`, `end_time`, `total_volume`, `notes` (feedback del entrenador).

• **`session_sets` (El registro real):**

◦ *Columnas:* `session_id`, `exercise_id`, `set_number`, `weight_kg`, `reps_performed`, `rpe_actual`.

• **`body_measurements` (Salud y Medidas):**

◦ *Columnas:* `user_id`, `date`, `weight`, `waist`, `chest`, `arm`, `photos_url` (JSON o relación a otra tabla).

• **`coach_client` (Vinculación):**

◦ *Columnas:* `coach_id`, `client_id`, `status` (PENDING, ACTIVE), `started_at`.

- **`messages`(Sistema de Chat):**
    
    ◦ *Columnas:* `id`, `sender_id`(FK users), `content` (texto del mensaje), `is_read` (boolean para notificaciones), `sent_at` (timestamp).
    ◦ Lógica: Permite consultas rápidas para recuperar el hilo de conversación entre dos usuarios específicos.
    

### **2. Arquitectura de la API (Backend):**

Definición de los *Endpoints* RESTful que comunicarán el "Cliente" (React/Angular) con la "API" (Laravel/Spring).

**Autenticación y Usuarios:**

• `POST /api/auth/register`: Valida datos, hashea contraseña y crea usuario.

• `POST /api/auth/login`: Verifica credenciales y devuelve **JWT**.

• `POST /api/auth/password-reset`: Envío de email con token.

• `GET /api/profile`: Devuelve datos del usuario según el token (Middleware auth).

• `PUT /api/profile/avatar`: Recepción de imagen (`multipart/form-data`) y guardado en disco/S3.

**Gestión de Ejercicios (Biblioteca):**

• `GET /api/exercises`: Listado paginado. Acepta filtros query params: `?muscle=chest&q=press`.

• `POST /api/exercises`: Crear ejercicio personalizado (Asigna ID del usuario logueado).

**Rutinas (Core):**

• `GET /api/routines`: Devuelve las rutinas del usuario (o las asignadas por su coach).

• `POST /api/routines`: Crea la cabecera y los detalles en la tabla pivote (Transaction).

• `PUT /api/routines/{id}`: Actualización completa (Nombre + Lista de ejercicios).

**•** `POST /api/routines/{id}`**:** Endpoint especializado para la recepción de entrenamientos por lotes (batch). Recibe un objeto JSON complejo con todos los ejercicios y series realizados en la sesión para procesarlos en una única transacción de base de datos.

**Mensajería y Comunicación:**

• `GET /api/messages/{userId}:` Recupera el historial de conversación con un usuario específico (ej: chat entre yo y mi entrenador).

• `POST /api/messages:` Envía un nuevo mensaje. Recibe el `receiver_id` y el `content` en el cuerpo de la petición.

• `PUT /api/messages/read/{messageId}:` Marca un mensaje específico como leído para actualizar el estado de las notificaciones.

### **3. Lógica de Negocio y Algoritmos**

Detalle de cómo se resuelven los cálculos matemáticos mencionados en tus funcionalidades.

- **Cálculo de 1RM (Estimación de fuerza):**
    
    Para la funcionalidad de "Calculadora de RM" y "Analizador de Fuerza", se implementará la fórmula de Epley en el Backend o como utilidad en el Frontend:$$1RM = Peso \times (1 + \frac{Repeticiones}{30})$$
    
- **Algoritmo de Detección de PR (Récord Personal):**
    
    1. Al recibir una petición `POST /api/sessions`.
    
    2. El sistema itera sobre cada ejercicio realizado.
    
    3. Consulta en la BBDD: `SELECT MAX(weight_kg) FROM session_sets WHERE exercise_id = X AND user_id = Y`.
    
    4. Si `nuevo_peso > max_historico` -> Se marca el set como `is_pr = true` y se devuelve una flag en la respuesta para mostrar el confeti/notificación en el Frontend.
    
- **Seguridad (Middleware):**
    
    • **JWT Guard:** Intercepta cada petición. Decodifica el token. Si expiró -> 401.
    
    • **Role Middleware:** Para rutas críticas (ej: ver clientes), verifica `user.role === 'COACH'`. Si no -> 403 Forbidden.
    
    • **Ownership Policy:** Verifica que `routine.user_id === current_user.id`. Evita que un usuario edite la rutina de otro cambiando el ID en la URL.
    

### **4. Diseño de Interfaz (Frontend UX/UI)**

Estrategia de implementación visual.

**Gestión de Estado (State Management):**

• Se usará un store global (Redux Toolkit para React o NgRx para Angular/Service) para guardar:

◦ `User`: Datos del usuario y Token (para no pedirlo a cada rato).

◦ `ActiveWorkout`: El estado del entrenamiento en curso (para que si recarga la página, no pierda lo que ha anotado).

◦ **Persistencia de sesión activa:** Se implementará un mecanismo que haga un "espejo" del estado del entrenamiento en el `LocalStorage`. Esto permitirá que, si el navegador se cierra o el móvil se queda sin batería durante el entrenamiento, el usuario pueda recuperar exactamente donde estaba al volver a abrir la aplicación.

**Componentes Clave:**

• `<RoutineCard />`: Reutilizable para listas de rutinas.

• `<ExerciseRow />`: Componente complejo con inputs de series, reps y validación en tiempo real.

• `<Chart />`: Wrapper de librería de gráficas (Chart.js o Recharts) para visualizar la "Evolución de Peso" y "Volumen".

**Feedback al Usuario:**

• Implementación de interceptores HTTP (Axios/HttpClient).

◦ Si respuesta es 200 -> Mostrar Toast verde.

◦ Si respuesta es 400 (Validation) -> Pintar bordes rojos en inputs.

◦ Si respuesta es 500 -> Mostrar "Ups, error del servidor".

[Creamos el modelado visual (dibujo), es decir, el diagrama EER con todas las tablas definidas en el análisis. ](Creamos%20el%20modelado%20visual%20(dibujo),%20es%20decir,%20el%20%202f7e8f6ada4d80a6a7c7f65c7769a826.md)