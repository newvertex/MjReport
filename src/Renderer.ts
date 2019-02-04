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
