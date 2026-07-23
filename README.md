# Duelist Codex — Challenge 2

Explorador de cartas de **Yu-Gi-Oh!** construido con Angular, continuación
directa del Challenge 1. Sobre el catálogo y el detalle ya existentes, esta
entrega agrega **navegación real por rutas** (incluyendo rutas hijas y una
sección protegida), un **resolver** para el detalle, una **directiva** y un
**pipe** propios. Consume la API pública de
[YGOPRODeck](https://ygoprodeck.com/api-guide/).

## Requisitos

- **Node.js** ≥ 24.15 (o ≥ 22.22) — requerido por Angular 22.
- **npm** ≥ 10.

## Cómo ejecutar

```bash
npm install      # instala dependencias
npm start        # levanta el servidor de desarrollo
```

Luego abre `http://localhost:4200/`. La app recarga sola al guardar cambios.

Otros comandos:

```bash
npm run build    # build de producción en dist/
npm test         # pruebas unitarias con Vitest
```

## API utilizada

Endpoint base: `https://db.ygoprodeck.com/api/v7/cardinfo.php`

| Uso en la app        | Parámetros       | Ejemplo            |
| -------------------- | ---------------- | ------------------ |
| Catálogo inicial     | `num`, `offset`  | `?num=40&offset=0` |
| Búsqueda por nombre  | `fname` (difusa) | `?fname=Dragon`    |
| Detalle de una carta | `id`             | `?id=6983839`      |

Cuando `fname` no encuentra coincidencias, la API responde con un `400`; la app
lo interpreta como "sin resultados" (no como un error a mostrar).

## Mapa de rutas (Challenge 2)

| Ruta                     | Componente       | Notas                                              |
| ------------------------ | ---------------- | -------------------------------------------------- |
| `/`                      | `CatalogPage`    | Catálogo + búsqueda (HU-01/02)                     |
| `/card/:id`              | `CardDetailPage` | Detalle; `resolve: { card: cardResolver }` (HU-04) |
| `/card/:id/efecto`       | `EffectSection`  | Ruta hija — efecto de la carta (HU-02)             |
| `/card/:id/estadisticas` | `StatsSection`   | Ruta hija — ATK/DEF/tipo/atributo (HU-02)          |
| `/card/:id/precio`       | `PriceSection`   | Ruta hija — precios de referencia (HU-02)          |
| `/coleccion`             | `CollectionPage` | `canActivate: [aliasGuard]` — favoritos (HU-03/05) |
| `/perfil`                | `ProfilePage`    | Configurar el alias de duelista (HU-03)            |
| `**`                     | → `/`            | Comodín                                            |

`/card/:id` redirige a `efecto` por defecto. Entrar directo a una sub-ruta
(p. ej. `/card/6983839/precio`) funciona sin pasos intermedios.

### Novedades de Challenge 2

- **Child routing (HU-02):** las secciones del detalle (Efecto / Estadísticas /
  Precio) son **rutas hijas** con un `<router-outlet>` anidado; cambiar de
  sección actualiza la URL sin perder la carta. Reemplaza a las pestañas por
  proyección de contenido del Challenge 1.
- **Resolver (HU-04):** `cardResolver` obtiene la carta **antes** de activar la
  vista. Si el `id` no existe o la petición falla, devuelve un `RedirectCommand`
  al catálogo en lugar de mostrar una pantalla en blanco.
- **Guard (HU-03):** `` aliasGuardprotege `/coleccion`. Si no hay un alias de
  duelista configurado, redirige a `/perfil`; una vez configurado, el acceso es
  directo durante la sesión. El estado (alias + favoritos) vive en `ProfileStore`
  con Signals.
- **Directiva de atributo (HU-05):** `[appHighlightAtk]` resalta las cartas cuyo
  ATK supera un umbral configurable (`[threshold]`, por defecto 2500). Se aplica
  igual en el catálogo y en la colección, sin duplicar lógica.
- **Pipe propio:** `statValue` formatea ATK/DEF (separador de miles) y muestra
  `—` cuando la carta no tiene ese valor (magias/trampas).
- **Favoritos:** cada tarjeta tiene un botón ♥ que alterna la carta en la
  colección personal.

## Historias de usuario: qué se hizo y por qué

Para cada historia se describe **qué** se implementó, **cómo** (la decisión de
diseño) y **por qué** es un buen enfoque.

### HU-01 — Ver catálogo de cartas

**Qué.** Al abrir la app se muestra una grilla de cartas con imagen, nombre y
tipo. Mientras carga hay un spinner; si no hay datos o falla la conexión se
muestra un mensaje claro en vez de una pantalla en blanco.

**Cómo.**

- El catálogo inicial se pide con `?num=40&offset=0` en lugar de traer las ~13k
  cartas del endpoint sin parámetros.
- La plantilla usa `@switch (store.status())` para dibujar exactamente uno de los
  estados `loading` / `error` / `success`, y dentro del éxito un `@for … @empty`.
- El componente `CatalogPage` dispara la carga en `ngOnInit`.

**Por qué es buen enfoque.** Traer solo 40 cartas mantiene la primera carga
liviana y rápida. Modelar la vista como una **máquina de estados** (`loading`,
`success`, `empty`, `error`) evita el bug clásico de "grilla vacía sin
explicación": cada estado tiene su propia salida visual. `ngOnInit` es el hook
correcto para efectos de inicialización porque la carga no depende del DOM, solo
de que el componente exista.

### HU-02 — Buscar cartas por nombre

**Qué.** Un campo de búsqueda visible en la pantalla principal, enfocado
automáticamente al entrar, que consulta la API por nombre parcial y actualiza la
grilla. Si no hay coincidencias se informa explícitamente.

**Cómo.**

- Búsqueda difusa con el parámetro `fname`.
- El input usa un **`model()`** (señal de two-way binding) en lugar de
  `[(ngModel)]`: el padre enlaza `[term]` para sembrar el valor guardado y
  escucha `(termChange)` para recibir el término. Así **no se depende de
  `FormsModule`**.
- La búsqueda se dispara **al enviar el formulario** (Enter o botón "Buscar"): el
  input se escribe de forma nativa y el valor se confirma en `submit()`, leyéndolo
  del elemento con `viewChild.required`.
- El **autofoco** se resuelve con el hook `AfterViewInit` + `viewChild.required`,
  no con el atributo `autofocus`.
- "Sin resultados" se deriva con una señal `isEmpty` y se distingue del estado
  de error.

**Por qué es buen enfoque.** Un único `model()` reemplaza al par `input` +
`output` y a la señal local, dejando **una sola fuente de verdad** para el
término y eliminando una dependencia (`FormsModule`). Buscar **al enviar** hace
la acción explícita y evita disparar una petición por cada tecla sin necesidad de
lógica de _debounce_. El autofoco vía `AfterViewInit` es un uso del ciclo de vida
**con criterio**: el foco solo puede pedirse cuando el elemento nativo ya existe
en el DOM, que es justo lo que garantiza ese hook (más confiable que `autofocus`,
que no siempre se respeta al navegar dentro de una SPA), y `viewChild.required`
declara que ese elemento siempre existe. Tratar "sin resultados" como un estado
normal —y no como un error— comunica mejor lo que pasó.

### HU-03 — Ver el detalle de una carta

**Qué.** Al hacer clic en una carta se abre una vista de detalle con su
información completa (efecto, ATK/DEF, tipo, atributo), con imagen y nombre
visibles. Al volver, el catálogo conserva la búsqueda previa.

**Cómo.**

- Navegación con **Angular Router**: rutas `''` (catálogo) y `card/:id` (detalle).
- El `id` de la ruta entra al componente como `input()` gracias a
  `withComponentInputBinding()`.
- Si se llega desde la grilla, la carta ya está en el store y se muestra al
  instante; si se entra por URL directa o tras refrescar, se pide por `id`.
- El término y los resultados viven en el store (singleton), así que "volver" no
  vuelve a buscar.

**Por qué es buen enfoque.** Usar el router (en vez de alternar vistas con un
booleano) da URLs reales, botón "atrás" del navegador y enlaces directos al
detalle, y aprovecha el `router-outlet` que ya venía en el proyecto. Como el
estado de búsqueda es central y sobrevive a la navegación, **conservar el
contexto es gratis**: no hace falta pasar datos entre pantallas ni recargar la
búsqueda. Poder resolver el detalle por `id` hace que la vista funcione incluso
con _deep link_ o al refrescar (caso límite de robustez).

### HU-04 — Organizar el detalle en secciones

**Qué.** La información del detalle se separa en secciones (Efecto,
Estadísticas, Precio) a las que se accede de forma independiente mediante
pestañas.

**Cómo.**

- Un componente genérico `app-tabs` + `app-tab-panel` construido con
  **proyección de contenido**.
- `app-tabs` lee sus paneles con `contentChildren(TabPanel)`, arma la fila de
  pestañas a partir del `title` de cada panel y expone el panel activo como
  **estado derivado** (`activePanel = computed(...)`).
- Cada `TabPanel` deriva su propio `active` inyectando el contenedor
  (`inject(Tabs)`) y comparándose con `activePanel()`; nadie le "empuja" el
  estado desde afuera.
- Ni `Tabs` ni `TabPanel` mencionan cartas, precios ni nada del dominio.

**Por qué es buen enfoque.** El requisito pide un componente **reutilizable que
no dependa de que el contenido sean cartas de Yu-Gi-Oh**. La proyección de
contenido logra exactamente eso: el contenedor solo sabe de "secciones con
título", y el `card-detail` decide qué va adentro. Así las mismas pestañas
sirven para cualquier pantalla futura (un mazo, un perfil, etc.) sin tocar su
código. Además demuestra el acceso a contenido proyectado (`contentChildren`)
que pide la rúbrica. Modelar la visibilidad como **estado derivado con
`computed`** —en vez de un `effect()` que escriba señales en los hijos— sigue la
guía de Angular (preferir `computed` para estado derivado y reservar `effect`
para efectos secundarios reales): el flujo es en una sola dirección y sin
escrituras imperativas.

### HU-05 — Mantener el estado de búsqueda consistente

**Qué.** El término, los resultados, el estado de carga, el error y la carta
seleccionada se manejan de forma centralizada, no con variables sueltas
repartidas por los componentes.

**Cómo.**

- Un único store `CatalogStore` (`@Service()`, singleton de raíz) con **Signals**
  como única herramienta de estado.
- Los componentes leen señales de solo lectura (`term`, `cards`, `status`,
  `selected`, `isEmpty`…) y llaman a métodos del store (`search`, `select`,
  `loadCardById`).
- `CatalogPage` y `CardDetailPage` no guardan estado propio: son contenedores.

**Por qué se eligió Signals (y no BehaviorSubject).** El estado aquí es **estado
local de la UI que se lee de forma síncrona en las plantillas**. Con Signals eso
se hace directo (`store.cards()`), sin `async` pipe y sin suscripciones que haya
que liberar manualmente, por lo que hay menos código repetitivo y menos riesgo
de fugas. `BehaviorSubject` brilla cuando se necesitan **operadores de stream**
(combinar flujos, `switchMap`, backpressure); en este caso ese poder no se
aprovecha y solo agregaría ceremonia. Las únicas suscripciones del proyecto son
a los observables de `HttpClient`, que emiten una vez y completan solos. Tener
**una sola fuente de verdad** es lo que hace que HU-01, HU-02 y HU-03 encajen sin
esfuerzo: el spinner, los resultados y la selección nunca quedan
"desincronizados" entre componentes ni provocan parpadeos.

## EXTRA — Paginación del catálogo y la búsqueda

> No forma parte de las historias pedidas; se agregó como mejora propia para
> poder recorrer todo el catálogo, no solo las primeras 40 cartas.

**Qué.** El catálogo (y también la búsqueda por nombre) se recorre por páginas:
debajo de la grilla hay un paginador numérico con "‹ Anterior", números de página
y "Siguiente ›". Al elegir una página se cargan solo sus cartas y se sube al
inicio de la grilla.

**Cómo.**

- **Paginación del lado del servidor**: la API de YGOPRODeck acepta `num`/`offset`
  y devuelve en `meta.total_rows` el total de la consulta. Se piden **40 cartas
  por página**; nunca se traen las ~14 000.
- El total solo se usa para calcular cuántas páginas hay
  (`totalPages = ceil(total / 40)`); no se cargan todas por adelantado.
- El estado de página vive en el `CatalogStore` (`page`, `total` y el derivado
  `totalPages`). Un único método privado `fetchPage()` sirve tanto al catálogo
  como a la búsqueda (según haya término o no) y lo comparten `loadInitial`,
  `search` y `goToPage`.
- El paginador es un componente reutilizable y agnóstico del dominio
  (`app-pagination`): recibe `page` y `totalPages`, emite `pageChange`, y muestra
  una **ventana con elipsis** (`1 … 6 7 8 … 325`) para no dibujar cientos de
  botones.

**Por qué es buen enfoque.** Paginar **del lado del servidor** mantiene cada carga
liviana (40 cartas) sin importar que el catálogo tenga miles: es lo correcto
cuando el conjunto total no cabe cómodamente en memoria/UI. Guardar la página en
el store —y no en la URL— reutiliza la "única fuente de verdad" de HU-05, así que
**volver del detalle conserva también la página** sin trabajo extra. Un paginador
numérico con ventana y elipsis es claro, accesible y predecible; se prefirió al
_scroll infinito_, que además de más complejo choca con la restauración de scroll
al navegar dentro de la SPA.

## Decisiones técnicas transversales

Estas decisiones no pertenecen a una historia en particular, sino al proyecto en
conjunto (las decisiones específicas de cada historia están arriba):

- **Componentes standalone** con responsabilidades claras, organizados en
  `core/` (modelos y servicios), `features/` (pantallas contenedoras) y
  `shared/` (componentes de presentación reutilizables). Separar presentación de
  datos mantiene los componentes simples y testeables.
- **Una capa de datos** (`CardApiService`) como único punto que usa `HttpClient`:
  la UI nunca llama a la API directamente. Si mañana cambia el endpoint o se
  agrega caché, se toca un solo archivo.
- **Servicios con `@Service()`**, el decorador introducido en Angular 22 para
  clases de servicio (auto-provistas en la raíz por defecto), en lugar de
  `@Injectable({ providedIn: 'root' })`. Mismo comportamiento, menos ceremonia.
- **Manejo de errores en el lugar correcto**: el servicio distingue un `400` "sin
  coincidencias" (→ lista vacía) de un fallo real de red (→ estado de error), de
  modo que la UI muestra el mensaje adecuado en cada caso.
- **Nuevo control de flujo** (`@if`, `@for`, `@empty`, `@switch`) en todas las
  plantillas, en lugar de las directivas `*ngIf` / `*ngFor`.
- **Angular 22** con las APIs basadas en señales (`input()`, `output()`,
  `model()`, `viewChild()`, `contentChildren()`, `computed()`), el estándar
  actual del framework.

## Mejoras e iteración sobre la primera versión

Tras la entrega inicial se revisó el código buscando el idioma más actual de
Angular 22 y menos acoplamiento. Los cambios (antes → después):

### Búsqueda (HU-02): de `[(ngModel)]` a `model()`

- **Antes:** el input usaba `[(ngModel)]` (con `FormsModule`) y emitía el término
  en vivo con _debounce_ mediante un `output` aparte, más una señal local para el
  texto.
- **Después:** un único **`model()`** de two-way binding sustituye al par
  `input` + `output` y a la señal local. Se elimina la dependencia de
  `FormsModule` y la búsqueda pasa a confirmarse **al enviar** (Enter/botón),
  leyendo el valor con `viewChild.required`. Menos piezas y una sola fuente de
  verdad para el término.

### Pestañas (HU-04): de `effect()` a estado derivado

- **Antes:** un `effect()` en `Tabs` **empujaba** el estado `active` a cada panel
  (propagación de estado dentro de un efecto, un patrón que la documentación de
  Angular desaconseja).
- **Después:** `Tabs` expone `activePanel` como **`computed`** y cada `TabPanel`
  **deriva** su propio `active` inyectando el contenedor (`inject(Tabs)`). Estado
  derivado puro, sin escrituras imperativas ni `effect()`.

### Servicios: de `@Injectable` a `@Service()`

- **Antes:** `@Injectable({ providedIn: 'root' })` en `CardApiService` y
  `CatalogStore`.
- **Después:** **`@Service()`**, el decorador nuevo de Angular 22 para servicios
  (auto-provistos en la raíz por defecto). Comportamiento idéntico, menos
  ceremonia; es además lo que genera hoy `ng generate service`.

## Estructura

```
src/app/
  core/
    models/card.model.ts
    services/card-api.service.ts     # acceso a la API (HttpClient)
    services/catalog-store.ts        # estado del catálogo con Signals
    services/profile-store.ts        # alias + favoritos con Signals
    resolvers/card.resolver.ts       # carga la carta antes del detalle (HU-04)
    guards/alias.guard.ts            # protege /coleccion (HU-03)
  features/
    catalog/                         # pantalla principal (HU-01/02)
    card-detail/                     # detalle con rutas hijas (HU-02)
      sections/                      # efecto / estadísticas / precio
    collection/                      # Mi colección — favoritos (HU-03/05)
    profile/                         # configurar alias (HU-03)
  shared/
    search-bar/                      # búsqueda + autofoco
    card-thumb/                      # tarjeta de la grilla + favorito
    pagination/                      # paginador numérico reutilizable (EXTRA)
    directives/highlight-atk.directive.ts  # resalta cartas por ATK (HU-05)
    pipes/stat-value.pipe.ts               # formatea ATK/DEF
```
