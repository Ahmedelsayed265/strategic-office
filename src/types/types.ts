export interface MainSector {
  id: number;
  name: string;
}

export interface MainSectionsResponse {
  errorCode: number;
  errorMessage: string;
  data: {
    mainSectors: MainSector[];
    areas: null;
  };
}

export interface PointrersResponse {
  errorCode: number;
  errorMessage: string;
  data: MainSector[];
}
