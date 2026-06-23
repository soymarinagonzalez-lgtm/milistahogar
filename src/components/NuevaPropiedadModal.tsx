/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Propiedad, Moneda, Plataforma, EstadoPropiedad } from '../types';
import { X, Link, Upload, Sparkles, Check, AlertCircle, Copy, Share2, PhoneCall } from 'lucide-react';

interface NuevaPropiedadModalProps {
  onClose: () => void;
  onAddProperty: (newProp: Omit<Propiedad, 'id' | 'fecha_agregado'>) => void;
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
    descripcion: 'Excelente departamento, sumamente luminoso, ideal visitas rápidas. Cuenta con piscina en terraza.',
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
    descripcion: 'Casa moderna de una sola planta con galería amplia, parrilla y piscina de natación.',
    ambientes: 5,
    m2_totales: 220,
    foto: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&auto=format&fit=crop&q=80',
    notas: 'Calefacción radiante completa y termopanel acústico.'
  }
];

export default function NuevaPropiedadModal({ onClose, onAddProperty }: NuevaPropiedadModalProps) {
  const [step, setStep] = useState<'link' | 'scraping' | 'edit'>('link');
  const [url, setUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Scraped Data Form State
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

  // Scraping Log simulation
  const [scrapingLog, setScrapingLog] = useState<string[]>([]);
  const [copiedText, setCopiedText] = useState(false);

  const handleUseDemoLink = (type: number) => {
    const demos = [
      'https://www.zonaprop.com.ar/propiedades/piso-las-heras-recoleta-938.html',
      'https://www.argenprop.com/propiedades/modern-fitz-roy-palermo-312.html',
      'https://www.mercadolibre.com.ar/inmuebles/loft-industrial-chacabuco-711.html',
      'https://www.zonaprop.com.ar/propiedades/casa-castores-nordelta-8821.html'
    ];
    setUrl(demos[type]);
    handleImport(demos[type]);
  };

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
      `[3/3] Extrayendo variables críticas: precio, expensas, m² y ambientes con Asistente Gemini...`,
      `Geocodificando dirección en Buenos Aires para ubicación GPS...`,
      `¡Listo! Propiedad extraída y parseada con éxito.`
    ];

    logs.forEach((logLine, index) => {
      setTimeout(() => {
        setScrapingLog(prev => [...prev, logLine]);
        if (index === logs.length - 1) {
          setTimeout(() => {
            const cleanTitleLabel = `${template.direccion} - ${template.moneda} ${template.precio.toLocaleString('es-AR')}`;
            setFormData({
              titulo: cleanTitleLabel,
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

  const handleDragAndDropSimulate = () => {
    setUrl('https://www.instagram.com/p/captura_de_pantalla_prop_923.png');
    handleImport('https://www.zonaprop.com.ar/propiedades/loft-san-telmo.html');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText('buscandohogar.app/tomas-real');
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const roundedLat = 20 + Math.random() * 50;
    const roundedLng = 20 + Math.random() * 60;

    // Use strictly the real dynamic title derived from "direccion - moneda precio" if edit was unaltered
    const finalFormattedTitle = formData.direccion 
      ? `${formData.direccion} - ${formData.moneda} ${Number(formData.precio).toLocaleString('es-AR')}`
      : formData.titulo || 'Nueva Propiedad';

    onAddProperty({
      titulo: finalFormattedTitle,
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
  };

  return (
    <div id="modal-container" className="fixed inset-0 z-[100] flex items-center justify-center bg-[#141b2bb2] backdrop-blur-sm p-4 animate-fade-in">
      <div 
        id="modal-card"
        className="bg-white border border-brand-outline/20 rounded-xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded bg-brand-primary/10 text-brand-primary">
              <Sparkles className="w-4 h-4 text-[#805600]" />
            </div>
            <h3 className="font-sans font-semibold text-base text-brand-dark">Nueva Propiedad</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-brand-dark hover:bg-gray-100 p-1.5 rounded transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="p-5 overflow-y-auto custom-scrollbar flex-1">
          {/* STEP 1: LINK & DROP */}
          {step === 'link' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1.5">
                  Pegá el link de la propiedad
                </label>
                <div className="text-xs text-gray-500 mb-2">
                  Soportamos automáticamente <strong>Zonaprop</strong>, <strong>Argenprop</strong> y <strong>MercadoLibre</strong>
                </div>
                
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://www.zonaprop.com.ar/propiedades/..."
                      className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-primary text-xs"
                    />
                  </div>
                  <button 
                    onClick={() => handleImport()}
                    className="bg-[#614000] text-white px-4 py-2 rounded-md font-bold text-xs hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 shrink-0"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Importar
                  </button>
                </div>
                {errorMessage && (
                  <p className="text-red-600 text-[11px] mt-1.5 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errorMessage}
                  </p>
                )}
              </div>

              {/* DEMO SUGGESTIONS */}
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <p className="text-[10px] font-bold text-brand-dark/70 uppercase tracking-wider mb-2">¿Querés probar una demo instantánea?</p>
                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  <button 
                    onClick={() => handleUseDemoLink(0)}
                    className="text-left py-1 px-2 bg-white border border-gray-200 rounded hover:border-brand-primary/50 text-gray-600 font-medium truncate"
                  >
                    🏠 Av. Las Heras - Recoleta
                  </button>
                  <button 
                    onClick={() => handleUseDemoLink(1)}
                    className="text-left py-1 px-2 bg-white border border-gray-200 rounded hover:border-brand-primary/50 text-gray-600 font-medium truncate"
                  >
                    🏙️ Fitz Roy 2200 - Palermo
                  </button>
                  <button 
                    onClick={() => handleUseDemoLink(2)}
                    className="text-left py-1 px-2 bg-white border border-gray-200 rounded hover:border-brand-primary/50 text-gray-600 font-medium truncate"
                  >
                    🏭 Chacabuco 800 - San Telmo
                  </button>
                  <button 
                    onClick={() => handleUseDemoLink(3)}
                    className="text-left py-1 px-2 bg-white border border-gray-200 rounded hover:border-brand-primary/50 text-gray-600 font-medium truncate"
                  >
                    🏡 Lote 142 - Nordelta
                  </button>
                </div>
              </div>

              {/* Screenshot capture file fallback container */}
              <div 
                onClick={handleDragAndDropSimulate}
                className="group border-2 border-dashed border-gray-200 hover:border-brand-primary rounded-lg p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-white hover:bg-brand-light/20"
              >
                <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center text-brand-primary mb-2 group-hover:scale-105 transition-transform">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="font-sans font-semibold text-xs text-brand-dark">¿Solo tenés captura de pantalla?</p>
                <p className="text-[11px] text-gray-400 mt-0.5 max-w-xs">Subí la foto y te extraemos precio, ambientes, m² y dirección.</p>
              </div>

              {/* WhatsApp direct banner box */}
              <div className="bg-emerald-50 rounded-lg p-3.5 border border-emerald-100 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Share2 className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-sans font-bold text-xs text-emerald-800">
                    Importación desde WhatsApp
                  </h4>
                  <p className="text-[11px] text-emerald-700 mt-0.5 leading-relaxed">
                    Compartí links de propiedades a este alias para sincronizarlos al instante.
                  </p>
                  <div className="mt-2 flex items-center gap-1 bg-white border border-emerald-200 rounded-md overflow-hidden p-1 max-w-xs">
                    <span className="text-[10px] font-mono select-all text-emerald-800 truncate font-semibold px-2">buscandohogar.app/tomas-real</span>
                    <button 
                      onClick={copyToClipboard}
                      className="ml-auto bg-emerald-100 hover:bg-emerald-200 p-1 text-emerald-800 rounded transition-all shrink-0"
                      title="Copiar alias"
                    >
                      {copiedText ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer cancel action */}
              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button 
                  onClick={onClose}
                  className="px-4 py-1.5 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-md text-xs font-semibold transition-all"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: SCRAPING LOG SIMULATION */}
          {step === 'scraping' && (
            <div className="py-6 flex flex-col items-center justify-center text-center">
              <div className="relative w-12 h-12 animate-spin rounded-full border-4 border-gray-100 border-t-brand-accent mb-4" />
              
              <h4 className="font-sans font-bold text-sm text-brand-dark mb-1">
                Extrayendo datos de la publicación con Asistente Gemini™
              </h4>
              <p className="text-[11px] text-gray-500 mb-4">Estamos levantando ambientes, fotos, precio y coordenadas GPS...</p>

              <div className="w-full bg-brand-dark text-left rounded-lg p-3.5 font-mono text-[10px] text-green-400 space-y-1 h-32 overflow-y-auto custom-scrollbar border border-brand-outline/20">
                <div className="text-gray-400"># PROCESO DE LOGS DE INGESTA DE PROPIEDAD</div>
                {scrapingLog.map((log, index) => (
                  <div key={index} className="flex items-start gap-1.5">
                    <span className="text-gray-500">➜</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: PRE-FILL FORM & EDIT */}
          {step === 'edit' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-emerald-50 text-emerald-800 text-xs px-3 py-2.5 rounded-lg font-medium flex items-center gap-2 border border-emerald-100">
                <Check className="w-4 h-4 shrink-0" />
                <span>¡Publicación leída con éxito! Podés afinar los detalles antes de guardarlos.</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-left">
                {/* Direccion - Used as primary identifier */}
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Dirección del Departamento</label>
                  <input 
                    type="text" 
                    value={formData.direccion}
                    onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                    placeholder="Ej. Fitz Roy 1200"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-brand-primary text-xs text-brand-dark font-semibold"
                    required
                  />
                </div>

                {/* Price and currency */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Precio</label>
                  <div className="flex gap-1">
                    <select 
                      value={formData.moneda}
                      onChange={(e) => setFormData({...formData, moneda: e.target.value as Moneda})}
                      className="px-2 py-1.5 bg-gray-50 border border-gray-200 rounded focus:outline-none text-xs font-bold text-brand-dark cursor-pointer"
                    >
                      <option value="USD">USD</option>
                      <option value="ARS">ARS</option>
                    </select>
                    <input 
                      type="number" 
                      value={formData.precio}
                      onChange={(e) => setFormData({...formData, precio: Number(e.target.value)})}
                      className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-brand-primary text-xs font-mono font-bold text-brand-dark"
                      required
                    />
                  </div>
                </div>

                {/* Expensas */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Expensas</label>
                  <input 
                    type="number" 
                    value={formData.expensas || ''}
                    placeholder="Sin expensas"
                    onChange={(e) => setFormData({...formData, expensas: e.target.value ? Number(e.target.value) : null})}
                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-brand-primary text-xs font-mono text-brand-dark"
                  />
                </div>

                {/* Barrio */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Barrio</label>
                  <select 
                    value={formData.barrio}
                    onChange={(e) => setFormData({...formData, barrio: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none text-xs text-brand-dark font-medium"
                  >
                    <option value="Palermo Soho">Palermo Soho</option>
                    <option value="Palermo Hollywood">Palermo Hollywood</option>
                    <option value="Recoleta">Recoleta</option>
                    <option value="Belgrano C">Belgrano C</option>
                    <option value="Belgrano R">Belgrano R</option>
                    <option value="San Telmo">San Telmo</option>
                    <option value="Colegiales">Colegiales</option>
                    <option value="Villa Crespo">Villa Crespo</option>
                    <option value="Nordelta">Nordelta</option>
                  </select>
                </div>

                {/* Ambientes */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Ambientes</label>
                  <select 
                    value={formData.ambientes}
                    onChange={(e) => setFormData({...formData, ambientes: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none text-xs text-brand-dark font-medium"
                  >
                    <option value="Mono.">Monoambiente</option>
                    <option value="1">1 Ambiente</option>
                    <option value="2">2 Ambientes</option>
                    <option value="3">3 Ambientes</option>
                    <option value="4">4 Ambientes</option>
                    <option value="5">5+ Ambientes</option>
                  </select>
                </div>

                {/* Superficie */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Superficie Total (m²)</label>
                  <input 
                    type="number" 
                    value={formData.m2_totales}
                    onChange={(e) => setFormData({...formData, m2_totales: Number(e.target.value)})}
                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-brand-primary text-xs font-mono text-brand-dark"
                    required
                  />
                </div>

                {/* Tracking Status - Unified to Contactado / Pendiente */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Estado de la Propiedad</label>
                  <select 
                    value={formData.estado}
                    onChange={(e) => {
                      const newEst = e.target.value as EstadoPropiedad;
                      setFormData({
                        ...formData,
                        estado: newEst,
                        contactado: newEst === 'Contactado'
                      });
                    }}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none text-xs text-brand-dark font-bold cursor-pointer"
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="Contactado">Contactado</option>
                  </select>
                </div>

                {/* Contacted status tag checkpoint (Saves contactado boolean value) */}
                <div className="col-span-2 bg-gray-50 p-2.5 rounded border border-gray-100 flex items-center justify-between mt-1">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded bg-[#dcd2bb]/50 text-brand-dark shrink-0">
                      <PhoneCall className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-brand-dark">Estado de Contacto</p>
                      <p className="text-[9px] text-gray-400">¿Ya enviaste mensaje o hablaste con el vendedor?</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={formData.contactado}
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          setFormData({
                            ...formData,
                            contactado: isChecked,
                            estado: isChecked ? 'Contactado' : 'Pendiente'
                          });
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                      <span className="ml-2.5 text-[11px] font-bold text-brand-dark min-w-[70px]">
                        {formData.contactado ? 'Contactado ✓' : 'Pendiente'}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Personal Notes */}
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Notas personales (visitas, impresiones)</label>
                  <textarea 
                    value={formData.notas}
                    onChange={(e) => setFormData({...formData, notas: e.target.value})}
                    rows={2}
                    placeholder="Escribí tus impresiones del lugar..."
                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-brand-primary text-xs text-brand-dark"
                  />
                </div>

                {/* Calificacion */}
                <div className="col-span-2 flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Calificación Inicial</span>
                  <div className="flex gap-1 items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({...formData, calificacion: star})}
                        className={`text-lg focus:outline-none transition-transform active:scale-125 ${
                          star <= formData.calificacion ? 'text-amber-500' : 'text-gray-200'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                {/* Beautiful picture select */}
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Elegir imágen de miniatura</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=300',
                      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=300',
                      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=300',
                      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=300'
                    ].map((imgUrl, i) => (
                      <div 
                        key={i}
                        onClick={() => setFormData({...formData, fotoUrl: imgUrl + '&auto=format&fit=crop&q=80'})}
                        className={`relative rounded-md overflow-hidden aspect-video border-2 bg-gray-100 cursor-pointer transition-all ${
                          formData.fotoUrl.startsWith(imgUrl) ? 'border-brand-primary scale-95 shadow-md' : 'border-transparent hover:border-gray-200'
                        }`}
                      >
                        <img src={imgUrl + '&auto=format&fit=crop&q=80'} className="w-full h-full object-cover" alt="Representativa" />
                        {formData.fotoUrl.startsWith(imgUrl) && (
                          <div className="absolute inset-0 bg-brand-primary/25 flex items-center justify-center text-white">
                            <Check className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button 
                  type="button"
                  onClick={() => setStep('link')}
                  className="px-4 py-1.5 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-md text-xs font-semibold transition-all"
                >
                  Atrás
                </button>
                <button 
                  type="submit"
                  className="bg-[#e8a838] hover:bg-[#d99c2b] text-brand-dark px-4 py-1.5 rounded-md font-bold text-xs tracking-tight hover:brightness-105 active:scale-95 transition-all flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5 font-bold" />
                  Agregar Vivienda
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
