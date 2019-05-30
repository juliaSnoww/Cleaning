export interface ReservationModel {
  reservationInfo: {
    address: string,
    cleaningType: string,
    apartmentDescription: {
      countOfBath: number,
      countOfStandardRoom: number,
      countOfLargeRoom: number
    },
    cleaningDate: string,
    preferredTime: string,
    regularity: string,
    activityInfo: {
      status: string,
      reason: string
    }
  };
  userInfo: {
    name: string,
    email: string,
    imagePath: string,
    address: string
  };
}
