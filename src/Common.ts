import PaperType from "./PaperType";

export enum Heading {
  H1 = 'h1',
  H2 = 'h2',
  H3 = 'h3',
  H4 = 'h4',
  H5 = 'h5',
  H6 = 'h6'
}


export enum Tags {
  PAGE_BREAK,
  PAGE_NUMBER,
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
  metaData: MjMetaData;
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
  display: block;
  margin: 0 auto;
  margin-bottom: 0.5cm;
  box-shadow: 0 0 0.5cm rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
}

@media print {
  body, page {
    margin: 0;
    box-shadow: 0;
  }
}

.header_section {
  width: 90%;
  height: 100px;
  border: 1px solid red;
}

.content_section {
  width: 90%;
  height: 100%;
  border: 1px solid blue;
}

.footer_section {
  height: 50px;
  border: 1px solid red;
}
`;