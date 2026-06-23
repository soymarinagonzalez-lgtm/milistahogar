/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Propiedad, Moneda, EstadoPropiedad, Plataforma } from './types';
import { INITIAL_PROPERTIES } from './initialData';
import NuevaPropiedadModal from './components/NuevaPropiedadModal';
import OnboardingModal from './components/OnboardingModal';
import HomeView from './components/HomeView';
import { 
  MapPin, 
  Map as MapIcon, 
  Grid as GridIcon, 
  Table as TableIcon, 
  Plus, 
  Search, 
  SlidersHorizontal, 
  Trash2, 
  Edit3, 
  Bookmark, 
  Layers, 
  Download, 
  ChevronUp, 
  ChevronDown, 
  X, 
  Star, 
  Compass, 
  CheckCircle2, 
  Check,
  Phone,
  Calendar, 
  DollarSign,
  Maximize2,
  House
} from 'lucide-react';

export default function App() {
  // Migrate data from old localStorage key to new key (name change)
  const oldKey = 'buscandohogar_propiedades';
  const newKey = 'milistahogar_propiedades';
  if (localStorage.getItem(oldKey) && !localStorage.getItem(newKey)) {
    localStorage.setItem(newKey, localStorage.getItem(oldKey)!);
  }
  localStorage.removeItem(oldKey);

  // Main Properties State loaded from LocalStorage or Initial Setup
  const [propiedades, setPropiedades] = useState<Propiedad[]>(() => {
    const saved = localStorage.getItem('milistahogar_propiedades');
    let loaded: Propiedad[] = [];

    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Propiedad[];
        // Enforce that property names are strictly their addresses and prices (e.g. Humboldt 2400 - USD 450.000)
        // to filter out any old/residual names like "Penthouse" or "Loft".
        loaded = parsed.map(p => {
          const cleanTitle = p.direccion && p.precio
            ? `${p.direccion} - ${p.moneda} ${p.precio.toLocaleString('es-AR')}`
            : p.titulo;
          return { ...p, titulo: cleanTitle, estado: p.contactado ? 'Contactado' : 'Pendiente' };
        });
      } catch (e) {
        console.error('Error parsing stored properties, fallback to initial:', e);
      }
    }

    if (!loaded || loaded.length === 0) {
      loaded = INITIAL_PROPERTIES.map(p => ({
        ...p,
        estado: p.contactado ? 'Contactado' : 'Pendiente'
      }));
    }

    // Programmatically guarantee at least 50% of the properties are contactadas as per user request
    const contactedCount = loaded.filter(p => p.contactado).length;
    const targetCount = Math.ceil(loaded.length / 2);
    if (contactedCount < targetCount) {
      let deficit = targetCount - contactedCount;
      loaded = loaded.map(p => {
        if (!p.contactado && deficit > 0) {
          deficit--;
          return { ...p, contactado: true, estado: 'Contactado' };
        }
        return p;
      });
    }

    return loaded;
  });

  // Persist properties state
  useEffect(() => {
    localStorage.setItem('milistahogar_propiedades', JSON.stringify(propiedades));
  }, [propiedades]);

  // Master UI State
  const [activeView, setActiveView] = useState<'home' | 'tabla' | 'mapa' | 'fichas'>('fichas');

  // Share Sheet: detecta URL compartida desde el sistema operativo
  const [sharedUrl, setSharedUrl] = useState<string | null>(null);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const incoming = params.get('shared_url') || params.get('shared_text') || params.get('url');
    if (incoming && (incoming.startsWith('http://') || incoming.startsWith('https://'))) {
      setSharedUrl(incoming);
      setActiveView('home');
      // Limpiamos la URL sin recargar la página
      window.history.replaceState({}, '', '/');
    }
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterBarrio, setFilterBarrio] = useState<string>('todos');
  const [filterEstado, setFilterEstado] = useState<string>('todos');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Sort Table State
  const [sortField, setSortField] = useState<'precio' | 'm2_totales' | 'expensas' | 'titulo' | 'none'>('none');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Interactive selected property for MAP view and DETAIL modal
  const [selectedPropId, setSelectedPropId] = useState<string | null>('prop-1');
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailPropId, setDetailPropId] = useState<string | null>(null);

  // Zoom control on mock map
  const [mapZoom, setMapZoom] = useState<number>(3);
  const [mapOverlayType, setMapOverlayType] = useState<'vector' | 'satellite' | 'simple'>('vector');

  // Interactive editing inside notes modal or property direct state
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [editingNotesText, setEditingNotesText] = useState('');

  // Notification Banner
  const [bannerMessage, setBannerMessage] = useState<string | null>(null);

  // Onboarding: show once to new users
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    return !localStorage.getItem('milistahogar_onboarding_done');
  });
  const handleCloseOnboarding = () => {
    localStorage.setItem('milistahogar_onboarding_done', '1');
    setShowOnboarding(false);
  };

  // Computed neighborhoods for filtration dropdown list
  const activeNeighborhoods = useMemo(() => {
    const list = new Set(propiedades.map(p => p.barrio));
    return Array.from(list);
  }, [propiedades]);

  // Since filters are removed, filteredProperties is simply all propiedades
  const filteredProperties = useMemo(() => {
    return propiedades;
  }, [propiedades]);

  // Sorted list for Table View
  const sortedProperties = useMemo(() => {
    if (sortField === 'none') return filteredProperties;

    return [...filteredProperties].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (valA === null || valA === undefined) return sortDirection === 'asc' ? 1 : -1;
      if (valB === null || valB === undefined) return sortDirection === 'asc' ? -1 : 1;

      // Lowercase strings for comparison
      if (typeof valA === 'string' && typeof valB === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredProperties, sortField, sortDirection]);

  // Selected property on Map details
  const selectedPropertyForMap = useMemo(() => {
    return propiedades.find(p => p.id === selectedPropId) || null;
  }, [propiedades, selectedPropId]);

  // Add new property callback on happy path modal save
  const handleAddNewProperty = (newProp: Omit<Propiedad, 'id' | 'fecha_agregado'>) => {
    const timestamp = new Date().toISOString().split('T')[0];
    const generatedId = `prop-${Date.now()}`;
    const newItem: Propiedad = {
      ...newProp,
      id: generatedId,
      fecha_agregado: timestamp
    };

    setPropiedades(prev => [newItem, ...prev]);
    setIsAddModalOpen(false);
    setSelectedPropId(generatedId);
    
    // Switch to Map or Fichas to immediately review the added property!
    setActiveView('fichas');

    // Display lovely Toast verification message
    setBannerMessage(`¡"${newProp.titulo}" se sumó con éxito a tus propiedades con IA scraping!`);
    setTimeout(() => setBannerMessage(null), 5000);
  };

  // Delete property action
  const handleDeleteProperty = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (confirm('¿Estás seguro que querés eliminar esta propiedad de tus guardadas?')) {
      setPropiedades(prev => prev.filter(p => p.id !== id));
      if (selectedPropId === id) {
        setSelectedPropId(null);
      }
      setBannerMessage('Propiedad eliminada correctamente.');
      setTimeout(() => setBannerMessage(null), 3000);
    }
  };

  // Restore initial data trigger helper (just in case they delete all)
  const handleRestoreDefaults = () => {
    if (confirm('¿Querés restablecer las propiedades iniciales de prueba?')) {
      setPropiedades(INITIAL_PROPERTIES);
      setSelectedPropId('prop-1');
      setBannerMessage('Datos de propiedades restablecidos con éxito.');
      setTimeout(() => setBannerMessage(null), 3500);
    }
  };

  // Start direct quick-edit of notes inside modal/card
  const startEditingNotes = (prop: Propiedad, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingNotesId(prop.id);
    setEditingNotesText(prop.notas);
  };

  // Save edit notes action
  const saveEditingNotes = (id: string) => {
    setPropiedades(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, notas: editingNotesText };
      }
      return p;
    }));
    setEditingNotesId(null);
    setBannerMessage('Nota actualizada.');
    setTimeout(() => setBannerMessage(null), 2500);
  };

  // Inline state updates
  const updatePropertyStatus = (id: string, newStatus: EstadoPropiedad, e?: React.ChangeEvent<HTMLSelectElement>) => {
    if (e) e.stopPropagation();
    setPropiedades(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, estado: newStatus, contactado: newStatus === 'Contactado' };
      }
      return p;
    }));
  };

  const toggleContactado = (id: string) => {
    setPropiedades(prev => prev.map(p => {
      if (p.id === id) {
        const nextState = !p.contactado;
        setBannerMessage(`Propiedad de ${p.direccion} ahora marcada como ${nextState ? 'Contactada ✓' : 'Pendiente 📞'}.`);
        setTimeout(() => setBannerMessage(null), 3000);
        return { ...p, contactado: nextState, estado: nextState ? 'Contactado' : 'Pendiente' };
      }
      return p;
    }));
  };

  // Trigger spreadsheet demo download or raw copy
  const handleExportSpreadsheet = () => {
    // Generate simple beautifully structured JSON layout as a string for demonstration
    const headers = 'Id,Título,Dirección,Barrio,Precio,Moneda,Expensas,M2,Habitaciones,Estado,Notas\n';
    const rows = filteredProperties.map(p => 
      `"${p.id}","${p.titulo}","${p.direccion}","${p.barrio}",${p.precio},"${p.moneda}",${p.expensas || 0},${p.m2_totales},"${p.ambientes}","${p.estado}","${p.notas.replace(/"/g, '""')}"`
    ).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `milistahogar_comparativa_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setBannerMessage('Exportando planilla de propiedades en formato .CSV compatible con Excel/GSheets.');
    setTimeout(() => setBannerMessage(null), 4000);
  };

  // Sort helper function
  const handleSort = (field: 'precio' | 'm2_totales' | 'expensas' | 'titulo') => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        setSortField('none');
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Open property full detail modal view
  const openDetailModal = (id: string) => {
    setDetailPropId(id);
    setIsDetailOpen(true);
  };

  const detailedProperty = useMemo(() => {
    return propiedades.find(p => p.id === detailPropId) || null;
  }, [propiedades, detailPropId]);

  return (
    <div className="bg-brand-light text-brand-dark min-h-screen font-sans flex flex-col selection:bg-brand-accent/30 selection:text-brand-dark">
      {showOnboarding && <OnboardingModal onClose={handleCloseOnboarding} />}
      
      {/* 5. TOP NAVBAR - Logo, View Choice tabs, and "+ Agregar" Button. Excluding setting, notifications or logout. */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-8 h-16 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center gap-8 min-w-0">
          {/* Logo brand */}
          <div className="flex items-center gap-1.5 cursor-pointer shrink-0" onClick={() => setActiveView('fichas')}>
            <House className="w-5 h-5 text-brand-primary shrink-0" />
            <span className="text-xl font-bold text-brand-primary tracking-tight font-sans">Mi Lista Hogar</span>
          </div>

          {/* View selectors */}
          <nav className="hidden md:flex items-center gap-1 h-16">
            <button
              onClick={() => setActiveView('home')}
              className={`font-sans text-sm font-semibold duration-150 px-4 h-full border-b-2 flex items-center gap-2 ${
                activeView === 'home'
                  ? 'border-brand-accent text-brand-dark bg-brand-accent/5'
                  : 'border-transparent text-gray-500 hover:text-brand-dark hover:bg-gray-50'
              }`}
            >
              <Plus className="w-4 h-4" />
              Cargar propiedad
            </button>
            <button
              onClick={() => setActiveView('tabla')}
              className={`font-sans text-sm font-semibold duration-150 px-4 h-full border-b-2 flex items-center gap-2 ${
                activeView === 'tabla'
                  ? 'border-brand-primary text-brand-primary bg-brand-light/40'
                  : 'border-transparent text-gray-500 hover:text-brand-dark hover:bg-gray-50'
              }`}
            >
              <TableIcon className="w-4 h-4" />
              Tabla
            </button>
            <button
              onClick={() => setActiveView('fichas')}
              className={`font-sans text-sm font-semibold duration-150 px-4 h-full border-b-2 flex items-center gap-2 ${
                activeView === 'fichas'
                  ? 'border-brand-primary text-brand-primary bg-brand-light/40'
                  : 'border-transparent text-gray-500 hover:text-brand-dark hover:bg-gray-50'
              }`}
            >
              <GridIcon className="w-4 h-4" />
              Fichas
            </button>
            <button
              onClick={() => setActiveView('mapa')}
              className={`font-sans text-sm font-semibold duration-150 px-4 h-full border-b-2 flex items-center gap-2 ${
                activeView === 'mapa'
                  ? 'border-brand-primary text-brand-primary bg-brand-light/40'
                  : 'border-transparent text-gray-500 hover:text-brand-dark hover:bg-gray-50'
              }`}
            >
              <MapIcon className="w-4 h-4" />
              Mapa
            </button>
          </nav>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          {/* Restablecer: solo desktop, es acción de dev/debug */}
          {propiedades.length !== INITIAL_PROPERTIES.length && (
            <button 
              onClick={handleRestoreDefaults}
              className="hidden md:block text-xs text-brand-primary border border-brand-primary/20 hover:bg-brand-primary/5 px-2.5 py-1.5 rounded-md font-semibold transition-all shrink-0"
              title="Restablecer propiedades originales"
            >
              Restablecer
            </button>
          )}
          {/* Botón + Cargar — solo mobile, espejo del logo */}
          <button
            onClick={() => setActiveView('home')}
            className={`md:hidden w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              activeView === 'home'
                ? 'bg-[#d99c2b]'
                : 'bg-[#E8A838] hover:bg-[#d99c2b]'
            }`}
          >
            <Plus className="w-5 h-5 text-brand-dark stroke-[2.5px]" />
          </button>
        </div>
      </header>

      {/* Main Container offset from Fixed Header */}
      <main className={`pt-16 ${activeView === 'mapa' ? 'h-[calc(100vh-4rem)] overflow-hidden' : 'min-h-[calc(100vh-4rem)]'} flex flex-col relative`}>

        {/* Global Toast Success Notification */}
        {bannerMessage && (
          <div className="fixed top-20 right-4 z-50 bg-brand-dark text-white border-l-4 border-brand-accent px-4 py-3 rounded-lg shadow-xl text-xs flex items-center gap-2 max-w-sm animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-brand-accent shrink-0" />
            <p className="font-semibold leading-relaxed">{bannerMessage}</p>
          </div>
        )}



        {/* ======================================= */}
        {/* VIEW 0: HOME (Agregar propiedad inline) */}
        {/* ======================================= */}
        {activeView === 'home' && (
          <HomeView
            onAddProperty={(newProp) => {
              const timestamp = new Date().toISOString().split('T')[0];
              const generatedId = `prop-${Date.now()}`;
              const newItem = { ...newProp, id: generatedId, fecha_agregado: timestamp };
              setPropiedades(prev => [newItem, ...prev]);
              setSelectedPropId(generatedId);
              setBannerMessage(`¡"${newProp.titulo}" se sumó con éxito a tus propiedades!`);
              setTimeout(() => setBannerMessage(null), 5000);
            }}
            onGoToFichas={() => setActiveView('fichas')}
            totalProperties={propiedades.length}
            sharedUrl={sharedUrl}
            onSharedUrlConsumed={() => setSharedUrl(null)}
          />
        )}

        {/* ======================================= */}
        {/* VIEW 1: GRID VIEWS ("Fichas") */}
        {/* ======================================= */}
        {activeView === 'fichas' && (
          <div className="flex-1 p-4 md:p-8">
            {filteredProperties.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 max-w-sm mx-auto text-center">
                {/* Undraw-style empty state illustration */}
                <div className="w-64 h-48 mb-6">
                  <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <ellipse cx="200" cy="272" rx="140" ry="16" fill="#F3EFE8" />
                    {/* House outline (empty/searching) */}
                    <rect x="120" y="145" width="160" height="125" rx="4" fill="#FAFAFA" stroke="#E0D8CC" strokeWidth="2" strokeDasharray="6 4" />
                    <polygon points="105,150 200,72 295,150" fill="none" stroke="#E8A838" strokeWidth="2.5" strokeDasharray="7 4" />
                    {/* Question marks inside */}
                    <text x="200" y="225" textAnchor="middle" fill="#D1C5B0" fontSize="48" fontWeight="bold" fontFamily="sans-serif">?</text>
                    {/* Magnifying glass */}
                    <circle cx="318" cy="90" r="32" fill="white" stroke="#E8A838" strokeWidth="3" />
                    <circle cx="318" cy="90" r="20" fill="#FFF9EF" stroke="#E8A838" strokeWidth="2" />
                    <line x1="335" y1="107" x2="355" y2="128" stroke="#E8A838" strokeWidth="5" strokeLinecap="round" />
                    {/* House small inside glass */}
                    <polygon points="308,84 318,73 328,84" fill="#E8A838" opacity="0.7" />
                    <rect x="311" y="84" width="14" height="11" fill="#E8A838" opacity="0.5" />
                    {/* Floating dots */}
                    <circle cx="70" cy="100" r="6" fill="#E8A838" opacity="0.3" />
                    <circle cx="85" cy="75" r="4" fill="#E8A838" opacity="0.2" />
                    <circle cx="55" cy="78" r="3" fill="#E8A838" opacity="0.25" />
                  </svg>
                </div>
                <h3 className="font-sans font-bold text-lg text-brand-dark mb-2">Tu lista está vacía</h3>
                <p className="text-sm text-gray-400 mb-7 leading-relaxed">
                  Todavía no guardaste ninguna propiedad. Empezá a armar tu lista ideal.
                </p>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-[#e8a838] hover:bg-[#d99c2b] text-brand-dark px-6 py-2.5 rounded-lg font-bold text-sm shadow-sm hover:translate-y-[-1px] active:translate-y-[0px] duration-150 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4 stroke-[3px]" />
                  Cargar primera propiedad
                </button>
              </div>
            ) : (
              <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProperties.map((p) => {
                  // Class mapping for colors depending on status
                  let borderStatusBarColor = p.estado === 'Pendiente' ? 'bg-amber-500' : 'bg-[#10B981]';

                  return (
                    <article 
                      key={p.id} 
                      className={`bg-white border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex flex-col relative overflow-hidden group ${
                        p.estado === 'Pendiente' ? 'border-gray-200' : 'border-gray-200 hover:border-brand-primary'
                      }`}
                    >
                      {/* Top Horizontal Status highlight bar to respect "design md 100%" */}
                      <div className={`h-1.5 ${borderStatusBarColor} w-full`} />

                      {/* Photo Area with overlay tag */}
                      <div className="relative aspect-video bg-gray-100 overflow-hidden shrink-0 select-none">
                        <img 
                          src={p.fotos[0]} 
                          alt={p.titulo} 
                          className="w-full h-full object-cover group-hover:scale-105 duration-300 ease-out" 
                        />
                        <span className={`absolute top-2.5 left-2.5 px-2 py-1 text-white font-sans text-[9px] uppercase font-extrabold tracking-wider rounded-sm shadow-sm flex items-center gap-1 ${
                          p.estado === 'Pendiente' ? 'bg-amber-600/90' : 'bg-[#10B981]/90'
                        }`}>
                          {p.estado === 'Pendiente' ? <Phone className="w-2.5 h-2.5" /> : <Check className="w-2.5 h-2.5 stroke-[3px]" />}
                          {p.estado}
                        </span>
                        

                      </div>

                      {/* Card Content with small images constraints */}
                      <div className="p-4 flex-1 flex flex-col relative">
                        {/* Title and Price */}
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex items-center gap-1.5 min-w-0 flex-1">
                            <MapPin className="w-4 h-4 text-brand-primary shrink-0" />
                            <h3 className="font-sans font-bold text-brand-dark text-medium leading-snug tracking-tight truncate" title={p.direccion}>
                              {p.direccion}
                            </h3>
                          </div>
                          <span className="font-sans text-sm font-bold text-brand-dark tracking-tight whitespace-nowrap shrink-0">
                            {p.moneda} {p.precio.toLocaleString('es-AR')}
                          </span>
                        </div>

                        {/* Location / Barrio only */}
                        <p className="text-xs text-gray-500 font-semibold mt-1">
                          {p.barrio}
                        </p>

                        {/* Interactive contact status badge + stars in same row */}
                        <div className="flex items-center justify-between gap-1.5 mt-2.5 select-none shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleContactado(p.id);
                            }}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-bold transition-all border ${
                              p.contactado 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                                : 'bg-amber-50/50 text-amber-700 border-amber-200 hover:bg-amber-100/55'
                            }`}
                            title="Haz click para cambiar el estado de contacto"
                          >
                            {p.contactado ? (
                              <>
                                <Check className="w-3 h-3 stroke-[3px]" />
                                Contactado
                              </>
                            ) : (
                              <>
                                <Phone className="w-3 h-3" />
                                Pendiente
                              </>
                            )}
                          </button>
                          <div className="flex shrink-0">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-3 h-3 ${i < p.calificacion ? 'text-brand-accent fill-brand-accent' : 'text-gray-200'}`} 
                              />
                            ))}
                          </div>
                        </div>

                        {/* Property parameters metrics grid in IBM Plex Mono as described in tokens specs */}
                        <div className="grid grid-cols-3 gap-2 py-3.5 border-y border-gray-100 my-3 text-[11px] font-mono font-medium text-gray-600">
                          <div className="bg-brand-light/70 px-2 py-1 rounded text-center">
                            📐 {p.m2_totales} m²
                          </div>
                          <div className="bg-brand-light/70 px-2 py-1 rounded text-center">
                            🛋️ {p.ambientes} Amb
                          </div>
                          <div className="bg-brand-light/70 px-2 py-1 rounded text-center truncate" title={p.piso || 'N/A'}>
                            🏢 {p.piso || '4º'}
                          </div>
                        </div>

                        {/* User Personal quote italic review box */}
                        <p className="text-xs italic text-gray-500 font-sans leading-relaxed flex-1 border-l-2 border-brand-accent/40 pl-2 py-1 mb-4">
                          "{p.descripcion || p.notas}"
                        </p>

                        {/* Secondary Interactive actions footer */}
                        <div className="flex gap-2 items-center justify-between pt-2 border-t border-gray-100 mt-auto">
                          <button 
                            onClick={() => openDetailModal(p.id)}
                            className="text-xs font-bold text-brand-primary bg-brand-light hover:bg-[#805600]/10 px-3 py-1.5 rounded-md transition-all flex items-center gap-1"
                          >
                            Ver Ficha
                          </button>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => startEditingNotes(p, e)}
                              className="p-1.5 text-gray-400 hover:text-brand-primary hover:bg-gray-100 rounded transition-all"
                              title="Editar notas"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => handleDeleteProperty(p.id, e)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-all animate-fade-in"
                              title="Eliminar de mis guardadas"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
              <p className="text-xs text-gray-400 font-sans text-right mt-4 pr-1">
                {filteredProperties.length} {filteredProperties.length === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}
              </p>
              </div>
            )}
          </div>
        )}

        {/* ======================================= */}
        {/* VIEW 2: MAP VIEW ("Mapa" - Splitscreen) */}
        {/* ======================================= */}
        {activeView === 'mapa' && (
          <div className="flex-1 flex overflow-hidden">
            
            {/* Simulated Vector / Light Map area - completely conforms with Image 1 style guidelines */}
            <section className="flex-1 relative bg-[#e9edff] overflow-hidden select-none">
              
              {/* Map background grid representing city block layouts */}
              <div className="absolute inset-0 z-0">
                <svg className="w-full h-full opacity-70" xmlns="http://www.w3.org/2000/svg">
                  {/* Street grids background */}
                  <defs>
                    <pattern id="street-grid" width="120" height="120" patternUnits="userSpaceOnUse">
                      <rect width="120" height="120" fill="#f4f5f9" />
                      <line x1="0" y1="30" x2="120" y2="30" stroke="#d3daef" strokeWidth="6" />
                      <line x1="0" y1="90" x2="120" y2="90" stroke="#d3daef" strokeWidth="6" />
                      <line x1="40" y1="0" x2="40" y2="120" stroke="#d3daef" strokeWidth="6" />
                      <line x1="100" y1="0" x2="100" y2="120" stroke="#d3daef" strokeWidth="6" />
                      
                      {/* Diagonal diagonal avenues */}
                      <path d="M-10,-10 L130,130" stroke="#c2cbdc" strokeWidth="4" strokeDasharray="4 4" />
                    </pattern>
                  </defs>
                  
                  {/* Map canvas fill */}
                  <rect width="100%" height="100%" fill="url(#street-grid)" />

                  {/* Aesthetic Neighborhood shapes block overlays */}
                  <path d="M 50 120 Q 180 80 250 150 T 400 350 L 350 450 L 100 390 Z" fill="#e1e8fd" opacity="0.6" stroke="#c3cce9" strokeWidth="1" />
                  <text x="140" y="240" fill="#8c9bbc" className="font-sans font-bold text-xs tracking-wider opacity-60">PALERMO SOHO</text>
                  
                  <path d="M 390 150 Q 510 100 580 220 T 700 420 L 600 500 L 410 390 Z" fill="#dce2f7" opacity="0.5" stroke="#c3cce9" strokeWidth="1" />
                  <text x="520" y="300" fill="#8c9bbc" className="font-sans font-bold text-xs tracking-wider opacity-60">RECOLETA</text>

                  <path d="M 120 400 Q 200 480 320 520 L 220 700 L 80 600 Z" fill="#edf0ff" opacity="0.6" stroke="#c3cce9" strokeWidth="1" />
                  <text x="160" y="530" fill="#8c9bbc" className="font-sans font-bold text-xs tracking-wider opacity-60">VILLA CRESPO</text>

                  {/* Rivers of La Plata graphic curve */}
                  <path d="M 500 -100 Q 750 150 900 400 T 1100 850 L 1500 850 L 1500 -100 Z" fill="#bcf1ff" opacity="0.3" stroke="#90e0ef" strokeWidth="3" />
                  <text x="960" y="150" fill="#4ea8de" className="font-sans font-bold text-[10px] tracking-widest opacity-40 uppercase rotate-12">Río de la Plata</text>
                </svg>
              </div>

              {/* Clean Map UI - redundant floating overlay cleaned up */}

              {/* Map Floating Zoom Controls on Top Right */}
              <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5 drop-shadow-sm">
                <div className="bg-white border border-gray-200 rounded overflow-hidden flex flex-col">
                  <button 
                    onClick={() => setMapZoom(prev => Math.min(prev + 1, 6))}
                    className="p-2 bg-white text-xs hover:bg-gray-100 font-bold border-b border-gray-200 active:bg-gray-200 transition-all font-sans"
                    title="Acercar mapa"
                  >
                    ＋
                  </button>
                  <button 
                    onClick={() => setMapZoom(prev => Math.max(prev - 1, 1))}
                    className="p-2 bg-white text-xs hover:bg-gray-100 font-bold active:bg-gray-200 transition-all font-sans"
                    title="Alejar mapa"
                  >
                    –
                  </button>
                </div>

                <button 
                  onClick={() => setBannerMessage('GPS: Ubicación del analista centrada en Ciudad de Buenos Aires.')}
                  className="p-2 bg-white text-gray-600 border border-gray-200 rounded hover:bg-gray-100 active:bg-gray-200 transition-all"
                  title="Mi ubicación actual"
                >
                  <Compass className="w-4 h-4 mx-auto" strokeWidth="2.5" />
                </button>

                {/* Layer Toggle POPUP control */}
                <div className="relative group">
                  <button 
                    className="p-2 bg-white text-gray-600 border border-gray-200 rounded hover:bg-gray-100 active:bg-gray-200 transition-all"
                    title="Cambiar capa de mapa"
                  >
                    <Layers className="w-4 h-4 mx-auto" />
                  </button>
                  <div className="hidden group-hover:block absolute right-0 top-0 bg-white border border-gray-200 rounded-md p-2 shadow-lg min-w-32 text-xs space-y-1 z-30">
                    <button 
                      onClick={() => setMapOverlayType('vector')}
                      className={`w-full text-left px-2 py-1 rounded hover:bg-gray-100 ${mapOverlayType === 'vector' ? 'font-bold text-brand-primary' : ''}`}
                    >
                      Capa Vectorial
                    </button>
                    <button 
                      onClick={() => setMapOverlayType('satellite')}
                      className={`w-full text-left px-2 py-1 rounded hover:bg-gray-100 ${mapOverlayType === 'satellite' ? 'font-bold text-brand-primary' : ''}`}
                    >
                      Capa Satelital
                    </button>
                  </div>
                </div>
              </div>

              {/* Interactive Floating MAP PINS - plotted using % coordinate variables */}
              {filteredProperties.map((p) => {
                const isSelected = p.id === selectedPropId;
                
                // Represent price nicely (e.g. "$450k" or "$1.2k")
                let formattedPriceText = `$${Math.round(p.precio / 1000)}k`;
                if (p.precio < 5000) {
                  formattedPriceText = `$${(p.precio / 1000).toFixed(1)}k/m`;
                }

                // Adjust positioning factor according to Zoom Simulation state
                const scaleValue = (mapZoom / 3);
                const baseLat = p.lat;
                const baseLng = p.lng;
                
                const topPercent = 50 + (baseLat - 50) * scaleValue;
                const leftPercent = 50 + (baseLng - 50) * scaleValue;

                // Out of screen bounds check helper
                if (topPercent < 0 || topPercent > 100 || leftPercent < 0 || leftPercent > 100) return null;

                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPropId(p.id)}
                    className="absolute z-10 cursor-pointer transform -translate-x-1/2 -translate-y-full flex flex-col items-center select-none"
                    style={{
                      top: `${topPercent}%`,
                      left: `${leftPercent}%`
                    }}
                  >
                    {/* Floating Price Indicator Label box */}
                    <div className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded shadow border duration-200 ${
                      isSelected 
                        ? 'bg-brand-primary text-white border-brand-primary scale-110 z-20' 
                        : 'bg-white text-brand-dark border-brand-outline/25 hover:bg-brand-primary hover:text-white hover:border-brand-primary'
                    }`}>
                      {formattedPriceText}
                    </div>

                    {/* Standard Amber Arrow indicator matching material pins */}
                    <div className="relative -mt-0.5">
                      <MapPin className={`w-6 h-6 stroke-[2px] filter drop-shadow ${
                        isSelected ? 'text-brand-primary fill-brand-primary scale-115' : 'text-brand-outline fill-white hover:text-brand-primary'
                      }`} />
                    </div>
                  </div>
                );
              })}

              {/* Floating selected property card detail overlay at bottom - matching Image 1 exact styling */}
              {selectedPropertyForMap && (
                <div 
                  className="absolute bottom-20 md:bottom-6 left-1/2 transform -translate-x-1/2 z-20 w-[90%] max-w-[420px] bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden animate-slide-up"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Highlight indicator bar */}
                  <div className="h-1 bg-brand-primary w-full" />
                  
                  <div className="p-4 flex gap-3.5 relative">
                    {/* Small preview photo in card */}
                    <div className="w-24 h-24 rounded-lg bg-gray-100 overflow-hidden shrink-0 select-none border border-gray-100">
                      <img src={selectedPropertyForMap.fotos[0]} className="w-full h-full object-cover" alt="Detalle" />
                    </div>

                    {/* Content text */}
                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="flex justify-between items-start gap-1">
                        <div className="flex items-center gap-1 flex-1 min-w-0 pr-3">
                          <MapPin className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                          <h4 className="font-sans font-bold text-sm text-[#141b2b] truncate" title={selectedPropertyForMap.direccion}>{selectedPropertyForMap.direccion}</h4>
                        </div>
                        <button 
                          onClick={() => setSelectedPropId(null)}
                          className="text-gray-400 hover:text-brand-dark p-0.5 hover:bg-gray-100 rounded shrink-0 duration-150"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <p className="text-[11px] text-gray-400 truncate font-semibold mt-0.5 pl-4.5">{selectedPropertyForMap.barrio}</p>
                      
                      <div className="mt-3 flex justify-between items-end">
                        <div>
                          <span className="font-mono text-base font-extrabold text-[#805600]">
                            {selectedPropertyForMap.moneda} {selectedPropertyForMap.precio.toLocaleString('es-AR')}
                          </span>
                          <p className="text-[9px] font-mono font-medium text-gray-500 uppercase tracking-tight mt-0.5">
                            Expensas: {selectedPropertyForMap.moneda} {((selectedPropertyForMap.expensas || 30000)).toLocaleString('es-AR')}
                          </p>
                        </div>
                        
                        <button 
                          onClick={() => openDetailModal(selectedPropertyForMap.id)}
                          className="bg-[#e8a838] hover:bg-[#d99c2b] text-brand-dark font-bold px-3 py-1.5 rounded text-xs transition-colors hover:brightness-105"
                        >
                          Ver Ficha
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>
        )}

        {/* ======================================= */}
        {/* VIEW 3: COMPREHENSIVE DATA TABLE ("Tabla") */}
        {/* ======================================= */}
        {activeView === 'tabla' && (
          <div className="flex-grow p-4 md:p-8">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              {/* Scroll hint — solo mobile */}
              <div className="md:hidden flex items-center gap-1.5 px-4 py-2 border-b border-gray-100 bg-gray-50">
                <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18M17 8l4 4m0 0l-4 4" />
                </svg>
                <span className="text-[10px] text-gray-400 font-medium">Deslizá para ver todas las columnas</span>
              </div>
              <div className="overflow-x-auto custom-scrollbar pb-3">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 select-none">
                      <th className="w-6 px-4 py-3.5"></th> {/* Top Left status vertical bar alignment space */}
                      <th className="font-sans text-xs font-bold text-gray-500 uppercase tracking-widest px-4 py-3.5">Foto</th>
                      <th 
                        onClick={() => handleSort('titulo')}
                        className="font-sans text-xs font-bold text-gray-500 uppercase tracking-widest px-4 py-3.5 cursor-pointer hover:text-brand-primary"
                      >
                        <span className="flex items-center gap-1">
                          Propiedad & Zona
                          {sortField === 'titulo' ? (sortDirection === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />) : null}
                        </span>
                      </th>
                      <th 
                        onClick={() => handleSort('precio')}
                        className="font-sans text-xs font-bold text-gray-500 uppercase tracking-widest px-4 py-3.5 cursor-pointer hover:text-brand-primary"
                      >
                        <span className="flex items-center gap-1">
                          Precio
                          {sortField === 'precio' ? (sortDirection === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />) : null}
                        </span>
                      </th>
                      <th 
                        onClick={() => handleSort('expensas')}
                        className="font-sans text-xs font-bold text-gray-500 uppercase tracking-widest px-4 py-3.5 cursor-pointer hover:text-brand-primary"
                      >
                        <span className="flex items-center gap-1">
                          Expensas
                          {sortField === 'expensas' ? (sortDirection === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />) : null}
                        </span>
                      </th>
                      <th 
                        onClick={() => handleSort('m2_totales')}
                        className="font-sans text-xs font-bold text-gray-500 uppercase tracking-widest px-4 py-3.5 text-center cursor-pointer hover:text-brand-primary"
                      >
                        <span className="flex items-center justify-center gap-1">
                          m²
                          {sortField === 'm2_totales' ? (sortDirection === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />) : null}
                        </span>
                      </th>
                      <th className="font-sans text-xs font-bold text-gray-500 uppercase tracking-widest px-4 py-3.5 text-center">Amb.</th>
                      <th className="font-sans text-xs font-bold text-gray-500 uppercase tracking-widest px-4 py-3.5">Piso/Orientic.</th>
                      <th className="font-sans text-xs font-bold text-gray-500 uppercase tracking-widest px-4 py-3.5">Notas del Analista</th>
                      <th className="font-sans text-xs font-bold text-gray-500 uppercase tracking-widest px-4 py-3.5 text-right">Estado / Acciones</th>
                    </tr>
                  </thead>
                  
                  <tbody className="divide-y divide-gray-100 font-sans text-sm">
                    {sortedProperties.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="text-center py-12 text-gray-400">
                          Ninguna propiedad coincide con los filtros especificados.
                        </td>
                      </tr>
                    ) : (
                      sortedProperties.map((p) => {
                        let rowStatusClass = p.estado === 'Pendiente' ? 'bg-amber-500' : 'bg-[#10B981]';

                        return (
                          <tr 
                            key={p.id} 
                            onClick={() => setSelectedPropId(p.id)}
                            className={`group border-l hover:bg-gray-50/70 duration-150 transition-colors relative cursor-pointer ${
                              p.id === selectedPropId ? 'bg-brand-light/25' : ''
                            }`}
                          >
                            {/* Vertical status line left accent margin */}
                            <td className="p-0 border-r-0">
                              <div className={`w-1 h-14 ${rowStatusClass}`} />
                            </td>

                            {/* Foto column with clean thumbnail - "Y en el formato vista tiene q habe rimagenes pequeñas" */}
                            <td className="px-4 py-2.5">
                              <div className="w-16 h-12 rounded overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                                <img src={p.fotos[0]} className="w-full h-full object-cover group-hover:scale-110 duration-200" alt="Thumbnail" />
                              </div>
                            </td>

                            {/* Title & Location Column */}
                            <td className="px-4 py-2.5">
                              <div className="font-bold text-brand-dark leading-tight flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                                <span>{p.direccion}</span>
                              </div>
                              <div className="text-xs text-gray-400 mt-1 flex items-center gap-2.5 font-medium pl-5">
                                <span>{p.barrio}</span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleContactado(p.id);
                                  }}
                                  className={`px-2 py-1 text-[9px] font-bold rounded-full transition-all flex items-center justify-center gap-1 shrink-0 ${
                                    p.contactado 
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100' 
                                      : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                                  }`}
                                  title="Hacé click para cambiar estado de contacto"
                                >
                                  {p.contactado ? (
                                    <>
                                      <Check className="w-2.5 h-2.5 stroke-[3px]" />
                                      Contactado
                                    </>
                                  ) : (
                                    <>
                                      <Phone className="w-2.5 h-2.5 shrink-0" />
                                      Pendiente
                                    </>
                                  )}
                                </button>
                              </div>
                            </td>

                            {/* Price Column */}
                            <td className="px-4 py-2.5 whitespace-nowrap">
                              <div className="font-mono font-bold text-[#805600]">
                                {p.moneda} {p.precio.toLocaleString('es-AR')}
                              </div>
                            </td>

                            {/* Expensas Column */}
                            <td className="px-4 py-2.5 whitespace-nowrap">
                              <div className="font-mono font-semibold text-gray-500">
                                {p.moneda} {p.expensas ? p.expensas.toLocaleString('es-AR') : '0'}
                              </div>
                            </td>

                            {/* m2 Total Column */}
                            <td className="px-4 py-2.5 text-center whitespace-nowrap">
                              <span className="font-mono text-gray-700 font-bold">{p.m2_totales} m²</span>
                            </td>

                            {/* Ambientes Column */}
                            <td className="px-4 py-2.5 text-center whitespace-nowrap">
                              <span className="font-mono font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                                {p.ambientes} Amb
                              </span>
                            </td>

                            {/* Piso y orientacion */}
                            <td className="px-4 py-2.5 font-medium text-gray-500 whitespace-nowrap">
                              {p.piso || 'N/A'} / {p.orientacion || 'Est.'}
                            </td>

                            {/* Analista Personal notes editable column */}
                            <td className="px-4 py-2.5 max-w-xs">
                              {editingNotesId === p.id ? (
                                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                                  <input 
                                    type="text"
                                    value={editingNotesText}
                                    onChange={(e) => setEditingNotesText(e.target.value)}
                                    className="p-1.5 border border-gray-300 rounded text-xs text-brand-dark w-full bg-white font-medium focus:outline-none focus:ring-1 focus:ring-brand-primary"
                                    autoFocus
                                  />
                                  <button 
                                    onClick={() => saveEditingNotes(p.id)}
                                    className="bg-brand-secondary text-white px-2 py-1 rounded text-xs font-bold"
                                  >
                                    OK
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center justify-between group/notes">
                                  <p className="text-xs italic text-gray-500 truncate" title={p.notas}>
                                    {p.notas || "Agregale impresiones de tu visita..."}
                                  </p>
                                  <button
                                    onClick={(e) => startEditingNotes(p, e)}
                                    className="text-gray-400 hover:text-brand-primary p-1 bg-gray-50 group-hover/notes:opacity-100 opacity-0 duration-150 rounded shrink-0"
                                    title="Modificar notas"
                                  >
                                    ✍️
                                  </button>
                                </div>
                              )}
                            </td>

                            {/* Track Status Badge trigger + direct action columns */}
                            <td className="px-4 py-2.5 text-right" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-end gap-2.5">
                                {/* Direct follow status change dropdown */}
                                <select
                                  value={p.estado}
                                  onChange={(e) => updatePropertyStatus(p.id, e.target.value as EstadoPropiedad)}
                                  className="text-[10px] font-bold tracking-tight rounded-md border border-gray-200 px-1.5 py-1 focus:outline-none bg-white text-gray-600 cursor-pointer"
                                >
                                  <option value="Contactado">Contactado</option>
                                  <option value="Pendiente">Pendiente</option>
                                </select>

                                {/* Direct delete column */}
                                <button
                                  onClick={() => handleDeleteProperty(p.id)}
                                  className="p-1 px-2 rounded hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                                  title="Eliminar de mi lista"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ======================================= */}
      {/* PERSISTENT FULL DETAIL DIALOG OVERLAY */}
      {/* ======================================= */}
      {isDetailOpen && detailedProperty && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#141b2bb2] backdrop-blur-sm p-4 animate-fade-in" onClick={() => setIsDetailOpen(false)}>
          <div 
            className="bg-white border border-brand-outline/20 rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto custom-scrollbar animate-zoom-in relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Horizontal Status border bar */}
            <div className="h-1.5 bg-brand-primary w-full" />

            {/* Close */}
            <button 
              onClick={() => setIsDetailOpen(false)}
              className="absolute top-3 right-3 z-10 bg-white/85 hover:bg-white p-2 rounded-full text-brand-dark shadow transition"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Photos carousel or big illustration view */}
            <div className="relative h-56 bg-gray-100 select-none">
              <img src={detailedProperty.fotos[0]} className="w-full h-full object-cover" alt="Detalle" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <div>
                  <span className="px-2 py-0.5 bg-brand-accent text-brand-dark text-[10px] font-extrabold uppercase rounded tracking-wider">
                    {detailedProperty.estado}
                  </span>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <MapPin className="w-5 h-5 text-brand-accent shrink-0" />
                    <h3 className="text-white text-lg font-bold font-sans leading-snug">{detailedProperty.direccion}</h3>
                  </div>
                  <p className="text-white/80 text-xs mt-1 pl-6">{detailedProperty.barrio}</p>
                </div>
              </div>
            </div>

            {/* Information panel */}
            <div className="p-6 space-y-4">
              {/* Financial panel */}
              <div className="flex justify-between items-center bg-brand-light/70 p-4 rounded-lg border border-gray-100">
                <div>
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Valor Total</span>
                  <span className="font-mono text-2xl font-black text-brand-primary">
                    {detailedProperty.moneda} {detailedProperty.precio.toLocaleString('es-AR')}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Expensas calculadas</span>
                  <span className="font-mono text-sm font-bold text-gray-500">
                    {detailedProperty.moneda} {detailedProperty.expensas ? detailedProperty.expensas.toLocaleString('es-AR') : '0'}
                  </span>
                </div>
              </div>

              {/* Metrics specifications */}
              <div className="grid grid-cols-4 gap-3 text-center">
                <div className="border border-gray-100 rounded-lg p-2.5">
                  <span className="text-[10px] text-gray-400 font-bold uppercase block tracking-tight mb-0.5">Metros total</span>
                  <span className="font-mono text-xs font-extrabold text-brand-dark">{detailedProperty.m2_totales} m²</span>
                </div>
                <div className="border border-gray-100 rounded-lg p-2.5">
                  <span className="text-[10px] text-gray-400 font-bold uppercase block tracking-tight mb-0.5">Ambientes</span>
                  <span className="font-mono text-xs font-extrabold text-brand-dark">{detailedProperty.ambientes}</span>
                </div>
                <div className="border border-gray-100 rounded-lg p-2.5">
                  <span className="text-[10px] text-gray-400 font-bold uppercase block tracking-tight mb-0.5">Piso</span>
                  <span className="font-mono text-xs font-extrabold text-brand-dark">{detailedProperty.piso || 'N/A'}</span>
                </div>
                <div className="border border-gray-100 rounded-lg p-2.5">
                  <span className="text-[10px] text-gray-400 font-bold uppercase block tracking-tight mb-0.5">Orientación</span>
                  <span className="font-mono text-xs font-extrabold text-brand-dark">{detailedProperty.orientacion || 'Este'}</span>
                </div>
              </div>

              {/* Description quote text */}
              <div>
                <span className="text-xs font-bold text-brand-primary uppercase tracking-wide block mb-1">Descripción del aviso</span>
                <p className="text-xs text-gray-600 leading-relaxed font-sans">{detailedProperty.descripcion}</p>
              </div>

              {/* Personal notes section */}
              <div className="bg-brand-light/60 border-l-4 border-l-brand-accent p-3.5 rounded-r">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Mis anotaciones privadas</span>
                <p className="text-xs italic text-gray-600 leading-relaxed">
                  "{detailedProperty.notas || "Aún no registraste ninguna nota personal sobre esta propiedad. ¡Hacé click en editar para agregar anotaciones de llamadas o visitas!"}"
                </p>
              </div>

              {/* Footer metadata and platform origin */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                <span className="flex items-center gap-1 font-sans">
                  <Calendar className="w-3.5 h-3.5" />
                  Agregado el {detailedProperty.fecha_agregado}
                </span>

                <div className="flex items-center gap-2">
                  <span className="font-sans font-medium">Origen:</span>
                  <span className="font-bold uppercase tracking-wider bg-gray-100 text-gray-500 px-2 py-0.5 rounded-sm">
                    {detailedProperty.plataforma}
                  </span>
                  
                  {detailedProperty.url_original.startsWith('http') && (
                    <a 
                      href={detailedProperty.url_original} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-brand-primary font-bold hover:underline flex items-center gap-0.5 shrink-0"
                    >
                      Original
                      <Maximize2 className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================= */}
      {/* THE "+ Agregar/Cargar" DIALOG HAPPY PATH */}
      {/* ======================================= */}
      {isAddModalOpen && (
        <NuevaPropiedadModal 
          onClose={() => setIsAddModalOpen(false)}
          onAddProperty={handleAddNewProperty}
        />
      )}

      {/* ======================================= */}
      {/* COMPANION MOBILE BOTTOM NAVIGATION BAR */}
      {/* ======================================= */}
      <footer className="md:hidden fixed bottom-0 left-0 w-full z-40 bg-white border-t border-gray-200 shadow-lg flex justify-around items-center h-14 select-none">
        <button 
          onClick={() => setActiveView('fichas')}
          className={`flex flex-col items-center justify-center flex-1 h-full text-[10px] font-bold tracking-tight py-1 ${
            activeView === 'fichas' ? 'text-brand-primary' : 'text-gray-400'
          }`}
        >
          <GridIcon className="w-5 h-5 mb-0.5" />
          Fichas
        </button>
        <button 
          onClick={() => setActiveView('tabla')}
          className={`flex flex-col items-center justify-center flex-1 h-full text-[10px] font-bold tracking-tight py-1 ${
            activeView === 'tabla' ? 'text-brand-primary' : 'text-gray-400'
          }`}
        >
          <TableIcon className="w-5 h-5 mb-0.5" />
          Tabla
        </button>
        <button 
          onClick={() => setActiveView('mapa')}
          className={`flex flex-col items-center justify-center flex-1 h-full text-[10px] font-bold tracking-tight py-1 ${
            activeView === 'mapa' ? 'text-brand-primary' : 'text-gray-400'
          }`}
        >
          <MapIcon className="w-5 h-5 mb-0.5" />
          Mapa
        </button>
      </footer>

      {/* Spacing alignment helper for Responsive Bottom-Bar on Mobile screens */}
      <div className="h-14 md:hidden shrink-0 select-none bg-white font-sans" />

    </div>
  );
}
