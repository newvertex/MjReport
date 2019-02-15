import { Data, MjElement, Tags, DefaultStyles, HeadingValue, Value, TableValue, isTableCell, TableCell, TableCellType, PageHolder, isTableField, TableOptions, TableField, TableReservedField, TableState } from './Common';
import { PaperType } from './PaperType';

export class Renderer {
  private pageNumber = 0;
  private currentPage: PageHolder = null;
  private rootElement: HTMLElement = null;

  constructor(public data: Data, public rootElementName: string = 'mjRoot') {}
  
  // Create a new html element
  private createDomElement(elementName: string, className?: string, idName?: string): HTMLElement {
    let el = document.createElement(elementName);
    if (idName) el.id = idName;
    if (className) el.className = className;
    return el;
  }

  // Set some document config on Head tag like title, style, add css links
  private loadHead() {
    // Set title of page
    document.title = this.data.metaData.title || 'Mj Reporter';

    // Add raw style of page in the head tag
    let style = this.createDomElement('style');
    style.innerHTML = `${DefaultStyles} ${this.data.metaData.style}`;
    document.head.append(style);

    // Add all css link to head tag
    let metaDataCss = this.data.metaData.css || [];
    let links = metaDataCss.map(link => {
      let l = this.createDomElement('link');
      l.setAttribute('rel', 'stylesheet');
      l.setAttribute('href', link);
      return l;
    });

    document.head.append(...links);
  }

  // Add main page sections: Header, Footer and Content div
  private addPageSections(page: HTMLElement): PageHolder {
    let header = this.createDomElement('div', 'header_section', `header_${this.pageNumber}`);
    page.append(header);
    
    let content = this.createDomElement('div', 'content_section', `content_${this.pageNumber}`);
    page.append(content);
    
    let footer = this.createDomElement('div', 'footer_section', `footer_${this.pageNumber}`);
    page.append(footer);
    
    return { header, content, footer };
  }

  // Create a new report page
  private createNewPage() {
    this.pageNumber += 1; // Increase the page number

    let page = this.createDomElement('page', 'page_section', `page_${this.pageNumber}`);
    page.setAttribute('type', `${PaperType[this.data.metaData.paperType]}`);
    
    this.rootElement.append(page);

    // add header & footer to the page
    this.currentPage = this.addPageSections(page);

    this.createElements(this.data.header, this.currentPage.header, false);
    this.createElements(this.data.footer, this.currentPage.footer, false);
  }

  // Use global currentPage variable that holds last created page on createNewPage method
  private addElement(el: HTMLElement, parent: HTMLElement = this.currentPage.content, noOverlap: boolean = true, state?: TableState) {
    // Just check for table creation
    if (state) {
      parent = state.body;
    }
    
    parent.append(el);
    
    // check if item don't need to check for overlap; use for add header/footer
    if(noOverlap) {
      // Calculate current element position with space and footer position
      let elementBottom = el.getBoundingClientRect().bottom;
      let footerTop = Math.ceil(this.currentPage.footer.getBoundingClientRect().top) + 2;

      // Check to prevent element overlap on footer, if overlaped then remove element from current page and create new page and continue
      if (footerTop < elementBottom) {
        // Remove previously added element from page
        parent.removeChild(el);

        // Create a new page
        this.createNewPage();
        parent = this.currentPage.content;

        // Create table again in the new created page and then add element to new one
        if (state) {
          state.table = this.createDomElement(state.element.name, state.element.className, state.element.idName);
          state.body = this.createDomElement('tbody');
          state.table.append(state.header.cloneNode(true));
          state.table.append(state.body);
          
          // add new table header to new empty page
          this.addElement(state.table)

          parent = state.body;
        }

        // add the previously created element to this new page
        parent.append(el);
      }
    }
  }

  // Create just a single row of a table tag
  private createTableRow(rowData: string[] | TableCell[], cellType: TableCellType = TableCellType.Body): HTMLElement {
    let isString = !isTableCell(rowData);

    let row = this.createDomElement('tr');

    for(let data of rowData) {
      let cell = null;
      let cellData = null;
      
      if(isString) {
        cellData = data as string;
        cell = this.createDomElement(cellType)
        cell.innerHTML = cellData;
      } else {  // then the rowData is tableCell object
        cellData = data as TableCell;
        cell = this.createDomElement(cellType, cellData.className, cellData.idName);
        cell.setAttribute('style', cellData.style);
        cell.innerHTML = cellData.value;
      }

      row.append(cell);
    }

    return row;
  }

  // Extract each item field before generate row of table body
  private getTableField(item: any, fields: string[], opt: TableOptions): string[] {
    let data: string[] = [];
    
    for(let field of fields) {
      if(item[field]) {
        data.push(item[field])
      } else if(field.includes('@')) {
        for(let i in TableReservedField) {
          if (field === `@${TableReservedField[i]}`) {
            data.push(opt[TableReservedField[i]]);
            break;
          }
        }
      } else {
        data.push(field);
      }
    }

    return data;
  }

  // Create full filled table with header, body, footer
  private createTable(element: MjElement) {
    let state: TableState = {
      element: { name: 'table', className: element.className, idName: element.idName },
      header: {} as HTMLElement,
      body: {} as HTMLElement,
      table: {} as HTMLElement,
    }

    state.table = this.createDomElement('table', element.className, element.idName);
    let value = element.value as TableValue;

    if(value.header) {
      // Create table header
      state.header = this.createDomElement('thead');
      state.header.append(this.createTableRow(value.header, TableCellType.Header));
      state.table.append(state.header);
    }
    
    // create body rows
    state.body = this.createDomElement('tbody');
    state.table.append(state.body);

    this.addElement(state.table);

    value.items.forEach((item, index) => {
      let opt:TableOptions = { index: index, row: index + 1, empty: '' };
      let row = null;

      if(isTableField(value.fields)) {
        let cb = value.fields as TableField;
        row = this.createTableRow(cb(item, opt));
      } else {
        row = this.createTableRow(this.getTableField(item, value.fields as string[], opt));
      }

      this.addElement(row, null, true, state);
    });
    
    if(value.footer) {
      // Create table footer
      let tfoot = this.createDomElement('tfoot');
      tfoot.append(this.createTableRow(value.footer));
      this.addElement(tfoot, state.table);
    }
  }

  private createElement(element: MjElement, parent?: HTMLElement, noOverlap: boolean = true): HTMLElement {
    let el = null;
    let value = null;

    switch(element.tag) {
      case Tags.PageBreak:
        this.createNewPage();
        break;
      case Tags.Text:
        value = element.value as Value;
        el = this.createDomElement('p', element.className, element.idName);
        el.innerHTML = value.text;
        this.addElement(el, parent, noOverlap)
        break;
      case Tags.Heading:
        value = element.value as HeadingValue;
        el = this.createDomElement(value.level, element.className, element.idName);
        el.innerHTML = value.text;
        this.addElement(el, parent, noOverlap)
        break;
      case Tags.Table:
        this.createTable(element);
        break;
    }

    return el;
  }

  private createElements(elements: MjElement[], parent?: HTMLElement, noOverlap: boolean = true) {
    for(let element of elements) {
      this.createElement(element, parent, noOverlap);
    }
  }
  
  draw() {
    // Draw the head tag elements of page like css styles & etc...
    this.loadHead();
    
    // Find root element & Create first page before creating content elements
    this.rootElement = document.getElementById(this.rootElementName) as HTMLElement;
    this.createNewPage();
    
    // Create the all main content of the pages
    this.createElements(this.data.content);

    console.log('Report Rendered ;-)');
  }
 
}
