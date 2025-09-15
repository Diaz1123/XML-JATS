
import React from 'react';

interface QaReportViewProps {
  report: string;
}

const QaReportView: React.FC<QaReportViewProps> = ({ report }) => {
  // A simple markdown to HTML-like renderer for better display
  const renderReport = (text: string) => {
    return text
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('# ')) return <h1 key={index} className="text-2xl font-bold mt-4 mb-2 text-gray-900">{line.substring(2)}</h1>;
        if (line.startsWith('## ')) return <h2 key={index} className="text-xl font-semibold mt-3 mb-1 text-gray-800 border-b pb-1">{line.substring(3)}</h2>;
        if (line.startsWith('**')) return <p key={index} className="font-bold my-1">{line.replace(/\*\*/g, '')}</p>;
        if (line.startsWith('- ')) return <li key={index} className="ml-5 list-disc">{line.substring(2)}</li>;
        if (line.trim() === '---') return <hr key={index} className="my-4" />;
        return <p key={index} className="my-1">{line}</p>;
      });
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6 border">
      <div className="max-h-[60vh] overflow-auto text-gray-700 text-sm prose">
        {renderReport(report)}
      </div>
    </div>
  );
};

export default QaReportView;
