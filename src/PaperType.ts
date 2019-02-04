enum PaperType {
  A4_Portrait,
  A5_Portrait,
  A4_Landscape,
  A5_Landscape
}

namespace PaperType {
  export function getDimension(type: PaperType): { height: number; width: number } {
    switch (type) {
      case PaperType.A4_Portrait:
        return { height: 297, width: 210 };
      case PaperType.A5_Portrait:
        return { height: 210, width: 148 };
      case PaperType.A4_Landscape:
        return { height: 210, width: 297 };
      case PaperType.A5_Landscape:
        return { height: 148, width: 210 };
    }
  }
  export function getStyle(type: PaperType): string {
    return `page[type="${PaperType[type]}"] {
      width: ${getDimension(type).width}mm;
      height: ${getDimension(type).height}mm;
    }`;
  }
}

export default PaperType;