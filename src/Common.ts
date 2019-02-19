import { PaperType } from "./PaperType";

export enum Tags {
  Text,
  Heading,
  Table,
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

export interface TableState {
  element: { name: string, className: string, idName: string },
  header: HTMLElement,
  body: HTMLElement,
  table: HTMLElement,
}

export interface TableCell {
  value: string;
  className?: string;
  idName?: string;
  style?: string;
}

export enum TableReservedField {
  index = 'index',  // Zero base
  row = 'row',  // index + 1
  empty = 'empty',  // an empty string = ""
}

export interface TableOptions {
  [key: string]: any;
  index: number;  // Zero base
  row: number;  // index + 1
  empty: string;  // an empty string = ""
}

export interface TableField {
  (item: object, opt: TableOptions) : string[] | TableCell[]
}

export interface TableValue {
  items: object[];
  fields: string[] | TableCell[] | TableField;
  header?: string[] | TableCell[];
  footer?: string[][] | TableCell[][];
}

export enum TableCellType {
  Header = 'th',
  Body = 'td',
}

export function isTableCell(obj: string[] | TableCell[] | TableField) {
  return Array.isArray(obj) && typeof obj[0] === 'object';
}

export function isTableField(obj: string[] | TableCell[] | TableField) {
  return !Array.isArray(obj) && typeof obj === 'function';
}

export interface PageHolder {
  header: HTMLElement;
  content: HTMLElement;
  footer: HTMLElement;
}

export interface MetaData {
  title?: string;
  css?: string[];
  style?: string;
  paperType?: PaperType
}

export interface MjElement {
  tag: Tags;
  value?: Value | HeadingValue | TableValue;
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
  .no-print {
    display: none;
  } 
  
  body, page {
    margin: 0;
    box-shadow: none;
  }
}

.header_section {
  margin-top: 10px;
  margin-left: 5px;
  margin-right: 5px;
  flex-shrink: 0;
  position: relative;
}

.content_section {
  margin-left: 5px;
  margin-right: 5px;
  height: 100%;
  overflow: hidden;
}

.footer_section {
  margin-bottom: 5px;
  margin-left: 5px;
  margin-right: 5px;
  flex-shrink: 0;
  overflow: hidden;
  position: relative;
}

table {
  border: 1px solid black;
  border-collapse: collapse;
  margin: auto;
  padding:5px;
  width: 80%;
}

th {
  border-bottom: 2px solid black;
  border-right: 1px solid black;
  font-size: 20px;
  font-weight: 600;
  padding: 5px;
  vertical-align: middle;
}

tr {
  border-top: 1px solid black;
  border-bottom: 1px solid black;
}

tr:hover td {
  background:rgb(219, 222, 255);
}

tr:nth-child(odd) td {
  background:#EBEBEB;
}

tr:nth-child(odd):hover td {
  background:rgb(219, 222, 255);
}

td {
  font-size:18px;
  vertical-align:middle;
  padding:8px;
  border-right: 1px solid black;
  border-left: 1px solid black;
} 

.rtl {
  direction: rtl;
}

.ltr {
  direction: ltr;
}

.text-left {
  text-align: left;
}

.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}
`;