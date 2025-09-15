
import React, { useState } from 'react';
import { Eye, Code, AlertCircle, Settings } from 'lucide-react';
import type { AppState } from '../types';
import FileInfo from './FileInfo';
import ExtractedContentView from './tabs/ExtractedContentView';
import XmlView from './tabs/XmlView';
import QaReportView from './tabs/QaReportView';
import ConfigView from './tabs/ConfigView';

interface ResultsDisplayProps {
  data: Extract<AppState, { status: 'success' }>;
}

type Tab = 'extracted' | 'xml' | 'qa' | 'config';

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'extracted', label: 'Contenido Extraído', icon: Eye },
  { id: 'xml', label: 'XML JATS', icon: Code },
  { id: 'qa', label: 'Reporte de Calidad', icon: AlertCircle },
  { id: 'config', label: 'Configuración', icon: Settings },
];

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<Tab>('extracted');

  return (
    <div className="space-y-6">
      <FileInfo file={data.file} xmlOutput={data.xmlOutput} qaReport={data.qaReport} />
      <div>
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2
                `}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-6">
          {activeTab === 'extracted' && <ExtractedContentView content={data.extractedContent} />}
          {activeTab === 'xml' && <XmlView xml={data.xmlOutput} />}
          {activeTab === 'qa' && <QaReportView report={data.qaReport} />}
          {activeTab === 'config' && <ConfigView config={data.config} />}
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;
