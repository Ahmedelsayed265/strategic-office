interface List {
  id: number;
  name: string;
}

export interface IndicatorData {
  region: List[];
  years: List[];
  govs: List[];
  subIndicators: List[];
  values: Values;
  indicatorCardDetails: IndicatorCardDetails;
  migUnit: string | null;
  indicatorNameAndUnit: string;
}

export interface Values {
  averageValue: number;
  averageBeforeVal: number;
  averageChangeRate: number;
  averageMaxIndVal: number;
  averageMinIndVal: number;
  lastYear: number;
  yearBefore: number;
  normalizedAverageValue: number;
  normalizedAverageBeforeVal: number;
}

export interface IndicatorCardDetails {
  sector: string;
  indicator: string;
  definition: string;
  preferences: string;
  calculateMethod: string;
  parentCode: string | null;
  id: number;
  migUnit: string | null;
  postiveNegative: string | null;
}

export interface TableData {
  success: boolean;
  indicatorHeader: string;
  tableHtml: string;
  message: string | null;
}

export interface LineChartDataWrapper {
  success: boolean;
  chartType: number;
  data: LineChartContent;
  message: string | null;
}

export interface LineChartContent {
  years: string[];
  datasets: LineChartDataset[];
  colors: string[];
}

export interface LineChartDataset {
  label: string;
  data: number[];
}

export interface BarChartDataWrapper {
  success: boolean;
  chartType: number | null;
  data: BarChartData;
  message: string | null;
}

export interface BarChartData {
  xLabels: string[];
  datasets: BarChartDataset[];
  colors: string[];
  migUnit: string;
}

export interface BarChartDataset {
  name: string;
  values: number[];
}

export interface PieChartDataWrapper {
  success: boolean;
  chartType: number | null;
  data: PieChartData;
  message: string | null;
}

export interface PieChartData {
  labels: string[];
  values: number[];
  backgroundColors: string[];
  nameOfRegion: string;
}

// responses

export interface GisIndicatorValuesData {
  success: boolean;
  data: GisIndicatorPoint[];
  tableData: GisIndicatorYearValue[];
  message: string | null;
}

export interface GisIndicatorPoint {
  sector: string;
  indicatorId: number;
  indicator: string;
  regionAreaId: number;
  regonName: string;
  govName1: string | null;
  govAreaId: number | null;
  migUnit: string;
  year: number;
  valueAvg: number;
}

export interface GisIndicatorYearValue {
  regionAreaId: number;
  regonName: string;
  yearId: number;
  value: number;
}

export interface MainSectionsResponse {
  errorCode: number;
  errorMessage: string;
  data: {
    mainSectors: List[];
    areas: null;
  };
}

export interface PointrersResponse {
  errorCode: number;
  errorMessage: string;
  data: List[];
}

export interface IndicatorDataResponse {
  errorCode: number;
  errorMessage: string;
  data: IndicatorData;
}

export interface TableDataResponse {
  errorCode: number;
  errorMessage: string;
  data: TableData;
}

export interface GisIndicatorValuesResponse {
  errorCode: number;
  errorMessage: string;
  data: GisIndicatorValuesData;
}

export interface LineChartResponse {
  errorCode: number;
  errorMessage: string;
  data: LineChartDataWrapper;
}

export interface BarChartResponse {
  errorCode: number;
  errorMessage: string;
  data: BarChartDataWrapper;
}

export interface PieChartResponse {
  errorCode: number;
  errorMessage: string;
  data: PieChartDataWrapper;
}
