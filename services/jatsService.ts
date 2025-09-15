
import type { ExtractedContent, JournalConfig } from '../types';

const escapeXml = (text: string): string => {
  if (typeof text !== 'string') return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

export const generateJatsXml = (content: ExtractedContent, config: JournalConfig): string => {
  const pubDate = new Date(config.article.pub_date);

  const generateAuthors = () => {
    if (!content.authors || content.authors.length === 0) {
      return `
        <!-- PENDIENTE: No se detectaron autores automáticamente -->
        <contrib contrib-type="author">
          <name><surname>[APELLIDO]</surname><given-names>[NOMBRES]</given-names></name>
          <xref ref-type="aff" rid="aff1"><sup>1</sup></xref>
          <xref ref-type="corresp" rid="c1"><sup>‡</sup></xref>
        </contrib>`;
    }
    return content.authors.map((author, idx) => `
      <contrib contrib-type="author">
        ${author.orcid ? `<contrib-id contrib-id-type="orcid">https://orcid.org/${author.orcid}</contrib-id>` : ''}
        <name><surname>${escapeXml(author.surname)}</surname><given-names>${escapeXml(author.givenNames)}</given-names></name>
        <xref ref-type="aff" rid="aff${idx + 1}"><sup>${idx + 1}</sup></xref>
        ${idx === 0 ? '<xref ref-type="corresp" rid="c1"><sup>‡</sup></xref>' : ''}
      </contrib>`).join('');
  };
  
  const generateAffiliations = () => {
    if (!content.affiliations || content.affiliations.length === 0) {
        return `
        <aff id="aff1">
            <label>1</label>
            <institution content-type="original">[Institución - PENDIENTE EXTRACCIÓN]</institution>
            <addr-line><city>[Ciudad]</city></addr-line>
            <country country="XX">[País]</country>
        </aff>`;
    }
    return content.affiliations.map((aff, idx) => `
      <aff id="aff${idx + 1}">
        <label>${idx + 1}</label>
        <institution content-type="original">${escapeXml(aff.institution)}</institution>
        <addr-line><city>${escapeXml(aff.city)}</city></addr-line>
        <country>${escapeXml(aff.country)}</country>
      </aff>`).join('');
  };

  const generateSections = () => {
    if (!content.sections || content.sections.length === 0) {
      return `<sec><title>Contenido</title><p>No se detectaron secciones estructuradas.</p></sec>`;
    }
    return content.sections.map((section, idx) => `
    <sec id="s${idx + 1}">
      <title>${escapeXml(section.title)}</title>
      <p>${escapeXml(section.content)}</p>
    </sec>`).join('');
  };

  const generateReferences = () => {
    if (!content.references || content.references.length === 0) {
      return '<!-- PENDIENTE: No se detectaron referencias -->';
    }
    return content.references.map((ref, idx) => `
      <ref id="R${idx + 1}">
        <element-citation publication-type="journal">
          <mixed-citation>${escapeXml(ref)}</mixed-citation>
        </element-citation>
      </ref>`).join('');
  };

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE article PUBLIC "-//NLM//DTD JATS (Z39.96) Journal Publishing DTD v1.1 20151215//EN" "https://jats.nlm.nih.gov/publishing/1.1/JATS-journalpublishing1.dtd">
<article dtd-version="1.1" specific-use="sps-1.9" article-type="${config.article.article_type}" xml:lang="es" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:mml="http://www.w3.org/1998/Math/MathML">
  <front>
    <journal-meta>
      <journal-id journal-id-type="publisher-id">${config.journal.publisher_id}</journal-id>
      <journal-title-group>
        <journal-title>${config.journal.title}</journal-title>
        <abbrev-journal-title abbrev-type="publisher">${config.journal.abbrev_title}</abbrev-journal-title>
      </journal-title-group>
      <issn pub-type="ppub">${config.journal.pissn}</issn>
      <issn pub-type="epub">${config.journal.eissn}</issn>
      <publisher><publisher-name>${config.journal.publisher}</publisher-name></publisher>
    </journal-meta>
    <article-meta>
      <article-id pub-id-type="doi">${config.article.doi}</article-id>
      <title-group>
        <article-title>${escapeXml(content.titleEs || '[TÍTULO PENDIENTE]')}</article-title>
        ${content.titleEn ? `<trans-title-group xml:lang="en"><trans-title>${escapeXml(content.titleEn)}</trans-title></trans-title-group>` : ''}
      </title-group>
      <contrib-group>${generateAuthors()}</contrib-group>
      ${generateAffiliations()}
      <author-notes>
        <corresp id="c1"><label><sup>‡</sup></label> Autor para correspondencia: <email>${escapeXml(content.correspondingEmail || '[correo@pendiente]')}</email></corresp>
      </author-notes>
      ${content.receivedDate || content.acceptedDate ? `<history>
        ${content.receivedDate ? `<date date-type="received"><day>${content.receivedDate.split('-')[2]}</day><month>${content.receivedDate.split('-')[1]}</month><year>${content.receivedDate.split('-')[0]}</year></date>` : ''}
        ${content.acceptedDate ? `<date date-type="accepted"><day>${content.acceptedDate.split('-')[2]}</day><month>${content.acceptedDate.split('-')[1]}</month><year>${content.acceptedDate.split('-')[0]}</year></date>` : ''}
      </history>` : ''}
      <pub-date date-type="pub" publication-format="electronic">
        <day>${String(pubDate.getUTCDate()).padStart(2, '0')}</day>
        <month>${String(pubDate.getUTCMonth() + 1).padStart(2, '0')}</month>
        <year>${pubDate.getUTCFullYear()}</year>
      </pub-date>
      <pub-date date-type="collection" publication-format="electronic"><year>${config.article.collection_year}</year></pub-date>
      <volume>${config.article.volume}</volume>
      <issue>${config.article.issue}</issue>
      <elocation-id>${config.article.elocation}</elocation-id>
      <permissions>
        <license license-type="open-access" xlink:href="${config.article.license_url}">
          <license-p>Este es un artículo en acceso abierto distribuido bajo los términos de la licencia Creative Commons.</license-p>
        </license>
      </permissions>
      <abstract xml:lang="es"><p>${escapeXml(content.abstractEs)}</p></abstract>
      ${content.abstractEn ? `<trans-abstract xml:lang="en"><p>${escapeXml(content.abstractEn)}</p></trans-abstract>` : ''}
      ${content.keywordsEs.length > 0 ? `<kwd-group xml:lang="es"><title>Palabras clave</title>${content.keywordsEs.map(kw => `<kwd>${escapeXml(kw)}</kwd>`).join('')}</kwd-group>` : ''}
      ${content.keywordsEn.length > 0 ? `<kwd-group xml:lang="en"><title>Keywords</title>${content.keywordsEn.map(kw => `<kwd>${escapeXml(kw)}</kwd>`).join('')}</kwd-group>` : ''}
      <counts>
        <fig-count count="${content.figures?.length || 0}"/>
        <table-count count="${content.tables?.length || 0}"/>
        <ref-count count="${content.references?.length || 0}"/>
      </counts>
    </article-meta>
  </front>
  <body>
    ${generateSections()}
    ${(content.figures || []).map(fig => `<fig id="${fig.id}"><label>${escapeXml(fig.label)}</label><caption><p>${escapeXml(fig.caption)}</p></caption><alt-text>${escapeXml(fig.label)}</alt-text><graphic xlink:href=""/></fig>`).join('')}
    ${(content.tables || []).map(table => `<table-wrap id="${table.id}"><label>${escapeXml(table.label)}</label><caption><p>${escapeXml(table.caption)}</p></caption><alt-text>${escapeXml(table.label)}</alt-text><table><thead><tr><th></th></tr></thead><tbody><tr><td></td></tr></tbody></table></table-wrap>`).join('')}
  </body>
  <back>
    <ref-list>
      <title>Referencias</title>
      ${generateReferences()}
    </ref-list>
  </back>
</article>`;
};
