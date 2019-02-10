import { MjData, MjElement, Tags, DefaultStyles } from './Common';
import { PaperType } from './PaperType';

export class Renderer {
  private pageNumber = 0;

  constructor(public data: MjData) {}
  
  draw() {
    // Set title of page
    document.title = this.data.metaData.title || 'Mj Reporter';
    // Add raw style of page in the head tag
    let style = this.createElement('style');
    style.innerHTML = `${DefaultStyles} ${this.data.metaData.style}`;
    document.head.append(style);
    // Add all css link to head tag
    let metaDataCss = this.data.metaData.css || [];
    let links = metaDataCss.map(link => {
      let l = this.createElement('link');
      l.setAttribute('rel', 'stylesheet');
      l.setAttribute('href', link);
      return l
    });
    document.head.append(...links);
    
    let root = document.getElementById('mjroot') as HTMLElement;
    
    // Create first page before creating content elements
    let currentPage = this.newPage(root, this.data.metaData.paperType);
    
    // Create elements on current page, if catch end of the page just create a new page and continue
    for (let item of this.data.content) {
      // Check element name to find reserved tags to do some special things
      if (item.elementName == `${Tags.PAGE_BREAK}`) {
        currentPage = this.newPage(root, this.data.metaData.paperType);
      } else {
        let el = this.createElement(item.elementName, item.className, item.idName);
        el.innerHTML = item.value || '';
        
        currentPage.content.append(el);
        
        // Calculate current element position with space and footer position
        let elementSpace = el.getBoundingClientRect().top + el.getBoundingClientRect().height;
        let footerTop = Math.ceil(currentPage.footer.getBoundingClientRect().top) + 2;

        // Check to prevent element overlap on footer, if overlaped then remove element from current page and create new page and continue
        if (footerTop < elementSpace) {
          // Remove previously added element from page
          currentPage.content.removeChild(el);
  
          // Create a new page and add the previously created element to this new page
          currentPage = this.newPage(root, this.data.metaData.paperType);
          currentPage.content.append(el);
        }
      }
    }
    
  }

  addSections(page: HTMLElement) {
    let header = this.createElement('div', 'header_section', `header_${this.pageNumber}`);
    let dataHeader = this.data.header as MjElement[];
    if (dataHeader.length)
      header.append(...this.createElements(dataHeader));
    page.append(header);
    
    let content = this.createElement('div', 'content_section', `content_${this.pageNumber}`);
    page.append(content);
    
    let footer = this.createElement('div', 'footer_section', `footer_${this.pageNumber}`);
    let dataFooter = this.data.footer as MjElement[];
    if(dataFooter.length)
      footer.append(...this.createElements(dataFooter));
    page.append(footer);

    return { header, content, footer };
  }

  // Create a new report page
  private newPage(root: HTMLElement, paperType: PaperType = PaperType.A4_Portrait) {
    this.pageNumber += 1; // Increase the page number

    let page = this.createElement('page', 'page_section', `page_${this.pageNumber}`);
    page.setAttribute('type', `${PaperType[paperType]}`);
    
    root.append(page);

    // add header & footer to the page
    return Object.assign({}, page,  this.addSections(page));
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
