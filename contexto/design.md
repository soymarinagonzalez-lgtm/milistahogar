# Design System — Mi Lista Hogar

## Paleta de colores

| Token | Valor | Uso |
|---|---|---|
| `brand-primary` | `#805600` | Links, bordes activos, texto de acento marrón |
| `brand-secondary` | `#2c694d` | Verde secundario (no usado en estados) |
| `brand-accent` | `#E8A838` | CTA principal, precio, pins de mapa, ámbar |
| `brand-dark` | `#141b2b` | Texto principal, fondo oscuro en badges |
| `brand-light` | `#f9f9ff` | Fondo general de la app |
| `brand-outline` | `#837563` | Bordes sutiles, texto terciario |
| Verde contactado | `#10B981` | Estado "Contactado" |
| Ámbar pendiente | `#F59E0B` | Estado "Pendiente" |

## Tipografía

- **UI / copy general:** `Inter` (importada de Google Fonts)
- **Datos / números / tabla:** `IBM Plex Mono` (importada de Google Fonts)
- Sin serifs — esta es una herramienta, no una revista.

## Escala tipográfica en uso

| Elemento | Clase Tailwind | Notas |
|---|---|---|
| Título de app (logo) | `text-xl font-bold` | Inter |
| Headline hero (home) | `text-3xl md:text-4xl font-bold` | Inter |
| Título de tarjeta | `font-bold text-medium` | Inter, truncado |
| Precio en tarjeta | `text-sm font-bold` | Inter, negro, sin fondo |
| Datos numéricos | `font-mono text-sm` | IBM Plex Mono |
| Labels / eyebrow | `text-[11px] uppercase tracking-wide` | Inter |
| Texto secundario | `text-xs text-gray-400/500` | Inter |

## Border radius

- Tarjetas: `rounded-lg` (8px)
- Botones: `rounded-lg` (8px)
- Badges/chips: `rounded-md` (6px) o `rounded` (4px)
- Onboarding: `rounded-2xl`

## Espaciado

- Padding de sección: `p-4 md:p-8`
- Gap entre tarjetas: `gap-6`
- Header fijo: `h-16` (64px)

## Componentes de estado en tarjetas

- Barra superior (4px): ámbar si Pendiente, verde si Contactado
- Badge en foto: ámbar/verde con ícono Phone/Check
- Botón inline: toggle Contactado ↔ Pendiente

## Fuentes de imágenes

- Fotos de propiedades: Unsplash (URLs hardcodeadas en mock data)
- Ilustraciones: SVG inline custom estilo undraw (sin dependencias externas)
