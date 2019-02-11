import { PaperType } from './PaperType';
import { MjElement, Tags, HeadingLevel, Data, MetaData } from './Common';

export class Generator {
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
    this.headCss.push(link);
  }

  // Add text with html <P> element
  addText(text: string, className?: string, idName?: string): MjElement {
    return { tag: Tags.Text, value: { text }, className: className, idName: idName };
  }

  // Add Heading with html <H?> element
  addHeading(text: string, level: HeadingLevel = HeadingLevel.H1, className?: string, idName?: string): MjElement {
    return { tag: Tags.Heading, value: { text, level }, className: className, idName: idName };
  }

  // Add special internal tag for page break
  addPageBreak(): MjElement {
    return { tag: Tags.PageBreak };
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
  generate(): Data {
    let metaData: MetaData = {
      title: this.title,
      css: this.headCss,
      paperType: this.paperType,
      style: this.style
    };

    let data: Data = {
      metaData: metaData,
      header: this.header,
      footer: this.footer,
      content: this.content,
    }

    return data;
  }
}
