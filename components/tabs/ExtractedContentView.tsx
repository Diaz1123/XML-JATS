
import React from 'react';
import type { ExtractedContent } from '../../types';

interface ExtractedContentViewProps {
  content: ExtractedContent;
}

const InfoCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-gray-50 rounded-lg p-4 border">
    <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
    {children}
  </div>
);

const ExtractedContentView: React.FC<ExtractedContentViewProps> = ({ content }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard title="Título (Español)">
          <p className="text-sm bg-white p-2 rounded border">{content.titleEs || 'No detectado'}</p>
        </InfoCard>
        <InfoCard title="Título (Inglés)">
          <p className="text-sm bg-white p-2 rounded border">{content.titleEn || 'No detectado'}</p>
        </InfoCard>
      </div>

      <InfoCard title={`Autores (${content.authors?.length || 0})`}>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {content.authors?.length > 0 ? (
            content.authors.map((author, idx) => (
              <div key={idx} className="text-sm bg-white p-2 rounded border">
                <div className="font-medium">{author.givenNames} {author.surname}</div>
                {author.orcid && <div className="text-gray-600">ORCID: {author.orcid}</div>}
                {author.email && <div className="text-gray-600">Email: {author.email}</div>}
              </div>
            ))
          ) : <p className="text-sm text-gray-500 italic">No detectados</p>}
        </div>
      </InfoCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <InfoCard title="Resumen (Español)">
          <div className="bg-white p-2 rounded border max-h-40 overflow-y-auto">
            <p className="text-sm">{content.abstractEs || 'No detectado'}</p>
          </div>
        </InfoCard>
        <InfoCard title="Abstract (Inglés)">
          <div className="bg-white p-2 rounded border max-h-40 overflow-y-auto">
            <p className="text-sm">{content.abstractEn || 'No detectado'}</p>
          </div>
        </InfoCard>
      </div>

       <InfoCard title={`Secciones Detectadas (${content.sections?.length || 0})`}>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {content.sections?.map((section, idx) => (
              <details key={idx} className="bg-white p-2 rounded border text-sm">
                <summary className="font-medium cursor-pointer">{section.title}</summary>
                <p className="text-gray-700 mt-2 whitespace-pre-wrap">{section.content.substring(0, 300)}...</p>
              </details>
            ))}
          </div>
       </InfoCard>
    </div>
  );
};

export default ExtractedContentView;
