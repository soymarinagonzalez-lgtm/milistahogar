/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';

interface OnboardingModalProps {
  onClose: () => void;
}

const slides = [
  {
    illustration: (
      <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Background shapes */}
        <ellipse cx="200" cy="260" rx="160" ry="20" fill="#F3EFE8" />
        {/* House */}
        <rect x="110" y="140" width="180" height="120" rx="4" fill="#FFF9EF" stroke="#E8A838" strokeWidth="2" />
        {/* Roof */}
        <polygon points="95,145 200,60 305,145" fill="#E8A838" />
        <polygon points="95,145 200,60 305,145" fill="#E8A838" stroke="#C8882A" strokeWidth="1.5" />
        {/* Door */}
        <rect x="175" y="195" width="50" height="65" rx="4" fill="#8B5A00" />
        <circle cx="218" cy="228" r="4" fill="#E8A838" />
        {/* Windows */}
        <rect x="125" y="165" width="45" height="40" rx="3" fill="#BDE3FF" stroke="#90C5EA" strokeWidth="1.5" />
        <line x1="147" y1="165" x2="147" y2="205" stroke="#90C5EA" strokeWidth="1" />
        <line x1="125" y1="185" x2="170" y2="185" stroke="#90C5EA" strokeWidth="1" />
        <rect x="230" y="165" width="45" height="40" rx="3" fill="#BDE3FF" stroke="#90C5EA" strokeWidth="1.5" />
        <line x1="252" y1="165" x2="252" y2="205" stroke="#90C5EA" strokeWidth="1" />
        <line x1="230" y1="185" x2="275" y2="185" stroke="#90C5EA" strokeWidth="1" />
        {/* Stars */}
        <circle cx="60" cy="80" r="5" fill="#E8A838" opacity="0.6" />
        <circle cx="340" cy="60" r="7" fill="#E8A838" opacity="0.4" />
        <circle cx="350" cy="110" r="4" fill="#E8A838" opacity="0.5" />
        {/* Heart */}
        <path d="M320 40 C320 35 315 30 308 35 C302 30 297 35 297 40 C297 48 308 58 308 58 C308 58 320 48 320 40Z" fill="#E8A838" opacity="0.7" />
        {/* Person */}
        <circle cx="348" cy="200" r="18" fill="#F5CBA7" />
        <rect x="333" y="218" width="30" height="42" rx="6" fill="#5B8FDB" />
        <line x1="333" y1="230" x2="315" y2="250" stroke="#5B8FDB" strokeWidth="8" strokeLinecap="round" />
        <line x1="363" y1="230" x2="375" y2="255" stroke="#5B8FDB" strokeWidth="8" strokeLinecap="round" />
        <line x1="340" y1="260" x2="338" y2="280" stroke="#4A4A8A" strokeWidth="7" strokeLinecap="round" />
        <line x1="356" y1="260" x2="358" y2="280" stroke="#4A4A8A" strokeWidth="7" strokeLinecap="round" />
        {/* Clipboard */}
        <rect x="28" y="155" width="55" height="70" rx="4" fill="white" stroke="#E8A838" strokeWidth="1.5" />
        <rect x="38" y="148" width="35" height="12" rx="3" fill="#E8A838" />
        <line x1="36" y1="175" x2="73" y2="175" stroke="#D1C5B0" strokeWidth="1.5" />
        <line x1="36" y1="185" x2="73" y2="185" stroke="#D1C5B0" strokeWidth="1.5" />
        <line x1="36" y1="195" x2="60" y2="195" stroke="#D1C5B0" strokeWidth="1.5" />
        <circle cx="36" cy="175" r="2.5" fill="#E8A838" />
        <circle cx="36" cy="185" r="2.5" fill="#E8A838" />
        <circle cx="36" cy="195" r="2.5" fill="#E8A838" />
      </svg>
    ),
    title: 'Tu lista personal de propiedades',
    description: 'Guardá todos los departamentos que te interesan en un solo lugar. Organizá tu búsqueda de hogar sin perder ninguna oportunidad.',
    color: 'from-amber-50 to-orange-50',
    accent: '#E8A838',
  },
  {
    illustration: (
      <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <ellipse cx="200" cy="270" rx="170" ry="18" fill="#EEF3FF" />
        {/* Map background */}
        <rect x="40" y="60" width="260" height="185" rx="12" fill="#E9EDFF" stroke="#C3CCE9" strokeWidth="1.5" />
        {/* Streets */}
        <line x1="40" y1="130" x2="300" y2="130" stroke="#D3DAEF" strokeWidth="8" />
        <line x1="40" y1="190" x2="300" y2="190" stroke="#D3DAEF" strokeWidth="8" />
        <line x1="120" y1="60" x2="120" y2="245" stroke="#D3DAEF" strokeWidth="8" />
        <line x1="210" y1="60" x2="210" y2="245" stroke="#D3DAEF" strokeWidth="8" />
        {/* Blocks */}
        <rect x="50" y="70" width="60" height="50" rx="3" fill="#DCE2F7" />
        <rect x="130" y="70" width="70" height="50" rx="3" fill="#DCE2F7" />
        <rect x="220" y="70" width="70" height="50" rx="3" fill="#DCE2F7" />
        <rect x="50" y="140" width="60" height="40" rx="3" fill="#DCE2F7" />
        <rect x="220" y="140" width="70" height="40" rx="3" fill="#DCE2F7" />
        <rect x="50" y="200" width="60" height="35" rx="3" fill="#DCE2F7" />
        <rect x="130" y="200" width="70" height="35" rx="3" fill="#DCE2F7" />
        <rect x="220" y="200" width="70" height="35" rx="3" fill="#DCE2F7" />
        {/* Map pins */}
        <g transform="translate(155,90)">
          <circle cx="0" cy="0" r="14" fill="#E8A838" />
          <circle cx="0" cy="0" r="7" fill="white" />
          <line x1="0" y1="14" x2="0" y2="28" stroke="#E8A838" strokeWidth="3" strokeLinecap="round" />
        </g>
        <g transform="translate(80,155)">
          <circle cx="0" cy="0" r="11" fill="#5B8FDB" />
          <circle cx="0" cy="0" r="5" fill="white" />
          <line x1="0" y1="11" x2="0" y2="22" stroke="#5B8FDB" strokeWidth="2.5" strokeLinecap="round" />
        </g>
        <g transform="translate(248,163)">
          <circle cx="0" cy="0" r="11" fill="#10B981" />
          <circle cx="0" cy="0" r="5" fill="white" />
          <line x1="0" y1="11" x2="0" y2="22" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
        </g>
        {/* Cursor/hand */}
        <g transform="translate(290,50)">
          <path d="M0 30 L0 5 Q0 0 5 0 Q10 0 10 5 L10 18 Q12 14 16 14 Q21 14 21 19 L21 22 Q23 18 27 18 Q32 18 32 23 L32 35 Q32 50 20 50 L8 50 Q0 50 0 40 Z" fill="#F5CBA7" stroke="#E0B090" strokeWidth="1" />
        </g>
      </svg>
    ),
    title: 'Visualizá en mapa',
    description: 'Ubicá cada propiedad en el mapa de la ciudad. Compará barrios, distancias y encontrá el lugar perfecto para vivir.',
    color: 'from-blue-50 to-indigo-50',
    accent: '#5B8FDB',
  },
  {
    illustration: (
      <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <ellipse cx="200" cy="268" rx="155" ry="18" fill="#EDFAF4" />
        {/* Checklist card */}
        <rect x="80" y="40" width="240" height="210" rx="12" fill="white" stroke="#E0E7F0" strokeWidth="1.5" />
        <rect x="80" y="40" width="240" height="44" rx="12" fill="#10B981" />
        <rect x="80" y="68" width="240" height="16" fill="#10B981" />
        <text x="200" y="68" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="sans-serif">Mi lista de propiedades</text>
        {/* Items */}
        {/* Item 1 - checked */}
        <rect x="100" y="100" width="200" height="36" rx="6" fill="#F0FDF8" stroke="#A7F3D0" strokeWidth="1" />
        <circle cx="120" cy="118" r="10" fill="#10B981" />
        <path d="M114 118 L118 122 L126 114" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="138" y="111" width="100" height="6" rx="3" fill="#D1FAE5" />
        <rect x="138" y="121" width="70" height="5" rx="2.5" fill="#D1FAE5" />
        {/* Item 2 - checked */}
        <rect x="100" y="146" width="200" height="36" rx="6" fill="#F0FDF8" stroke="#A7F3D0" strokeWidth="1" />
        <circle cx="120" cy="164" r="10" fill="#10B981" />
        <path d="M114 164 L118 168 L126 160" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="138" y="157" width="120" height="6" rx="3" fill="#D1FAE5" />
        <rect x="138" y="167" width="80" height="5" rx="2.5" fill="#D1FAE5" />
        {/* Item 3 - pending */}
        <rect x="100" y="192" width="200" height="36" rx="6" fill="#FFFBEB" stroke="#FDE68A" strokeWidth="1" />
        <circle cx="120" cy="210" r="10" fill="none" stroke="#F59E0B" strokeWidth="2" strokeDasharray="3 2" />
        <rect x="138" y="203" width="90" height="6" rx="3" fill="#FEF3C7" />
        <rect x="138" y="213" width="60" height="5" rx="2.5" fill="#FEF3C7" />
        {/* Stars floating */}
        <path d="M338 90 L342 102 L355 102 L344 110 L348 122 L338 114 L328 122 L332 110 L321 102 L334 102 Z" fill="#E8A838" opacity="0.8" />
        <path d="M62 170 L65 179 L74 179 L67 184 L70 193 L62 188 L54 193 L57 184 L50 179 L59 179 Z" fill="#E8A838" opacity="0.5" />
        {/* Person */}
        <circle cx="345" cy="210" r="18" fill="#F5CBA7" />
        <rect x="330" y="228" width="30" height="38" rx="6" fill="#10B981" />
        <line x1="330" y1="238" x2="314" y2="255" stroke="#10B981" strokeWidth="7" strokeLinecap="round" />
        <line x1="360" y1="238" x2="374" y2="258" stroke="#10B981" strokeWidth="7" strokeLinecap="round" />
      </svg>
    ),
    title: 'Seguí tu proceso',
    description: 'Marcá cuáles ya contactaste, calificá con estrellas y anotá tus impresiones. Todo en un solo lugar para tomar la mejor decisión.',
    color: 'from-emerald-50 to-teal-50',
    accent: '#10B981',
  },
];

