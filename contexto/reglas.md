# Reglas para el agente — Mi Lista Hogar

## Antes de tocar código

1. **Leé `decisiones.md` primero.** Si el cambio pedido contradice una decisión ya tomada, mencionalo antes de ejecutar.
2. **No agregues features fuera de scope** (ver `decisiones.md`). Si se te ocurre algo, anotalo como sugerencia pero no lo implementes.
3. **Para cambios grandes** (más de 3 archivos, o que afecten el flujo principal), proponé un plan antes de ejecutar.
4. **Para cambios pequeños** (copy, color, orden, tamaño), ejecutá directamente sin pedir permiso.

## Reglas de diseño (no negociables)

- ❌ No usar azul (`#0066CC` ni familia) en ningún elemento de UI
- ❌ No agregar gradientes de fondo (los gradientes solo están permitidos en el onboarding)
- ❌ No más de un CTA primario por pantalla
- ✅ El ámbar siempre es `#E8A838` exacto — no usar `brand-accent` si puede variar
- ✅ Números y datos siempre en `font-mono` (IBM Plex Mono)
- ✅ UI y copy siempre en `font-sans` (Inter)
- ✅ Alineación de texto: izquierda salvo que sea un bloque hero centrado

## Reglas de código

- **No dupliques lógica.** Si el mismo comportamiento existe en otro componente, reutilizalo.
- **No rompas el localStorage.** Las claves son:
  - `milistahogar_propiedades` → array de propiedades
  - `milistahogar_onboarding_done` → `'1'` si ya vio el onboarding
- **No hardcodees datos fuera de `initialData.ts`.** Los datos mock van ahí.
- **Componentes principales:**
  - `App.tsx` → estado global, routing entre vistas, navbar
  - `HomeView.tsx` → flujo de carga de propiedad (sin modal)
  - `NuevaPropiedadModal.tsx` → modal alternativo (mantener aunque no se use en home)
  - `OnboardingModal.tsx` → onboarding de primera vez
  - `types.ts` → tipos TypeScript del dominio
  - `initialData.ts` → propiedades mock iniciales

## Reglas de copy

- Tono rioplatense, directo, sin tecnicismos.
- No usar "link" — usar "dirección" o "publicación".
- No usar siglas sin contexto (ZP, AP, ML → Zonaprop, Argenprop, MercadoLibre).
- No hablar en primera persona del sistema ("nosotros") — hablar desde el usuario.
- CTAs en imperativo: "Guardalo", "Agregar", "Ver mi lista".

## Flujo de verificación post-cambio

Después de cualquier cambio, verificar que:
- [ ] El servidor local sigue corriendo sin errores de compilación
- [ ] El toggle Contactado/Pendiente sigue funcionando
- [ ] Las propiedades persisten al recargar (F5)
- [ ] No aparece color azul en ningún lado
- [ ] Hay un solo CTA primario visible en cada pantalla
