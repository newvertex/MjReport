import { MjData, MjMetaData } from './Common';
import PaperType from './PaperType';

class Renderer {
  private pageNumber = 0;

  constructor(public data: MjData) {}
  
  draw() {
    console.log('Renderer initializing . . . .');
    console.log('Loading meta data');

    let metaData: MjMetaData = this.data.metaData;

    let headTag = `<title>${metaData.title || 'Mj Reporter'}</title>
      ${metaData.css}<style>${metaData.style}</style>`;

    document.head.innerHTML = headTag;

    let root = document.getElementById('mjRoot') as HTMLElement;

    console.log('Start Drawing . . .');
    for (let i in this.data.elements) {
      console.log('Draw Element');
      let item = this.data.elements[i];
      let el = this.createElement(
        item.elementName,
        item.className,
        item.idName
      );
      el.innerHTML = item.value || '';
      root.append(el);
    }
  }

  addHeaderFooter(page: HTMLElement) {
    let header = this.createElement('div', 'header_section', `header_${this.pageNumber}`);
    // header.innerHTML = this.data.header ;
    page.append(header)
    
    let footer = this.createElement('div', 'footer_section', `footer_${this.pageNumber}`);
    // footer.innerHTML = this.data.footer ;
    page.append(footer)
  }

  // Create a new report page
  private newPage(
    root: HTMLElement,
    paperType: PaperType = PaperType.A4_Portrait
  ): HTMLElement {
    this.pageNumber += 1; // Increase the page number

    let page = this.createElement('page', 'page_section', `page_${this.pageNumber}`);
    page.setAttribute('type', `${paperType}`);

    // add header & footer to the page
    this.addHeaderFooter(page);

    root.append(page);

    return page;
  }

  // Create a new html element
  private createElement(
    elementName: string,
    className?: string,
    idName?: string
  ) {
    let el = document.createElement(elementName);
    if (idName) el.id = idName;
    if (className) el.className = className;
    return el;
  }
}