export default function OnboardingModal({ onClose }: OnboardingModalProps) {
  const [step, setStep] = useState(0);
  const current = slides[step];
  const isLast = step === slides.length - 1;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-dark/60 backdrop-blur-sm animate-fade-in">
      <div className={`relative bg-gradient-to-br ${current.color} rounded-2xl shadow-2xl w-full max-w-md overflow-hidden`}>

        {/* Skip button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-xs text-gray-400 hover:text-gray-600 font-medium transition-colors z-10"
        >
          Saltar
        </button>

        {/* Illustration */}
        <div className="h-52 w-full px-8 pt-8 pb-2">
          {current.illustration}
        </div>

        {/* Content */}
        <div className="px-8 pb-8 pt-2">
          {/* Step dots */}
          <div className="flex gap-1.5 justify-center mb-5">
            {slides.map((_, i) => (
              <div
                key={i}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: i === step ? '24px' : '6px',
                  backgroundColor: i === step ? current.accent : '#D1D5DB',
                }}
              />
            ))}
          </div>

          <h2 className="font-sans font-bold text-xl text-brand-dark text-center mb-2 leading-tight">
            {current.title}
          </h2>
          <p className="text-sm text-gray-500 text-center leading-relaxed mb-6">
            {current.description}
          </p>

          {/* Actions */}
          <div className="flex gap-3">
            {step > 0 && (
              <button
                onClick={() => setStep(s => s - 1)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-white transition-all"
              >
                Atrás
              </button>
            )}
            <button
              onClick={() => isLast ? onClose() : setStep(s => s + 1)}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: current.accent }}
            >
              {isLast ? '¡Empezar!' : 'Siguiente'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
