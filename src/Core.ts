import PaperType from './PaperType';
import { MjElement, Heading, Tags, MjData, DefaultStyles, MjMetaData } from './Common';

export default class Core {
  // Keep raw style css on this variable and merged into final html page before render
  private style: string = '';

  // An array of all css files link to add into head section of page
  private headCss: string[] = [];

  // An array to keep all report html element for create them later on render
  private content: MjElement[] = [];
  private header: MjElement[] = [];
  private footer : MjElement[] = [];
  
  // Title of the document
  // PaperType keep the paper size & oriantation for current report
  constructor(
    public title: string = 'MJ-Report Print Preview',
    public paperType: PaperType = PaperType.A4_Portrait
  ) {}

  // set the style property value
  setStyle(rawCss: string): void {
    this.style = rawCss;
  }

  // Add css file link to the headCss array; a link can have relative or absolute path
  addCss(link: string): void {
    this.headCss.push(`<link rel="stylesheet" href="${link}">`);
  }

  // Add text with html <P> element
  addText(text: string, className?: string, idName?: string): MjElement {
    return {elementName: 'p', className: className, idName: idName, value: text};
  }

  // Add Heading with html <H?> element
  addHeading(text: string, type: Heading = Heading.H1, className?: string, idName?: string): MjElement {
    return {elementName: type, className: className, idName: idName, value: text};
  }

  // Add special internal tag for page break
  addPageBreak(): MjElement {
    return { elementName: `${Tags.PAGE_BREAK}` };
  }

  // Set content to specify which elements have to be in the content section of a page
  setContent(elements: MjElement[]) {
    this.content = elements;
  }

  // Set header to repeat on top of each page section
  setHeader(elements: MjElement[]) {
    this.header = elements;
  }

  // Set footer to repeat on top of each page section
  setFooter(elements: MjElement[]) {
    this.footer = elements;
  }

  // Main generator function that's generate final data object
  generate(): MjData {
    let metaData: MjMetaData = {
      title: this.title,
      css: this.headCss.join(''),
      paperType: this.paperType,
      style: `${DefaultStyles} ${this.style}`
    };

    let data: MjData = {
      metaData: metaData,
      header: this.header,
      footer: this.footer,
      content: this.content,
    }

    return data;
  }
}
