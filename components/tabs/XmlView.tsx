
import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface XmlViewProps {
  xml: string;
}

const XmlView: React.FC<XmlViewProps> = ({ xml }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(xml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-900 rounded-lg">
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-white">XML JATS Generado</h3>
        <button
          onClick={handleCopy}
          className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm flex items-center gap-2"
        >
          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copiado!' : 'Copiar'}
        </button>
      </div>
      <div className="max-h-[60vh] overflow-auto p-4">
        <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap break-all">{xml}</pre>
      </div>
    </div>
  );
};

export default XmlView;
