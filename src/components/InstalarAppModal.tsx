import React, { useState } from 'react';
import { X, Share2, Plus, Smartphone } from 'lucide-react';

interface InstalarAppModalProps {
  onClose: () => void;
}

type OS = 'ios' | 'android';

const STEPS: Record<OS, { icon: React.ReactNode; text: string }[]> = {
  ios: [
    {
      icon: <Share2 className="w-5 h-5 text-[#E8A838]" />,
      text: 'Abrí la propiedad en ZonaProp desde Safari.'
    },
    {
      icon: (
        <svg className="w-5 h-5 text-[#E8A838]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
          <polyline points="16 6 12 2 8 6" />
          <line x1="12" y1="2" x2="12" y2="15" />
        </svg>
      ),
      text: 'Tocá el botón de compartir (la cajita con la flecha hacia arriba).'
    },
    {
      icon: <Plus className="w-5 h-5 text-[#E8A838]" />,
      text: 'Deslizá y elegí "Agregar a pantalla de inicio".'
    },
    {
      icon: <Smartphone className="w-5 h-5 text-[#E8A838]" />,
      text: 'Ahora desde cualquier propiedad, compartí directo a Mi Lista Hogar.'
    }
  ],
  android: [
    {
      icon: <Share2 className="w-5 h-5 text-[#E8A838]" />,
      text: 'Abrí la propiedad en ZonaProp desde Chrome.'
    },
    {
      icon: (
        <svg className="w-5 h-5 text-[#E8A838]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="5" r="1" fill="currentColor" />
          <circle cx="12" cy="12" r="1" fill="currentColor" />
          <circle cx="12" cy="19" r="1" fill="currentColor" />
        </svg>
      ),
      text: 'Tocá el menú (los tres puntos) arriba a la derecha.'
    },
    {
      icon: <Plus className="w-5 h-5 text-[#E8A838]" />,
      text: 'Elegí "Agregar a pantalla principal" o "Instalar app".'
    },
    {
      icon: <Smartphone className="w-5 h-5 text-[#E8A838]" />,
      text: 'Ahora desde cualquier propiedad, compartí directo a Mi Lista Hogar.'
    }
  ]
};

export default function InstalarAppModal({ onClose }: InstalarAppModalProps) {
  const [os, setOs] = useState<OS>('ios');

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#FDF6E8] px-5 pt-5 pb-4 border-b border-[#E8A838]/20">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-7 h-7 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
          <div className="flex items-center gap-3 pr-8">
            <div className="w-10 h-10 rounded-xl bg-[#E8A838]/15 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5 text-[#E8A838]" />
            </div>
            <div>
              <h2 className="font-bold text-brand-dark text-base leading-tight">Instalá la app en tu celu</h2>
              <p className="text-xs text-gray-500 mt-0.5">Y compartí propiedades en un toque</p>
            </div>
          </div>
        </div>

        {/* OS toggle */}
        <div className="flex gap-2 px-5 pt-4">
          {(['ios', 'android'] as OS[]).map(option => (
            <button
              key={option}
              onClick={() => setOs(option)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                os === option
                  ? 'bg-brand-dark text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {option === 'ios' ? 'iPhone (Safari)' : 'Android (Chrome)'}
            </button>
          ))}
        </div>

        {/* Steps */}
        <div className="px-5 pt-4 pb-5 space-y-3">
          {STEPS[os].map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#E8A838]/10 flex items-center justify-center shrink-0">
                {step.icon}
              </div>
              <div className="flex-1 pt-0.5">
                <span className="text-[10px] font-bold text-[#E8A838] mr-1.5">Paso {i + 1}</span>
                <span className="text-sm text-gray-600 leading-snug">{step.text}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer tip */}
        <div className="mx-5 mb-5 bg-gray-50 rounded-xl px-4 py-3 flex items-start gap-2 border border-gray-100">
          <Share2 className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
          <p className="text-xs text-gray-500 leading-relaxed">
            Una vez instalada, vas a ver <strong className="text-brand-dark">Mi Lista Hogar</strong> como opción al tocar "Compartir" desde ZonaProp, Argenprop o MercadoLibre.
          </p>
        </div>
      </div>
    </div>
  );
}
