export interface OrderModel {
  address: string;
  apartmentDescription: {
    countOfBath: number,
    countOfStandardRoom: number,
    countOfLargeRoom: number
  };
  cleaningDate: string;
  cleaningType: string;
  preferredTime: string;
  price: number;
  regularity: string;
  statusInfo: {
    active: boolean,
    status: string
  };
  userInfo: {
    email: string,
    user_id: string
  };
  cleaningServiceInfo: {
    name: string
  };
}
