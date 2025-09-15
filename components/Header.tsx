
import React from 'react';
import { FileText, RotateCcw } from 'lucide-react';

interface HeaderProps {
    onReset: () => void;
    showReset: boolean;
}

const Header: React.FC<HeaderProps> = ({ onReset, showReset }) => {
    return (
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-4">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-lg flex-shrink-0">
                    <FileText className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Conversor IA para SciELO JATS</h1>
                    <p className="text-gray-600">Transforma DOCX a XML JATS (SPS 1.9) con Gemini AI</p>
                </div>
            </div>
            {showReset && (
              <button
                onClick={onReset}
                className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                Nuevo Documento
              </button>
            )}
        </header>
    );
}

export default Header;
