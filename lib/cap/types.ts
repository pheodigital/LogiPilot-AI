export interface Carrier {
  ID: string;
  name: string;
  country: string;
  rating: string;
}

export interface Location {
  ID: string;
  name: string;
  country: string;
  city: string;
  postalCode: string;
}

export interface FreightOrder {
  ID: string;
  status: string;
  creationDate: string;
  plannedStart: string;
  plannedEnd: string;
  actualStart: string | null;
  actualEnd: string | null;
  origin_ID: string;
  destination_ID: string;
  carrier_ID: string;
  totalCost: string;
  currency: string;

  carrier?: Carrier;
  origin?: Location;
  destination?: Location;
}

export interface ODataResponse<T> {
  "@odata.context": string;
  value: T[];
}
