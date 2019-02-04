import PaperType from './PaperType';
import { MjElement, Heading, Tags } from './Common';

class Core {
  // Keep raw style css on this variable and merged into final html page before render
  private style: string = '';
  // An array of all css files link to add into head section of page
  private headCss: string[] = [];
  // An array to keep all report html element for create them later on render
  private elements: MjElement[] = [];
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
  addText(text: string, className?: string, idName?: string) {
    let el: MjElement = {
      elementName: 'p',
      className: className,
      idName: idName,
      value: text,
    };
    this.elements.push(el);
  }
  // Add Heading with html <H?> element
  addHeading(
    text: string,
    type: Heading = Heading.H1,
    className?: string,
    idName?: string
  ) {
    let el: MjElement = {
      elementName: type,
      className: className,
      idName: idName,
      value: text,
    };
    this.elements.push(el);
  }
  // Add special internal tag for page break
  addPageBreak() {
    let el: MjElement = { elementName: `${Tags.PAGE_BREAK}` };
    this.elements.push(el);
  }

  // Main generator function that's generate final data object
  generate() {}
}
