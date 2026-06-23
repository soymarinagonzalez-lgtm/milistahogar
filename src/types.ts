/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Moneda = 'USD' | 'ARS';

export type Plataforma = 'zonaprop' | 'argenprop' | 'mercadolibre' | 'manual';

export type EstadoPropiedad = 'Contactado' | 'Pendiente';

export interface Propiedad {
  id: string;
  titulo: string;
  precio: number;
  moneda: Moneda;
  expensas: number | null;
  direccion: string;
  barrio: string;
  m2_totales: number | null;
  m2_cubiertos: number | null;
  ambientes: number | string;
  dormitorios: number | null;
  banos: number | null;
  orientacion: string | null;
  piso: string | null;
  tiene_ascensor: boolean | null;
  antiguedad: string | null;
  fotos: string[];
  descripcion: string;
  url_original: string;
  plataforma: Plataforma;
  estado: EstadoPropiedad;
  contactado: boolean;
  calificacion: number; // 1 to 5 stars
  notas: string;
  lat: number; // For position on mock map (percentage top, 0-100)
  lng: number; // For position on mock map (percentage left, 0-100)
  fecha_agregado: string;
}
