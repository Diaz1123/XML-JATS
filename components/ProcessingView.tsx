
import React from 'react';
import type { ProcessingStep } from '../types';

interface ProcessingViewProps {
  step: ProcessingStep;
}

const stepMessages: Record<ProcessingStep, string> = {
  extracting: 'Extrayendo texto del documento Word...',
  analyzing: 'La IA está analizando la estructura del artículo...',
  generating: 'Generando XML JATS y reporte de calidad...',
};

const ProcessingView: React.FC<ProcessingViewProps> = ({ step }) => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-8">
      <div className="flex items-center gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
        <div>
          <h3 className="font-semibold text-blue-900">Procesando documento...</h3>
          <p className="text-blue-700">{stepMessages[step]}</p>
        </div>
      </div>
    </div>
  );
};

export default ProcessingView;
