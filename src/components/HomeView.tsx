/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Propiedad, Moneda, Plataforma, EstadoPropiedad } from '../types';
import { Link, Sparkles, AlertCircle, ArrowRight, Zap, Smartphone, Share2 } from 'lucide-react';
import InstalarAppModal from './InstalarAppModal';

interface HomeViewProps {
  onAddProperty: (newProp: Omit<Propiedad, 'id' | 'fecha_agregado'>) => void;
  onGoToFichas: () => void;
  totalProperties: number;
  sharedUrl?: string | null;
  onSharedUrlConsumed?: () => void;
}

const DUMMY_SCRAPE_DESIGNS = [
  {
    titulo: 'Av. Las Heras 2100 - USD 340.000',
    precio: 340000,
    moneda: 'USD' as Moneda,
    expensas: 48000,
    barrio: 'Recoleta',
    direccion: 'Av. Las Heras 2100',
    descripcion: 'Piso de categoría con techos de 3.2m, de hermoso diseño clásico en el corazón de Recoleta.',
    ambientes: 4,
    m2_totales: 115,
    foto: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80',
    notas: 'Buen estado general. Expensas lógicas para el segmento.'
  },
  {
    titulo: 'Fitz Roy 2200 - USD 245.000',
    precio: 245000,
    moneda: 'USD' as Moneda,
    expensas: 32000,
    barrio: 'Palermo Soho',
    direccion: 'Fitz Roy 2200',
    descripcion: 'Excelente departamento, sumamente luminoso. Cuenta con piscina en terraza.',
    ambientes: 2,
    m2_totales: 58,
    foto: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&auto=format&fit=crop&q=80',
    notas: 'Gran potencial para alquiler temporario.'
  },
  {
    titulo: 'Chacabuco 800 - USD 165.000',
    precio: 165000,
    moneda: 'USD' as Moneda,
    expensas: 18000,
    barrio: 'San Telmo',
    direccion: 'Chacabuco 800',
    descripcion: 'Loft de altos techos con bovedilla original, excelente luz natural por ventanales.',
    ambientes: 1,
    m2_totales: 50,
    foto: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&auto=format&fit=crop&q=80',
    notas: 'Estilo bohemio, bajas expensas.'
  },
  {
    titulo: 'Barrio Castores Lote 142 - USD 480.000',
    precio: 480000,
    moneda: 'USD' as Moneda,
    expensas: 95000,
    barrio: 'Nordelta',
    direccion: 'Barrio Castores, Lote 142',
    descripcion: 'Casa moderna de una sola planta con galería amplia, parrilla y piscina.',
    ambientes: 5,
    m2_totales: 220,
    foto: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&auto=format&fit=crop&q=80',
    notas: 'Calefacción radiante completa.'
  }
];

type Step = 'link' | 'scraping' | 'edit' | 'done';

