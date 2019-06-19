export interface Company {
  company: {
    costPerUnit: {
      type: object;
      rooms: object;
    };
    logo: string;
  };
  name: string;
  _id: string;
}
