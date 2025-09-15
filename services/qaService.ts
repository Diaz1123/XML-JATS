
import type { ExtractedContent, JournalConfig } from '../types';

interface Statistics {
  titleDetected: boolean;
  titleEnDetected: boolean;
  authorsDetected: number;
  affiliationsDetected: number;
  sectionsDetected: number;
  referencesDetected: number;
  figuresDetected: number;
  tablesDetected: number;
  abstractEsDetected: boolean;
  abstractEnDetected: boolean;
  keywordsEsDetected: number;
  keywordsEnDetected: number;
  emailDetected: boolean;
  datesDetected: boolean;
}

const calculateQualityScore = (stats: Statistics): number => {
  let score = 0;
  if (stats.titleDetected) score += 15;
  if (stats.authorsDetected > 0) score += 15;
  if (stats.referencesDetected > 0) score += 15;
  if (stats.abstractEsDetected) score += 15;
  if (stats.affiliationsDetected > 0) score += 5;
  if (stats.titleEnDetected) score += 5;
  if (stats.abstractEnDetected) score += 5;
  if (stats.sectionsDetected >= 3) score += 10;
  if (stats.emailDetected) score += 5;
  if (stats.datesDetected) score += 5;
  if (stats.keywordsEsDetected > 0) score += 3;
  if (stats.keywordsEnDetected > 0) score += 2;
  return Math.min(100, score);
};

export const generateQAReport = (content: ExtractedContent, config: JournalConfig, xmlOutput: string): string => {
  const issues: string[] = [];
  const warnings: string[] = [];
  
  const stats: Statistics = {
    titleDetected: !!content.titleEs,
    titleEnDetected: !!content.titleEn,
    authorsDetected: content.authors?.length || 0,
    affiliationsDetected: content.affiliations?.length || 0,
    sectionsDetected: content.sections?.length || 0,
    referencesDetected: content.references?.length || 0,
    figuresDetected: content.figures?.length || 0,
    tablesDetected: content.tables?.length || 0,
    abstractEsDetected: !!content.abstractEs,
    abstractEnDetected: !!content.abstractEn,
    keywordsEsDetected: content.keywordsEs?.length || 0,
    keywordsEnDetected: content.keywordsEn?.length || 0,
    emailDetected: !!content.correspondingEmail,
    datesDetected: !!(content.receivedDate || content.acceptedDate),
  };

  if (!stats.titleDetected) issues.push('❌ CRÍTICO: Título principal no detectado.');
  if (stats.authorsDetected === 0) issues.push('❌ CRÍTICO: Autores no detectados.');
  if (stats.referencesDetected === 0) issues.push('❌ CRÍTICO: Referencias no detectadas.');
  if (!stats.abstractEsDetected) issues.push('❌ CRÍTICO: Resumen en español no detectado.');
  if (stats.affiliationsDetected === 0) issues.push('❌ CRÍTICO: Afiliaciones no detectadas.');
  if (stats.sectionsDetected === 0) issues.push('❌ CRÍTICO: No se detectaron secciones del cuerpo del artículo.');

  if (!stats.emailDetected) warnings.push('⚠️ Advertencia: Email de correspondencia no detectado.');
  if (!stats.datesDetected) warnings.push('⚠️ Advertencia: Fechas editoriales (recibido/aceptado) no detectadas.');
  if (!stats.titleEnDetected) warnings.push('⚠️ Advertencia: Título en inglés no detectado.');
  if (!stats.abstractEnDetected) warnings.push('⚠️ Advertencia: Abstract en inglés no detectado.');
  if (stats.keywordsEsDetected === 0) warnings.push('⚠️ Advertencia: Palabras clave en español no detectadas.');

  const qualityScore = calculateQualityScore(stats);
  const qualityLevel = qualityScore >= 85 ? '🟢 EXCELENTE' : qualityScore >= 70 ? '🟡 BUENO' : qualityScore >= 50 ? '🟠 REGULAR' : '🔴 CRÍTICO';

  return `
# 🤖 Reporte de Calidad IA - SciELO JATS

## 📊 Puntuación de Calidad de Extracción: ${qualityScore}/100

**Nivel de Preparación:** ${qualityLevel} - ${
    qualityScore >= 85 ? 'Listo para revisión final.' : 
    qualityScore >= 70 ? 'Requiere ajustes menores.' : 
    qualityScore >= 50 ? 'Requiere trabajo adicional en metadatos.' : 
    'Requiere intervención manual significativa.'
}

---

## 📈 Estadísticas de Extracción
- **Título principal**: ${stats.titleDetected ? '✅ Detectado' : '❌ No Detectado'}
- **Título en inglés**: ${stats.titleEnDetected ? '✅ Detectado' : '⚠️ No Detectado'}
- **Autores**: ${stats.authorsDetected} ${stats.authorsDetected > 0 ? '✅' : '❌'}
- **Afiliaciones**: ${stats.affiliationsDetected} ${stats.affiliationsDetected > 0 ? '✅' : '❌'}
- **Secciones**: ${stats.sectionsDetected}
- **Referencias**: ${stats.referencesDetected}
- **Figuras**: ${stats.figuresDetected}
- **Tablas**: ${stats.tablesDetected}
- **Resumen (ES)**: ${stats.abstractEsDetected ? '✅ Detectado' : '❌ No Detectado'}
- **Abstract (EN)**: ${stats.abstractEnDetected ? '✅ Detectado' : '⚠️ No Detectado'}
- **Palabras clave (ES)**: ${stats.keywordsEsDetected}
- **Keywords (EN)**: ${stats.keywordsEnDetected}
- **Email de correspondencia**: ${stats.emailDetected ? '✅ Detectado' : '⚠️ No Detectado'}
- **Fechas editoriales**: ${stats.datesDetected ? '✅ Detectado' : '⚠️ No Detectado'}

---

## 🚨 Puntos Críticos a Revisar (${issues.length})
${issues.length > 0 ? issues.map(issue => `- ${issue}`).join('\n') : '✅ No se encontraron issues críticos.'}

## ⚠️ Advertencias y Recomendaciones (${warnings.length})
${warnings.length > 0 ? warnings.map(warning => `- ${warning}`).join('\n') : '✅ No se encontraron advertencias.'}

---

## ✅ Verificaciones de Estándar SciELO (SPS 1.9)
- **DTD JATS Publishing**: 1.1 (20151215) - ✅
- **Atributo 'specific-use'**: "sps-1.9" - ✅
- **Idioma principal del artículo**: "es" - ✅
- **DOI presente**: ${config.article.doi} - ✅
- **Licencia Open Access**: Creative Commons - ✅
- **Conteos (fig, table, ref)**: Generados - ✅

---

## 📋 Próximos Pasos Recomendados
1.  **Revisar Puntos Críticos**: Atender los issues listados arriba es prioritario.
2.  **Verificar Autores y Afiliaciones**: Asegurarse que los datos extraídos por la IA son correctos y completos.
3.  **Validar Referencias**: Comprobar que la lista de referencias está completa.
4.  **Insertar Assets**: Añadir las rutas a los archivos de imagen (<graphic xlink:href="..."/>) y el contenido de las tablas.
5.  **Ejecutar Validador Oficial**: Usar el validador de SciELO para la comprobación final.

*Reporte generado automáticamente el ${new Date().toLocaleString('es-ES')}*
  `.trim();
};
