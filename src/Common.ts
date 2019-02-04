import PaperType from "./PaperType";

export enum Heading {
  H1 = 'h1',
  H2 = 'h2',
  H3 = 'h3',
  H4 = 'h4',
  H5 = 'h5',
  H6 = 'h6'
}

export interface MjMetaData {
  title?: string;
  css?: string;
  style?: string;
  paperType?: PaperType
}

export interface MjElement {
  elementName: string;
  className?: string;
  idName?: string;
  value?: string;
}

export interface MjData {
  elements: MjElement[];
  metaData: MjMetaData;
  header?: MjElement;
  footer?: MjElement;
}
