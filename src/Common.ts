import { PaperType } from "./PaperType";

export enum Tags {
  Text,
  Heading,
  PageBreak,
}

export interface Value {
  text: string;
}

export enum HeadingLevel {
  H1 = 'h1',
  H2 = 'h2',
  H3 = 'h3',
  H4 = 'h4',
  H5 = 'h5',
  H6 = 'h6'
}

export interface HeadingValue extends Value {
  level: HeadingLevel;
}

export interface MetaData {
  title?: string;
  css?: string[];
  style?: string;
  paperType?: PaperType
}

export interface MjElement {
  tag: Tags;
  value?: Value | HeadingValue;
  className?: string;
  idName?: string;
}

export interface Data {
  metaData: MetaData;
  content: MjElement[];
  header?: MjElement[];
  footer?: MjElement[];
}

export const DefaultStyles = `
body {
  background: rgb(204,204,204); 
}

page {
  background: white;
  margin: 0 auto;
  margin-bottom: 0.5cm;
  box-shadow: 0 0 0.5cm rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
}

page[type="A4_Portrait"] {
  width: 210mm;
  height: 297mm;
}

page[type="A4_Landscape"] {
  width: 297mm;
  height: 210mm;
}

page[type="A5_Portrait"] {
  width: 148mm;
  height: 210mm;
}

page[type="A5_Landscape"] {
  width: 210mm;
  height: 148mm;
}

@media print {
  body, page {
    margin: 0;
    box-shadow: 0;
  }
}

.header_section {
  margin-top: 10px;
  margin-left: 5px;
  margin-right: 5px;
  height: 100px;
  border: 1px solid red;
  flex-shrink: 0;
}

.content_section {
  margin-left: 5px;
  margin-right: 5px;
  height: 100%;
  border: 1px solid blue;
  overflow: hidden;
}

.footer_section {
  margin-bottom: 5px;
  margin-left: 5px;
  margin-right: 5px;
  height: 50px;
  border: 1px solid red;
  flex-shrink: 0;
}
`;