
export interface Author {
  givenNames: string;
  surname: string;
  email?: string;
  orcid?: string;
}

export interface Affiliation {
  id: string;
  institution: string;
  city: string;
  country: string;
}

export interface Section {
  title: string;
  content: string; // Combined paragraphs
}

export interface Figure {
  id: string;
  label: string;
  caption: string;
}

export interface Table {
  id:string;
  label: string;
  caption: string;
}

export interface ExtractedContent {
  titleEs: string;
  titleEn?: string;
  authors: Author[];
  affiliations: Affiliation[];
  correspondingEmail?: string;
  receivedDate?: string; // YYYY-MM-DD
  acceptedDate?: string; // YYYY-MM-DD
  abstractEs: string;
  abstractEn?: string;
  keywordsEs: string[];
  keywordsEn: string[];
  sections: Section[];
  references: string[];
  figures: Figure[];
  tables: Table[];
  articleType?: string;
}

export interface JournalConfig {
  journal: {
    publisher_id: string;
    title: string;
    abbrev_title: string;
    pissn: string;
    eissn: string;
    publisher: string;
  };
  article: {
    doi: string;
    volume: string;
    issue: string;
    elocation: string;
    pub_date: string;
    collection_year: string;
    license_url: string;
    article_type: string;
  };
}

export type ProcessingStep = 'extracting' | 'analyzing' | 'generating';

export type AppState =
  | { status: 'idle' }
  | { status: 'processing'; file: File; step: ProcessingStep }
  | { 
      status: 'success'; 
      file: File; 
      extractedContent: ExtractedContent;
      config: JournalConfig;
      xmlOutput: string;
      qaReport: string;
    }
  | { status: 'error'; error: string };
