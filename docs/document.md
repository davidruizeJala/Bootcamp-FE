docuChallenge 1 — Duelist Codex: Explorador de Cartas
Semana 1 · Fundamentos de Angular
Introducción — ¿Qué es Duelist Codex?
Duelist Codex es la aplicación que el grupo construirá de forma incremental a lo largo de las 4 semanas del módulo.
Es un explorador y constructor de mazos para el juego de cartas Yu-Gi-Oh!, pensado como un proyecto realista
donde cada semana se agrega una capa de complejidad sobre lo ya construido, sin reiniciar el proyecto.
Funcionalidades del producto completo (visión general)
● Explorar el catálogo de cartas disponibles y ver el detalle de cada una (efecto, estadísticas, imagen).
● Buscar y filtrar cartas por nombre, tipo, atributo y otras propiedades.
● Marcar cartas como favoritas para encontrarlas rápidamente después.
● Armar mazos personalizados, agregando y quitando cartas, respetando reglas básicas del juego.
● Guardar y recuperar los mazos creados.
Esta visión es el destino final del proyecto (semana 4). Este challenge — el primero — se enfoca únicamente en las
dos primeras capacidades: explorar el catálogo y ver el detalle de una carta.
¿De dónde vienen los datos?
● Los datos de las cartas (nombre, tipo, atributo, ATK/DEF, texto de efecto e imagen) se obtienen de la API
pública y gratuita de YGOPRODeck: https://db.ygoprodeck.com/api/v7/cardinfo.php.
● Para este challenge alcanza con los parámetros de búsqueda por nombre exacto (name) y búsqueda difusa
(fname); por ejemplo, ?fname=Dragon devuelve todas las cartas cuyo nombre contiene 'Dragon'.
● Cada carta viene con un arreglo card_images del cual se puede tomar la URL de la imagen a mostrar.
● No es necesario ni se espera persistir datos en un backend propio esta semana: favoritos y mazos (que llegarán
en semanas futuras) vivirán primero en el estado de la aplicación.
Objetivo del challenge
Construir la primera versión de Duelist Codex: la pantalla de exploración del catálogo y el detalle de una carta,
consumiendo la API de YGOPRODeck. Las decisiones de implementación (qué tipo de binding usar en cada caso,
qué hook del ciclo de vida aplicar, cómo manejar el estado, etc.) quedan a criterio de cada estudiante — lo
importante es resolver bien el problema y poder justificar las decisiones tomadas.
Duración
3 días. Se presenta al finalizar el día 3 (demo en vivo + explicación de código, 5 minutos aproximadamente).
Expectativas técnicas del challenge
A lo largo de la aplicación —no necesariamente una por historia— se espera que el proyecto en su conjunto
demuestre uso correcto de:
● Componentes bien delimitados (standalone), con responsabilidades claras.
● Distintos tipos de data binding donde tengan sentido (interpolación, property, event, two-way).
● Al menos un servicio dedicado al acceso a datos (la UI no debe llamar directamente a HttpClient).
● El nuevo control de flujo (@if, @for, @switch, @empty) en lugar de *ngIf/*ngFor.
● Comunicación entre componentes (inputs/outputs, y acceso directo a hijos o a contenido proyectado donde el
caso lo amerite).
● Al menos un hook del ciclo de vida usado con criterio (no por obligación, sino donde resuelva un problema
real de la app).
● Manejo de estado explícito y consciente: cada equipo/estudiante debe elegir entre BehaviorSubject (RxJS) o
Signals para representar el estado de la búsqueda y del catálogo, y debe poder explicar por qué eligió esa
herramienta y no la otra. No se pide usar ambas para lo mismo.

Nota: las historias de usuario describen QUÉ debe hacer la aplicación desde la perspectiva de quien la usa. CÓMO
resolverlo técnicamente es una decisión de diseño que cada estudiante debe tomar y sustentar en la presentación.
Historias de usuario
HU-01 — Ver catálogo de cartas
Como duelista que abre la aplicación, quiero ver una grilla con las cartas disponibles, incluyendo su imagen, nombre
y tipo, para poder explorar el catálogo general antes de buscar algo específico.
Criterios de aceptación:
● Al cargar la vista principal se muestra un conjunto de cartas obtenidas desde la API de YGOPRODeck.
● Cada carta en la grilla muestra al menos su imagen, nombre y tipo.
● Si por alguna razón no hay cartas para mostrar, la persona usuaria ve un mensaje claro en vez de una pantalla
en blanco.
● Mientras los datos se están cargando, hay alguna señal visual de que la app está trabajando (no una pantalla
congelada o vacía sin explicación).
HU-02 — Buscar cartas por nombre
Como duelista, quiero escribir el nombre (total o parcial) de una carta y obtener los resultados que coincidan, para
encontrar rápidamente la carta que quiero revisar sin recorrer todo el catálogo.
Criterios de aceptación:
● Existe un campo de búsqueda visible y accesible desde la pantalla principal.
● Al buscar, la aplicación consulta la API con el término ingresado y actualiza el catálogo mostrado con los
resultados.
● Si la búsqueda no encuentra ninguna carta, se informa explícitamente en vez de mostrar una grilla vacía sin
contexto.
● Al entrar a la pantalla, el campo de búsqueda queda listo para que la persona usuaria empiece a escribir de
inmediato, sin pasos adicionales.
HU-03 — Ver el detalle de una carta
Como duelista, quiero seleccionar una carta del catálogo y ver toda su información (efecto, ATK/DEF, tipo,
atributo), para decidir si la carta me interesa para un futuro mazo.
Criterios de aceptación:
● Al seleccionar una carta desde el catálogo, se muestra una vista de detalle con su información completa
provista por la API.
● La vista de detalle indica claramente a qué carta corresponde (imagen y nombre visibles).
● La persona usuaria puede volver del detalle al catálogo sin perder el contexto de su búsqueda anterior (ej. el
término buscado sigue ahí).
HU-04 — Organizar el detalle en secciones
Como duelista, quiero que la información de esa vista de detalle (la de HU-03) esté organizada en secciones — por
ejemplo su efecto, sus estadísticas y su precio de referencia — en lugar de un solo bloque de texto, para no sentirme
abrumado por un bloque enorme de texto y datos mezclados.
Criterios de aceptación:
● La información de la carta en el detalle está organizada en secciones o bloques claramente diferenciados (por
ejemplo: Efecto, Estadísticas, Precio).
● La persona usuaria puede identificar y acceder a cada sección de forma independiente (pestañas, acordeón, o el
mecanismo que el estudiante elija).
● El componente que organiza estas secciones está diseñado para ser reutilizable: no debería depender de que el
contenido sea específicamente 'cartas de Yu-Gi-Oh'.
HU-05 — Mantener el estado de búsqueda de forma consistente

Como duelista, quiero que la aplicación recuerde de forma consistente qué estoy buscando (HU-02), si hay una
carga en curso (HU-01), y qué carta tengo seleccionada (HU-03), para tener una experiencia fluida sin resultados
inconsistentes o pantallas que 'parpadean'.
Criterios de aceptación:
● El estado de la búsqueda (término, resultados, carga, error) se maneja de forma centralizada y explícita, no con
variables sueltas repetidas en varios componentes.
● El estudiante elige una única herramienta para este manejo de estado —BehaviorSubject o Signals— y la
aplica de forma consistente en toda la funcionalidad de búsqueda.
● En la presentación, el estudiante explica por qué eligió esa herramienta para este caso puntual (qué ventaja le
vio frente a la alternativa).
Rúbrica de evaluación
Criterio Insuficiente (1) En desarrollo (2) Competente (3) Excelente (4)
Aplica
| No sigue | Sigue algunas | convenciones de | Convenciones |
| --------- | -------------- | ---------------- | ------------- |
convenciones; convenciones pero estilo Angular, consistentes en todo
| código desordenado, | con inconsistencias | nombres claros, y | el proyecto, |
| -------------------- | -------------------- | ------------------ | ------------- |
Buenas prácticas nombres poco (ej. servicio separa estructura de
claros, lógica de parcialmente usado, correctamente carpetas clara, sin
datos mezclada con binding mezclado componentes, código muerto ni
el componente. sin criterio). servicios y lógica duplicada.
templates.
Se evidencia uso
| | | correcto y con | Además de lo |
| --- | ----------------- | ------------------- | ------------- |
| | Usa parcialmente | criterio propio de | anterior, el |
No se evidencia el los conceptos vistos; binding, servicios, estudiante puede
uso de los conceptos la solución funciona control de flujo, argumentar con
Aplicación de lo
de la semana, o se pero con decisiones comunicación entre solidez por qué
aprendido
usan de forma técnicas poco componentes y tomó cada decisión
| incorrecta. | justificadas o | manejo de estado | técnica y qué |
| ------------ | ---------------- | -------------------- | -------------- |
| | inconsistentes. | (con una | alternativas |
| | | herramienta elegida | consideró. |
y sostenida).
| | | Las 5 historias de | Cumple todas las |
| --- | --- | ------------------- | ----------------- |
Funciona
| El challenge no | | usuario están | historias y maneja |
| ---------------- | --- | -------------- | ------------------- |
parcialmente;
| funciona o falla en | | implementadas y | casos límite de |
| -------------------- | --- | ---------------- | ---------------- |
alguna historia de
| casos básicos | | funcionan sin | forma robusta (ej. |
| -------------- | --- | -------------- | ------------------- |
Funcionalidad usuario no está
| (búsqueda, detalle, | | errores evidentes, | búsquedas sin |
| -------------------- | --- | ------------------- | -------------- |
completa o tiene
| estados de | | incluyendo estados | resultados, cartas |
| ----------- | --- | ------------------- | ------------------- |
bugs visibles en el
| carga/error). | | de carga, error y | sin imagen, API |
| -------------- | --- | ------------------ | ---------------- |
flujo principal.
| | | vacío. | lenta). |
| --- | ----------------- | ----------------- | ----------------- |
| | Código funcional | Código legible y | Código modular y |
Código duplicado, pero con modular; servicio reutilizable (como el
sin manejo de duplicación, falta de separado del componente de
Calidad de código errores, difícil de manejo de errores o componente; secciones de HU-
leer, suscripciones suscripciones suscripciones 04), con manejo de
sin liberar. potencialmente no manuales liberadas errores consistente
| | liberadas. | cuando corresponde. | en toda la app. |
| --- | ----------- | -------------------- | ---------------- |
Presentación / No puede explicar Explica el código de Explica con claridad Presentación clara y
comunicación las decisiones forma superficial o las decisiones fluida, anticipa

Criterio Insuficiente (1) En desarrollo (2) Competente (3) Excelente (4)
tomadas ni el con inseguridad; no técnicas, demuestra preguntas, compara
código durante la logra justificar por las 5 historias de su decisión frente a
demo. qué tomó ciertas usuario funcionando la alternativa no
| decisiones técnicas. | y justifica el | elegida, y propone |
| --------------------- | ------------------ | ------------------- |
| | enfoque elegido | mejoras para la |
| | para el manejo de | semana 2. |
estado.
Entrega
● Repositorio (o carpeta) versionado con el código fuente del proyecto.
● README breve con instrucciones para ejecutar el proyecto y qué endpoint(s) de la API se usan.
● Demo en vivo al finalizar el día 3, mostrando las 5 historias de usuario en funcionamiento.
