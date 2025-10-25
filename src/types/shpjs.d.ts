declare module 'shpjs' {
  interface GeoJSONFeature {
    type: 'Feature';
    properties?: Record<string, unknown>;
    geometry: {
      type: 'Point' | 'MultiPoint' | 'LineString' | 'MultiLineString' | 'Polygon' | 'MultiPolygon' | 'GeometryCollection';
      coordinates: unknown;
    };
  }

  interface GeoJSONData {
    type: 'FeatureCollection';
    features: GeoJSONFeature[];
  }

  function shp(url: string): Promise<GeoJSONData>;
  export = shp;
}
