export interface Document {
  filename: string;
  type: string;
  category: string;
  sections: Section[];
}

export interface Section {
  id: string;
  content: string;
  category: string;
  sourcepage: string;
  sourcefile: string;
  program_id?: number;
  embedding?: number[];
}

export interface ContentPage {
  content: string;
  offset: number;
  page: number;
}

export interface ContentSection {
  content: string;
  page: number;
}
