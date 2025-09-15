
import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-center">
              <div>
                <span className="font-semibold text-blue-900">Estándar:</span>
                <p className="text-blue-700">JATS Publishing 1.1</p>
              </div>
              <div>
                <span className="font-semibold text-blue-900">Perfil:</span>
                <p className="text-blue-700">SciELO SPS 1.9</p>
              </div>
              <div>
                <span className="font-semibold text-blue-900">Validación:</span>
                <p className="text-blue-700">DTD + Reglas SPS</p>
              </div>
              <div>
                <span className="font-semibold text-blue-900">Motor IA:</span>
                <p className="text-blue-700">Google Gemini</p>
              </div>
            </div>
        </footer>
    );
};

export default Footer;
