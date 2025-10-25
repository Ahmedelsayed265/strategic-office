import type { DataItem, GeoJSONData } from "./types";
import { useEffect, useRef, useMemo } from "react";
import L from "leaflet";
import shp from "shpjs";
import chroma from "chroma-js";

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
    const nameAttributes: Record<string, DataItem> = {};

    data.forEach((item) => {
      const key = item.regionAreaId.toString();
      geojsonAttributes[key] = item;

      nameAttributes[item.regonName] = item;

      const nameVariations = [
        item.regonName,
        item.regonName.replace("منطقة ", ""),
        item.regonName.replace("منطقة ", "").replace(" ", ""),
        item.regonName.replace(" ", ""),
      ];

      nameVariations.forEach((variation) => {
        if (variation && variation !== item.regonName) {
          nameAttributes[variation] = item;
        }
      });
    });

    shp("/GIS/shp.zip").then((shapefileData: GeoJSONData) => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
      }

      const styledLayer = L.geoJSON(null, {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        style: (feature: any) => {
          const props = feature?.properties || {};

          // Get region name from shapefile (Name_Ar is the Arabic name)
          const regionName =
            props.Name_Ar ||
            props.REGION_NAME ||
            props.region_name ||
            props.Region_Name ||
            props.NAME ||
            props.name;
          const areaId =
            props.Area_ID ||
            props.AREA_ID ||
            props.area_id ||
            props.id ||
            props.ID;

          if (areaId === 2000) {
            return {
              color: "black",
              weight: 3,
              fillColor: "transparent",
              fillOpacity: 0,
            };
          }

          // Try to match by region name first (more reliable), then by area ID
          let matchedData = regionName ? nameAttributes[regionName] : null;
          if (!matchedData && areaId) {
            matchedData = geojsonAttributes[areaId];
          }

          const value = matchedData?.valueAvg ?? minValue;

          return {
            color: "#333",
            weight: 2,
            fillColor: colorScale(value).hex(),
            fillOpacity: 0.7,
          };
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onEachFeature: (feature: any, layer: L.Layer) => {
          const props = feature?.properties || {};
          const regionName =
            props.Name_Ar ||
            props.REGION_NAME ||
            props.region_name ||
            props.Region_Name ||
            props.NAME ||
            props.name;
          const areaId =
            props.Area_ID ||
            props.AREA_ID ||
            props.area_id ||
            props.id ||
            props.ID;

          let item = regionName ? nameAttributes[regionName] : null;

          if (!item && areaId) {
            item = geojsonAttributes[areaId];
          }

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
          const props = feature.properties || {};
          const regionName =
            props.Name_Ar ||
            props.REGION_NAME ||
            props.region_name ||
            props.Region_Name ||
            props.NAME ||
            props.name;
          const areaId =
            props.Area_ID ||
            props.AREA_ID ||
            props.area_id ||
            props.id ||
            props.ID;

          let jsonData = regionName ? nameAttributes[regionName] : null;

          if (!jsonData && areaId) {
            jsonData = geojsonAttributes[areaId];
          }

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
