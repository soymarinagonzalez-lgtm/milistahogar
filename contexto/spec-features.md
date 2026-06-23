# Specs de Features — Mi Lista Hogar

---

## spec-home.md — Vista Home (Cargar propiedad)

**Qué hace:** Pantalla de inicio. Embebe el flujo de carga de propiedad directamente en la página sin modal.

**Flujo (happy path):**
1. Usuario ve input de URL con foco automático
2. Pega URL de Zonaprop / Argenprop / MercadoLibre **o** hace clic en un chip de demo
3. Aparece pantalla de "Extrayendo datos..." con skeleton + log animado
4. Se muestran los datos extraídos (mock) en formulario editable
5. Usuario confirma → propiedad guardada → pantalla de éxito con opción "Agregar otra" o "Ver mi lista"

**Criterios de éxito:**
- Input con foco automático al entrar
- Chips de demo funcionan como atajo
- El log de scraping se muestra línea por línea con delays
- El formulario pre-llena todos los campos extraídos
- La propiedad aparece en la lista al confirmar

**Copy clave:**
- Headline: `"¿Encontraste algo que te gustó? Guardalo acá."`
- Subtítulo: `"En segundos tenés precio, fotos, m² y barrio listos para comparar."`
- Eyebrow: `"Compatible con Zonaprop · Argenprop · MercadoLibre"`
- Label demo chips: `"O probá con un ejemplo:"`
- Botón CTA: `"Agregar"`

---

## spec-fichas.md — Vista Fichas (Grid de tarjetas)

**Qué hace:** Muestra todas las propiedades guardadas en un grid responsive de tarjetas.

**Estructura de cada tarjeta (de arriba a abajo):**
1. Barra de color (4px): ámbar = Pendiente, verde = Contactado
2. Foto con badge de estado (esquina superior izquierda)
3. Título (dirección) + Precio en negra sin fondo (misma fila)
4. Barrio (subtítulo gris)
5. Badge Contactado/Pendiente (toggle) + Estrellas (misma fila)
6. Grid de métricas: m², ambientes, piso
7. Descripción/nota en cursiva con borde izquierdo
8. Footer: "Ver Ficha" + íconos editar/eliminar
9. Pie de página discreto: "X propiedades encontradas"

**Estados:**
- Con propiedades: grid normal
- Vacío: ilustración SVG + headline + botón "Cargar primera propiedad"

---

## spec-tabla.md — Vista Tabla

**Qué hace:** Muestra todas las propiedades en formato tabla con filas comparativas.

**Columnas:** Propiedad, Barrio, Precio, Expensas, m², Ambientes, Estado, Acciones

**Funcionalidades:**
- Ordenar por precio, m², expensas, título (clic en encabezado)
- Toggle de contactado inline
- Botón "Ver Ficha" por fila
- Eliminar propiedad

---

## spec-mapa.md — Vista Mapa

**Qué hace:** Muestra propiedades como pins sobre un mapa SVG simulado de Buenos Aires.

**Notas importantes:**
- El mapa es un SVG estático con cuadrícula de calles y nombres de barrios
- No usa Leaflet ni tiles reales (sin API key, sin dependencias externas)
- Los pins son posicionados con `lat`/`lng` que son porcentajes (0-100) dentro del canvas, no coordenadas reales
- Al hacer clic en un pin aparece el panel lateral con el detalle de la propiedad

**Estado actual:** Vista funcional pero limitada. Prioridad baja.

---

## spec-onboarding.md — Onboarding inicial

**Qué hace:** Modal de 3 slides que se muestra una sola vez al usuario nuevo.

**Slides:**
1. 🏠 "Tu lista personal de propiedades" — fondo ámbar/naranja
2. 🗺️ "Visualizá en mapa" — fondo azul
3. ✅ "Seguí tu proceso" — fondo verde

**Lógica:** Se muestra si `localStorage.getItem('milistahogar_onboarding_done')` es null. Al cerrar, guarda `'1'` en esa clave.

**Para resetear en dev:** `localStorage.removeItem('milistahogar_onboarding_done'); location.reload()`

---

## spec-detalle.md — Modal de detalle de propiedad

**Qué hace:** Modal completo con toda la info de una propiedad al hacer clic en "Ver Ficha".

**Contenido:** Galería de fotos, todos los datos, notas editables, toggle de contactado, calificación con estrellas, link a publicación original.
