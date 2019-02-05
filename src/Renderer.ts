import { MjData, MjMetaData, MjElement } from './Common';
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
    
    console.log('Creating first page');
    // Create first page before creating content elements
    let currentPage = this.newPage(root, metaData.paperType);
    let footer = currentPage.getElementsByClassName('footer_section')[0];
    
    console.log('Creating content elements');
    // Create elements on current page, if catch end of the page just create a new page and continue
    for (let item of this.data.content) {
      let el = this.createElement(item.elementName, item.className, item.idName);
      el.innerHTML = item.value || '';
      
      console.log(`Element ${el} was added to page ${this.pageNumber}`);
      currentPage.append(el);
      
      // Calculate current element position with space and footer position
      let elementSpace = el.getBoundingClientRect().top + el.getBoundingClientRect().height;
      let footerTop = footer.getBoundingClientRect().top;

      // Check to prevent element overlap on footer, if overlaped then remove element from current page and create new page and continue
      if (footerTop < elementSpace) {
        // Remove previously added element from page
        currentPage.removeChild(el);

        // Create a new page and add the previously created element to this new page
        currentPage = this.newPage(root, metaData.paperType);
        currentPage.append(el);
        footer = currentPage.getElementsByClassName('footer_section')[0];
      }
    }
    
    console.log('Drawing was finished, ready to print now. ;-)');
  }

  addSections(page: HTMLElement) {
    let header = this.createElement('div', 'header_section', `header_${this.pageNumber}`);
    header.append(...this.createElements(this.data.header as MjElement[]));
    page.append(header);
    
    let content = this.createElement('div', 'content_section', `content_${this.pageNumber}`);
    page.append(content);
    
    let footer = this.createElement('div', 'footer_section', `footer_${this.pageNumber}`);
    footer.append(...this.createElements(this.data.footer as MjElement[]));
    page.append(footer);
  }

  // Create a new report page
  private newPage(root: HTMLElement, paperType: PaperType = PaperType.A4_Portrait): HTMLElement {
    this.pageNumber += 1; // Increase the page number

    let page = this.createElement('page', 'page_section', `page_${this.pageNumber}`);
    page.setAttribute('type', `${paperType}`);

    // add header & footer to the page
    this.addSections(page);

    root.append(page);

    return page;
  }

  // Create multiple element
  private createElements(elements: MjElement[]): HTMLElement[] {
    let items: HTMLElement[] = [];

    for (let item of elements) {
      let el = this.createElement(item.elementName, item.className, item.idName);
      el.innerHTML = item.value || '';
      
      items.push(el);
    }

    return items;
  }
  
  // Create a new html element
  private createElement(elementName: string, className?: string, idName?: string) {
    let el = document.createElement(elementName);
    if (idName) el.id = idName;
    if (className) el.className = className;
    return el;
  }
}
