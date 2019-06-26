export interface Company {
  company: {
    costPerUnit: {
      type: object;
      rooms: object;
    };
    logo: string;
  };
  maxCompany:number;
  name: string;
  _id: string;
}
