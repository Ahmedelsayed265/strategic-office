export interface DataItem {
  sector: string;
  indicatorId: number;
  indicator: string;
  regionAreaId: number;
  regonName: string;
  govName1?: string | null;
  govAreaId?: number | null;
  migUnit: string;
  maxYear: number;
  minYear: number;
  valueAvg: number;
}

export interface GeoJSONFeature {
  type: "Feature";
  properties?: {
    Area_ID?: string;
    [key: string]: unknown;
  };
  geometry: {
    type:
      | "Point"
      | "MultiPoint"
      | "LineString"
      | "MultiLineString"
      | "Polygon"
      | "MultiPolygon"
      | "GeometryCollection";
    coordinates: unknown;
  };
}

export interface GeoJSONData {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
}