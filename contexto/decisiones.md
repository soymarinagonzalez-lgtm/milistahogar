# Decisiones — Mi Lista Hogar

## Qué NO se delega al agente

- **El happy path:** el usuario pega una URL → se simulan datos extraídos → aparece el formulario de edición → se guarda en la lista. Este flujo no se cambia sin aprobación explícita.
- **La paleta de colores:** no se agregan colores fuera del design system. Especialmente: no usar azul (#0066CC ni familia) en ningún elemento de UI.
- **Qué cuenta como éxito:** una propiedad guardada correctamente en localStorage con todos sus campos.
- **El orden de las vistas:** Cargar propiedad → Tabla → Fichas → Mapa (Mapa al final por ser la menos relevante).

## Decisiones de producto ya tomadas

| Decisión | Razonamiento |
|---|---|
| La home embebe el formulario (sin modal) | El modal era un nivel de fricción innecesario para la acción principal |
| El precio va al lado del título en las tarjetas | Mayor jerarquía visual, no compite con la foto |
| Las estrellas van en la misma fila que el badge Contactado | Agrupa la info de evaluación personal |
| El contador de propiedades va al pie de la grilla | Menos jerarquía, no compite con el contenido |
| La barra de info superior fue eliminada | Estaba vacía y agregaba ruido visual |
| Mapa es la última vista del navbar | Es la menos usada en el flujo cotidiano |
| El botón "Cargar propiedad" solo existe en el navbar (no duplicado en header) | Un solo CTA primario por pantalla |

## Qué es éxito en este producto

1. El usuario puede completar el flujo de inicio a fin sin que se rompa.
2. El toggle de estado (Contactado / Pendiente) funciona y se refleja visualmente.
3. Las notas se guardan con autosave (sin botón explícito de guardar).
4. Los datos persisten al recargar la página (localStorage).
5. El diseño se ve limpio en desktop (responsive móvil es secundario).

## Scope actual (v1)

**Incluido:**
- Cargar propiedad (simulado / mock scraping)
- Vista Tabla comparativa
- Vista Fichas (grid de tarjetas)
- Vista Mapa (mock con SVG, sin Leaflet real)
- Modal de detalle de propiedad
- Onboarding de 3 slides (primera vez)
- Empty state con ilustración

**Fuera de scope (v2 en adelante):**
- Login / autenticación
- Backend real
- Scraping real de URLs
- Mapa con tiles reales (Leaflet + OpenStreetMap)
- Filtros activos (la barra de filtros fue desactivada)
- Compartir lista con otros usuarios
- Estado "Descartada" (está en el design system original pero no implementado)
