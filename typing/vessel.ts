export type VesselType = {
  _id: string;
  user: string;
  name: string;
  description: string;
  location: string;
  year: number;
  size: string;
  type: string;
  pictures: [{ data: Buffer | string }];
  pricePerDay: Number;
  pricePerWeek: Number;
  pickupDay: string;
  returnDay: string;
};
