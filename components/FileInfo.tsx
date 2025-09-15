
import React from 'react';
import { CheckCircle, Download, FileText } from 'lucide-react';

interface FileInfoProps {
  file: File;
  xmlOutput: string;
  qaReport: string;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};


const FileInfo: React.FC<FileInfoProps> = ({ file, xmlOutput, qaReport }) => {
  const baseFilename = file.name.replace(/\.docx$/, '');

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-green-900">Documento procesado con éxito</h3>
            <p className="text-green-700 text-sm">{file.name} ({formatFileSize(file.size)})</p>
          </div>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={() => downloadFile(xmlOutput, `${baseFilename}.xml`, 'application/xml')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
          >
            <Download className="w-4 h-4" />
            <span>XML</span>
          </button>
          <button
            onClick={() => downloadFile(qaReport, `QA_Report_${baseFilename}.md`, 'text/markdown')}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
          >
            <FileText className="w-4 h-4" />
            <span>Reporte</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileInfo;
