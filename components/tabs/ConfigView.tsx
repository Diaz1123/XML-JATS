
import React from 'react';
import type { JournalConfig } from '../../types';

interface ConfigViewProps {
  config: JournalConfig;
}

const ConfigField: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <p className="bg-gray-100 p-2 rounded text-sm border">{value}</p>
  </div>
);

const ConfigView: React.FC<ConfigViewProps> = ({ config }) => {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-1">Configuración Auto-generada</h3>
        <p className="text-blue-700 text-sm">
          Esta configuración se generó automáticamente. En una versión futura, podría ser editable.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-4 text-lg">Información de la Revista</h4>
          <div className="space-y-3">
            <ConfigField label="Título" value={config.journal.title} />
            <ConfigField label="ISSN Impreso" value={config.journal.pissn} />
            <ConfigField label="eISSN" value={config.journal.eissn} />
            <ConfigField label="Editorial" value={config.journal.publisher} />
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-4 text-lg">Información del Artículo</h4>
          <div className="space-y-3">
            <ConfigField label="DOI" value={config.article.doi} />
            <div className="grid grid-cols-2 gap-3">
              <ConfigField label="Volumen" value={config.article.volume} />
              <ConfigField label="e-location" value={config.article.elocation} />
            </div>
            <ConfigField label="Fecha de Publicación" value={config.article.pub_date} />
            <ConfigField label="Tipo de Artículo" value={config.article.article_type} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigView;