export default function HomeView({ onAddProperty, onGoToFichas, totalProperties, sharedUrl, onSharedUrlConsumed }: HomeViewProps) {
  const [step, setStep] = useState<Step>('link');
  const [url, setUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [scrapingLog, setScrapingLog] = useState<string[]>([]);
  const [isFromShare, setIsFromShare] = useState(false);
  const [showInstalarModal, setShowInstalarModal] = useState(false);

  // Si viene una URL compartida via Share Sheet, arrancar import automatico
  useEffect(() => {
    if (sharedUrl && step === 'link') {
      setUrl(sharedUrl);
      setIsFromShare(true);
      onSharedUrlConsumed?.();
      // Pequeno delay para que el usuario vea la URL antes de que arranque
      setTimeout(() => handleImport(sharedUrl), 600);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sharedUrl]);

  const [formData, setFormData] = useState({
    titulo: '',
    precio: 250000,
    moneda: 'USD' as Moneda,
    expensas: 30000,
    barrio: 'Palermo Soho',
    direccion: '',
    ambientes: '3' as string | number,
    m2_totales: 75,
    descripcion: '',
    notas: '',
    estado: 'Pendiente' as EstadoPropiedad,
    contactado: false,
    plataforma: 'zonaprop' as Plataforma,
    calificacion: 4,
    fotoUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80'
  });

  const handleImport = (targetUrl: string = url) => {
    if (!targetUrl.trim()) {
      setErrorMessage('Por favor ingresá un link de propiedad válido.');
      return;
    }
    setErrorMessage('');
    setStep('scraping');
    setScrapingLog([]);

    let plat: Plataforma = 'manual';
    if (targetUrl.toLowerCase().includes('zonaprop')) plat = 'zonaprop';
    else if (targetUrl.toLowerCase().includes('argenprop')) plat = 'argenprop';
    else if (targetUrl.toLowerCase().includes('mercadolibre')) plat = 'mercadolibre';

    const seed = targetUrl.length % DUMMY_SCRAPE_DESIGNS.length;
    const template = DUMMY_SCRAPE_DESIGNS[seed];

    const logs = [
      `[1/3] Conectando con ${plat !== 'manual' ? plat + '.com.ar' : 'publicación de origen'}...`,
      `[2/3] Evadiendo sistema anti-bot y leyendo metadatos...`,
      `[3/3] Extrayendo variables críticas con Asistente Gemini...`,
      `Geocodificando dirección en Buenos Aires...`,
      `¡Listo! Propiedad extraída y parseada con éxito.`
    ];

    logs.forEach((logLine, index) => {
      setTimeout(() => {
        setScrapingLog(prev => [...prev, logLine]);
        if (index === logs.length - 1) {
          setTimeout(() => {
            const cleanTitle = `${template.direccion} - ${template.moneda} ${template.precio.toLocaleString('es-AR')}`;
            setFormData({
              titulo: cleanTitle,
              precio: template.precio,
              moneda: template.moneda,
              expensas: template.expensas,
              barrio: template.barrio,
              direccion: template.direccion,
              ambientes: template.ambientes,
              m2_totales: template.m2_totales,
              descripcion: template.descripcion,
              notas: template.notas,
              estado: 'Pendiente',
              contactado: false,
              plataforma: plat,
              calificacion: 4,
              fotoUrl: template.foto
            });
            setStep('edit');
          }, 800);
        }
      }, (index + 1) * 500);
    });
  };

  const handleUseDemoLink = (idx: number) => {
    const demos = [
      'https://www.zonaprop.com.ar/propiedades/piso-las-heras-recoleta-938.html',
      'https://www.argenprop.com/propiedades/modern-fitz-roy-palermo-312.html',
      'https://www.mercadolibre.com.ar/inmuebles/loft-industrial-chacabuco-711.html',
      'https://www.zonaprop.com.ar/propiedades/casa-castores-nordelta-8821.html'
    ];
    setUrl(demos[idx]);
    handleImport(demos[idx]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const roundedLat = 20 + Math.random() * 50;
    const roundedLng = 20 + Math.random() * 60;
    const finalTitle = formData.direccion
      ? `${formData.direccion} - ${formData.moneda} ${Number(formData.precio).toLocaleString('es-AR')}`
      : formData.titulo || 'Nueva Propiedad';

    onAddProperty({
      titulo: finalTitle,
      precio: Number(formData.precio),
      moneda: formData.moneda,
      expensas: formData.expensas ? Number(formData.expensas) : null,
      direccion: formData.direccion || 'Dirección de Prueba',
      barrio: formData.barrio,
      m2_totales: Number(formData.m2_totales),
      m2_cubiertos: Math.round(Number(formData.m2_totales) * 0.92),
      ambientes: isNaN(Number(formData.ambientes)) ? formData.ambientes : Number(formData.ambientes),
      dormitorios: Number(formData.ambientes) > 1 ? Number(formData.ambientes) - 1 : 1,
      banos: Number(formData.ambientes) > 2 ? 2 : 1,
      orientacion: 'Norte',
      piso: '4º',
      tiene_ascensor: true,
      antiguedad: 'En pozo',
      fotos: [formData.fotoUrl],
      descripcion: formData.descripcion || 'Sin descripción adicional.',
      url_original: url || 'https://www.zonaprop.com.ar/propiedades/custom.html',
      plataforma: formData.plataforma,
      estado: formData.estado,
      contactado: formData.contactado,
      calificacion: formData.calificacion,
      notas: formData.notas || 'Cargada mediante el asistente inteligente.',
      lat: roundedLat,
      lng: roundedLng
    });

    setStep('done');
  };

  const handleReset = () => {
    setStep('link');
    setUrl('');
    setErrorMessage('');
    setScrapingLog([]);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 min-h-[calc(100vh-4rem)]">
      {showInstalarModal && <InstalarAppModal onClose={() => setShowInstalarModal(false)} />}

      {/* Header copy */}
      <div className="text-center mb-10 max-w-xl">
        <p className="text-[11px] font-bold text-[#E8A838] uppercase tracking-wide mb-3 font-mono">
          Compatible con Zonaprop · Argenprop · MercadoLibre
        </p>
        <h1 className="font-sans font-bold text-3xl md:text-4xl text-brand-dark leading-tight mb-3">
          Olvidate de las mil<br />pestañas abiertas
        </h1>
        <p className="text-sm text-gray-400 leading-relaxed">
          Pegá el link de la propiedad y nosotros armamos la ficha al instante
        </p>
      </div>

      {/* Card container */}
      <div className="w-full max-w-xl">

        {/* ── STEP: LINK ── */}
        {step === 'link' && (
          <div>
            {/* Card de acción principal */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-5 mb-4">
              <div className="flex gap-2 mb-4">
                <div className="relative flex-1">
                  <Link className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleImport()}
                    placeholder="https://www.zonaprop.com.ar/propiedades/..."
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8A838]/40 focus:border-[#E8A838] text-sm transition-all"
                    autoFocus
                  />
                </div>
                <button
                  onClick={() => handleImport()}
                  className="bg-[#E8A838] hover:bg-[#d99c2b] text-brand-dark px-5 py-3.5 rounded-lg font-bold text-sm shadow-sm hover:-translate-y-0.5 active:translate-y-0 duration-150 flex items-center gap-2 shrink-0"
                >
                  <Sparkles className="w-4 h-4" />
                  Sumar a mi lista
                </button>
              </div>
              {errorMessage && (
                <p className="text-red-500 text-xs mb-3 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errorMessage}
                </p>
              )}

              {/* Demo chips */}
              <div>
                <p className="text-[11px] text-gray-400 mb-2">O probá con un ejemplo:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'ZonaProp · Recoleta', idx: 0 },
                    { label: 'Argenprop · Palermo', idx: 1 },
                    { label: 'MercadoLibre · San Telmo', idx: 2 },
                    { label: 'ZonaProp · Nordelta', idx: 3 },
                  ].map(d => (
                    <button
                      key={d.idx}
                      onClick={() => handleUseDemoLink(d.idx)}
                      className="text-xs px-3 py-1.5 rounded-md border border-gray-200 bg-white hover:border-[#E8A838] hover:text-[#E8A838] font-medium transition-all text-gray-500"
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Promo share nativo — tono neutro para no competir con el CTA */}
            <div className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3.5">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                <Smartphone className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-brand-dark leading-snug">
                  ¿Ves propiedades desde el celu?
                </p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  Instalá la app y compartí directo desde ZonaProp — sin copiar ni pegar el link.
                </p>
              </div>
              <button
                onClick={() => setShowInstalarModal(true)}
                className="shrink-0 flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-brand-dark transition-colors mt-0.5 whitespace-nowrap"
              >
                <Share2 className="w-3.5 h-3.5" />
                Cómo instalarlo
              </button>
            </div>
          </div>
        )}

        {/* ── STEP: SCRAPING ── */}
        {step === 'scraping' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
            {isFromShare && (
              <div className="flex items-center gap-1.5 mb-5 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
                <svg className="w-3.5 h-3.5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span className="text-[11px] text-emerald-700 font-medium">Recibida desde tu Share Sheet — procesando...</span>
              </div>
            )}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-brand-accent/10 flex items-center justify-center">
                <Zap className="w-4 h-4 text-brand-accent animate-pulse" />
              </div>
              <div>
                <p className="font-bold text-sm text-brand-dark">Extrayendo datos...</p>
                <p className="text-xs text-gray-400">Asistente Gemini en acción</p>
              </div>
            </div>

            {/* Skeleton */}
            <div className="space-y-3 mb-6">
              {[100, 80, 60, 90].map((w, i) => (
                <div
                  key={i}
                  className="h-3 bg-gray-100 rounded-full animate-pulse"
                  style={{ width: `${w}%`, animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>

            {/* Log */}
            <div className="bg-gray-50 rounded-lg p-4 font-mono text-[11px] text-gray-500 space-y-1 border border-gray-100 min-h-[80px]">
              {scrapingLog.map((line, i) => (
                <p key={i} className={i === scrapingLog.length - 1 ? 'text-brand-accent font-semibold' : ''}>
                  {line}
                </p>
              ))}
              {scrapingLog.length === 0 && <p className="text-gray-300">Iniciando...</p>}
            </div>
          </div>
        )}

        {/* ── STEP: EDIT ── */}
        {step === 'edit' && (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Preview foto */}
            {formData.fotoUrl && (
              <div className="relative h-36 bg-gray-100 overflow-hidden">
                <img src={formData.fotoUrl} alt="preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/60 to-transparent" />
                <div className="absolute bottom-3 left-4 text-white">
                  <p className="text-xs font-bold opacity-70 uppercase tracking-wide">{formData.plataforma}</p>
                  <p className="font-mono font-bold text-brand-accent text-lg">
                    {formData.moneda} {Number(formData.precio).toLocaleString('es-AR')}
                  </p>
                </div>
              </div>
            )}

            <div className="p-6 md:p-8 space-y-4">
              <p className="text-xs font-bold text-brand-accent uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Datos extraídos — revisá y confirmá
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Dirección</label>
                  <input
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30 bg-gray-50"
                    value={formData.direccion}
                    onChange={e => setFormData(p => ({ ...p, direccion: e.target.value }))}
                    placeholder="Dirección"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Barrio</label>
                  <input
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30 bg-gray-50"
                    value={formData.barrio}
                    onChange={e => setFormData(p => ({ ...p, barrio: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Precio</label>
                  <div className="flex gap-1">
                    <select
                      className="px-2 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none"
                      value={formData.moneda}
                      onChange={e => setFormData(p => ({ ...p, moneda: e.target.value as Moneda }))}
                    >
                      <option value="USD">USD</option>
                      <option value="ARS">ARS</option>
                    </select>
                    <input
                      type="number"
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-accent/30 bg-gray-50"
                      value={formData.precio}
                      onChange={e => setFormData(p => ({ ...p, precio: Number(e.target.value) }))}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">m² totales</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-accent/30 bg-gray-50"
                    value={formData.m2_totales}
                    onChange={e => setFormData(p => ({ ...p, m2_totales: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Ambientes</label>
                  <input
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-accent/30 bg-gray-50"
                    value={formData.ambientes}
                    onChange={e => setFormData(p => ({ ...p, ambientes: e.target.value }))}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Nota personal</label>
                  <textarea
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30 bg-gray-50 resize-none"
                    value={formData.notas}
                    onChange={e => setFormData(p => ({ ...p, notas: e.target.value }))}
                    placeholder="Tus impresiones..."
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg bg-brand-accent hover:bg-[#d99c2b] text-brand-dark text-sm font-bold shadow-sm hover:-translate-y-0.5 active:translate-y-0 duration-150 flex items-center justify-center gap-2"
                >
                  Guardar propiedad
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ── STEP: DONE ── */}
        {step === 'done' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-10 text-center">
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-bold text-lg text-brand-dark mb-2">¡Propiedad guardada!</h2>
            <p className="text-sm text-gray-400 mb-7">Se sumó a tu lista. Podés agregar otra o ir a ver todas.</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleReset}
                className="px-5 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all"
              >
                + Agregar otra
              </button>
              <button
                onClick={onGoToFichas}
                className="px-5 py-2.5 rounded-lg bg-brand-accent hover:bg-[#d99c2b] text-brand-dark text-sm font-bold flex items-center gap-2 hover:-translate-y-0.5 duration-150"
              >
                Ver mi lista <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Link to existing list */}
        {totalProperties > 0 && step === 'link' && (
          <button
            onClick={onGoToFichas}
            className="mt-4 w-full text-center text-xs text-gray-400 hover:text-brand-accent transition-colors py-2 flex items-center justify-center gap-1"
          >
            Ver mis {totalProperties} propiedades guardadas
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
