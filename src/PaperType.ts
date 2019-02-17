export enum PaperType {
  A4_Portrait,
  A5_Portrait,
  A4_Landscape,
  A5_Landscape
}

export namespace PaperType {
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
  export function getRule(type: PaperType): string {
    switch (type) {
      case PaperType.A4_Portrait:
        return 'a4 portrait';
      case PaperType.A5_Portrait:
        return 'a5 portrait';
      case PaperType.A4_Landscape:
        return 'a4 landscape';
      case PaperType.A5_Landscape:
        return 'a5 landscape';
    }
  }

  export function getSize(type: PaperType): { pageSize: string, landscape: boolean } {
    switch (type) {
      case PaperType.A4_Portrait:
        return { pageSize: 'A4', landscape: false };
      case PaperType.A5_Portrait:
        return { pageSize: 'A5', landscape: false };
      case PaperType.A4_Landscape:
        return { pageSize: 'A4', landscape: true };
      case PaperType.A5_Landscape:
        return { pageSize: 'A5', landscape: true };
    }
  }

  export function getStyle(type: PaperType): string {
    return `@page{ size: ${PaperType.getRule(type)}; }`;
  }
}
