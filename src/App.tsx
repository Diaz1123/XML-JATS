
import React, { useState, useCallback, useRef } from 'react';
import * as mammoth from 'mammoth';
import { extractArticleStructure } from './services/geminiService';
import { generateJatsXml } from './services/jatsService';
import { generateQAReport } from './services/qaService';
import type { AppState, ExtractedContent, JournalConfig } from './types';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import ProcessingView from './components/ProcessingView';
import ResultsDisplay from './components/ResultsDisplay';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({ status: 'idle' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = useCallback(() => {
    setAppState({ status: 'idle' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.docx')) {
      alert('Por favor selecciona un archivo .docx válido');
      return;
    }

    setAppState({ status: 'processing', file: selectedFile, step: 'extracting' });

    try {
      // Step 1: Extract raw text from DOCX
      const arrayBuffer = await selectedFile.arrayBuffer();
      const textResult = await mammoth.extractRawText({ arrayBuffer });
      const rawText = textResult.value;

      // FIX: Safely update state by checking for 'processing' status to satisfy TypeScript and carry over the 'file' property.
      setAppState(prev => {
        if (prev.status !== 'processing') return prev;
        return { ...prev, step: 'analyzing' };
      });

      // Step 2: Use Gemini to get structured data
      const extractedContent = await extractArticleStructure(rawText);

      // FIX: Safely update state by checking for 'processing' status to satisfy TypeScript and carry over the 'file' property.
      setAppState(prev => {
        if (prev.status !== 'processing') return prev;
        return { ...prev, step: 'generating' };
      });
      
      // Step 3: Generate config, XML, and QA Report
      const config = generateAutoConfig(extractedContent);
      const xmlOutput = generateJatsXml(extractedContent, config);
      const qaReport = generateQAReport(extractedContent, config, xmlOutput);

      // Step 4: Set success state with all data
      setAppState({
        status: 'success',
        file: selectedFile,
        extractedContent,
        config,
        xmlOutput,
        qaReport,
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      console.error('Error processing document:', error);
      setAppState({ status: 'error', error: errorMessage });
    }
  }, []);

  const generateAutoConfig = (content: ExtractedContent): JournalConfig => {
    const journalId = 'journal';
    const articleId = Math.floor(10000 + Math.random() * 90000);
    const currentYear = new Date().getFullYear();
    
    return {
      journal: {
        publisher_id: journalId,
        title: 'Revista Científica (Auto-Detectada)',
        abbrev_title: 'Rev Cient',
        pissn: '0000-0000',
        eissn: '2000-0000',
        publisher: 'Editorial Académica (Auto-Detectada)'
      },
      article: {
        doi: `10.5555/${journalId}.v1.i1.${articleId}`,
        volume: '1',
        issue: '1',
        elocation: `e${articleId}`,
        pub_date: new Date().toISOString().split('T')[0],
        collection_year: currentYear.toString(),
        license_url: 'https://creativecommons.org/licenses/by/4.0/',
        article_type: content.articleType || 'research-article'
      },
    };
  };

  const renderContent = () => {
    switch (appState.status) {
      case 'idle':
        return <FileUpload onFileSelect={handleFileSelect} fileInputRef={fileInputRef} />;
      case 'processing':
        return <ProcessingView step={appState.step} />;
      case 'success':
        return <ResultsDisplay data={appState} />;
      case 'error':
        return (
          <div className="text-center p-12 bg-red-50 border-2 border-dashed border-red-300 rounded-lg">
            <h3 className="text-2xl font-semibold text-red-800">Error en el Procesamiento</h3>
            <p className="text-red-600 mt-2 mb-6">{appState.error}</p>
            <button
              onClick={resetState}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Intentar de Nuevo
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8">
          <Header onReset={resetState} showReset={appState.status !== 'idle' && appState.status !== 'processing'} />
          <main className="mt-8">
            {renderContent()}
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default App;
