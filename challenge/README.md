# Duelist Codex — Challenge 1

Explorador de cartas de **Yu-Gi-Oh!** construido con Angular. Esta primera
entrega cubre dos capacidades: **explorar el catálogo** y **ver el detalle de
una carta**, consumiendo la API pública de [YGOPRODeck](https://ygoprodeck.com/api-guide/).

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

| Uso en la app        | Parámetros            | Ejemplo                         |
| -------------------- | --------------------- | ------------------------------- |
| Catálogo inicial     | `num`, `offset`       | `?num=40&offset=0`              |
| Búsqueda por nombre  | `fname` (difusa)      | `?fname=Dragon`                 |
| Detalle de una carta | `id`                  | `?id=6983839`                   |

Cuando `fname` no encuentra coincidencias, la API responde con un `400`; la app
lo interpreta como "sin resultados" (no como un error a mostrar).

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
- El input usa **two-way binding** `[(ngModel)]` y emite el término con un
  pequeño *debounce* (búsqueda en vivo) y también al presionar Enter.
- El **autofoco** se resuelve con el hook `AfterViewInit` + `viewChild`, no con
  el atributo `autofocus`.
- "Sin resultados" se deriva con una señal `isEmpty` y se distingue del estado
  de error.

**Por qué es buen enfoque.** El *debounce* evita disparar una petición por cada
tecla, reduciendo carga sobre la API y parpadeos en la UI. El autofoco vía
`AfterViewInit` es un uso del ciclo de vida **con criterio**: el foco solo puede
pedirse cuando el elemento nativo ya existe en el DOM, que es justo lo que
garantiza ese hook (más confiable que `autofocus`, que no siempre se respeta al
navegar dentro de una SPA). Tratar "sin resultados" como un estado normal —y no
como un error— comunica mejor lo que pasó.

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
con *deep link* o al refrescar (caso límite de robustez).

### HU-04 — Organizar el detalle en secciones

**Qué.** La información del detalle se separa en secciones (Efecto,
Estadísticas, Precio) a las que se accede de forma independiente mediante
pestañas.

**Cómo.**
- Un componente genérico `app-tabs` + `app-tab-panel` construido con
  **proyección de contenido**.
- `app-tabs` lee sus paneles con `contentChildren(TabPanel)`, arma la fila de
  pestañas a partir del `title` de cada panel y muestra solo el panel activo.
- Ni `Tabs` ni `TabPanel` mencionan cartas, precios ni nada del dominio.

**Por qué es buen enfoque.** El requisito pide un componente **reutilizable que
no dependa de que el contenido sean cartas de Yu-Gi-Oh**. La proyección de
contenido logra exactamente eso: el contenedor solo sabe de "secciones con
título", y el `card-detail` decide qué va adentro. Así las mismas pestañas
sirven para cualquier pantalla futura (un mazo, un perfil, etc.) sin tocar su
código. Además demuestra el acceso a contenido proyectado (`contentChildren`)
que pide la rúbrica.

### HU-05 — Mantener el estado de búsqueda consistente

**Qué.** El término, los resultados, el estado de carga, el error y la carta
seleccionada se manejan de forma centralizada, no con variables sueltas
repartidas por los componentes.

**Cómo.**
- Un único store `CatalogStore` (`providedIn: 'root'`) con **Signals** como
  única herramienta de estado.
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
- **Manejo de errores en el lugar correcto**: el servicio distingue un `400` "sin
  coincidencias" (→ lista vacía) de un fallo real de red (→ estado de error), de
  modo que la UI muestra el mensaje adecuado en cada caso.
- **Nuevo control de flujo** (`@if`, `@for`, `@empty`, `@switch`) en todas las
  plantillas, en lugar de las directivas `*ngIf` / `*ngFor`.
- **Angular 22** con las APIs basadas en señales (`input()`, `output()`,
  `viewChild()`, `contentChildren()`), el estándar actual del framework.

## Estructura

```
src/app/
  core/
    models/card.model.ts
    services/card-api.service.ts     # acceso a la API (HttpClient)
    services/catalog-store.ts        # estado central con Signals
  features/
    catalog/                         # pantalla principal (HU-01/02)
    card-detail/                     # detalle con pestañas (HU-03/04)
  shared/
    search-bar/                      # búsqueda + autofoco
    card-thumb/                      # tarjeta de la grilla
    tabs/                            # pestañas reutilizables (HU-04)
```
