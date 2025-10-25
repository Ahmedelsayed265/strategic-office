import { useEffect, useRef, useMemo } from "react";
import L from "leaflet";
import shp from "shpjs";
import chroma from "chroma-js";

interface DataItem {
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

interface GeoJSONFeature {
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

interface GeoJSONData {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
}

export default function GisMap({ data = [] }: { data?: DataItem[] }) {
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.GeoJSON | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const saBounds = useMemo(
    () =>
      [
        [16.38, 34.53],
        [32.16, 55.85],
      ] as [[number, number], [number, number]],
    []
  );

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [
          (saBounds[0][0] + saBounds[1][0]) / 2,
          (saBounds[0][1] + saBounds[1][1]) / 2,
        ],
        zoom: 5,
        scrollWheelZoom: true,
        dragging: true,
        touchZoom: true,
        doubleClickZoom: true,
        boxZoom: true,
        keyboard: true,
        zoomSnap: 0.25,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© Strategic Office for the Development of Al Baha Region",
      }).addTo(map);

      map.whenReady(() => {
        map.invalidateSize();
        map.fitBounds(saBounds, { padding: [20, 20] });
      });

      mapRef.current = map;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [saBounds]);

  useEffect(() => {
    if (!data || !mapRef.current) return;
    const map = mapRef.current;

    const values = data.map((d) => d.valueAvg).filter((v) => v != null);
    if (!values.length) return;

    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const colorScale = chroma
      .scale(["#ffffb2", "#fd8d3c", "#f03b20"])
      .domain([minValue, maxValue]);

    const geojsonAttributes: Record<string, DataItem> = {};
    data.forEach((item) => {
      const key = item.govAreaId?.toString() ?? item.regionAreaId.toString();
      geojsonAttributes[key] = item;
    });

    shp("/GIS/shp.zip").then((shapefileData: GeoJSONData) => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
      }

      const styledLayer = L.geoJSON(null, {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        style: (feature: any) => {
          const areaId = feature?.properties?.Area_ID;

          if (areaId === 2000) {
            return {
              color: "black",
              weight: 3,
              fillColor: "transparent",
              fillOpacity: 0,
            };
          }

          const value = areaId
            ? geojsonAttributes[areaId]?.valueAvg ?? minValue
            : minValue;
          return {
            color: "#333",
            weight: 2,
            fillColor: colorScale(value).hex(),
            fillOpacity: 0.7,
          };
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onEachFeature: (feature: any, layer: L.Layer) => {
          const areaId = feature?.properties?.Area_ID;
          const item = areaId ? geojsonAttributes[areaId] : undefined;
          layer.on("click", (e: L.LeafletMouseEvent) => {
            const popupContent = `
              <div dir="rtl" style="text-align:right; font-family: Arial, sans-serif; min-width: 200px;">
                <h3 style="margin: 0 0 10px 0; color: #333;">${
                  item?.indicator || "-"
                }</h3>
                <div style="border-bottom: 1px solid #ddd; padding-bottom: 8px; margin-bottom: 8px;">
                  <b>اسم المنطقة:</b> ${item?.regonName || "-"}<br/>
                  ${
                    item?.govName1
                      ? `<b>اسم المحافظة:</b> ${item.govName1}<br/>`
                      : ""
                  }
                  <b>القطاع:</b> ${item?.sector || "-"}<br/>
                </div>
                <div style="background-color: #f8f9fa; padding: 8px; border-radius: 4px;">
                  <b>القيمة:</b> ${item?.valueAvg?.toFixed(2) || "-"}<br/>
                  <b>الوحدة:</b> ${item?.migUnit || "-"}<br/>
                  <b>الفترة:</b> ${item?.minYear || "-"} - ${
              item?.maxYear || "-"
            }
                </div>
              </div>`;
            L.popup().setLatLng(e.latlng).setContent(popupContent).openOn(map);
          });
        },
      }).addTo(map);

      // Filter features and add data similar to your JavaScript version
      const filteredFeatures = shapefileData.features
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((feature: any) => {
          const areaId = feature.properties?.Area_ID;
          const jsonData = geojsonAttributes[areaId];

          if (jsonData) {
            feature.properties = { ...feature.properties, ...jsonData };
            return feature;
          }
          return null;
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((feature: any) => feature !== null);

      styledLayer.addData({
        type: "FeatureCollection",
        features: filteredFeatures,
      } as GeoJSON.GeoJSON);
      layerRef.current = styledLayer;
    });
  }, [data]);

  return (
    <div className="relative">
      <div ref={mapContainerRef} className="w-full h-[430px] rounded-lg"></div>
    </div>
  );
}
