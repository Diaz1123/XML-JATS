
import React from 'react';
import { Upload, Zap } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, fileInputRef }) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-dashed border-blue-300 rounded-lg p-8 sm:p-12 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="bg-blue-100 p-4 rounded-full">
          <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600" />
        </div>
        <div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">Conversión Asistida por IA</h3>
          <p className="text-gray-600 mb-6 max-w-lg mx-auto">
            Arrastra tu documento Word (.docx). La IA analizará la estructura y generará el XML JATS compatible con SciELO.
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={onFileSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
          >
            <Zap className="w-6 h-6 inline mr-2" />
            Seleccionar y Convertir
          </button>
        </div>
        <div className="text-sm text-gray-500 mt-4 text-left bg-blue-100/50 p-3 rounded-md border border-blue-200">
          <p className="font-semibold">✨ La IA detectará automáticamente:</p>
          <ul className="list-disc list-inside mt-1">
            <li>Títulos, resúmenes y palabras clave</li>
            <li>Autores, afiliaciones, ORCID y emails</li>
            <li>Secciones, figuras, tablas y referencias</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
