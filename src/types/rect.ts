export interface CoordinateMapItem {
  rect: RectObject;
}

export interface RectObject {
  top: number;
  right: number;
  bottom: number;
  left: number;
  width?: number;
  height?: number;
}

export type CoordinateMap = CoordinateMapItem[];

export interface PointObject {
  x: number;
  y: number;
}

export interface SafeArea {
  blockKey: string;
  offsetKey: string;
  rect: RectObject;
}
