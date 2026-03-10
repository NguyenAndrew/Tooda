import { makeBox, makeArrow } from '../elementHelpers';

export const ridesharingLevel4Elements = [
  ...makeBox('l4-ctrl', 40, 80, 220, 120,
    'TripController\n─────────────────\n+requestTrip(req, res) void\n+acceptTrip(req, res) void\n+completeTrip(req, res) void', '#bfdbfe'),
  ...makeBox('l4-svc', 300, 80, 220, 140,
    'TripService\n─────────────────\n-matchingService: MatchingService\n-tripRepository: TripRepository\n-paymentService: PaymentService\n+requestTrip(riderId: string, pickup: Location) Promise~Trip~\n+completeTrip(tripId: string) Promise~Trip~', '#bbf7d0'),
  ...makeBox('l4-matching', 560, 80, 220, 100,
    'MatchingService\n─────────────────\n-cache: CacheClient\n+findNearestDriver(pickup: Location) Promise~Driver~', '#fde68a'),
  ...makeBox('l4-repo', 40, 280, 220, 100,
    'TripRepository\n─────────────────\n-db: DatabaseConnection\n+save(trip: Trip) Promise~Trip~\n+findById(tripId: string) Promise~Trip~', '#f3e8ff'),
  ...makeBox('l4-trip', 300, 280, 220, 100,
    'Trip\n─────────────────\n+id: string\n+riderId: string\n+driverId: string\n+status: string\n+fare: number', '#fce7f3'),
  ...makeBox('l4-location', 560, 280, 220, 100,
    'Location\n─────────────────\n+lat: number\n+lng: number', '#bfdbfe'),
  // Arrows
  ...makeArrow('l4-a1', 'l4-ctrl', 'l4-svc', 260, 140, 40, 0, 'uses'),
  ...makeArrow('l4-a2', 'l4-svc', 'l4-matching', 520, 140, 40, 0, 'uses'),
  ...makeArrow('l4-a3', 'l4-svc', 'l4-repo', 410, 140, -260, 200, 'uses'),
  ...makeArrow('l4-a4', 'l4-repo', 'l4-trip', 150, 330, 260, 0, 'returns'),
  ...makeArrow('l4-a5', 'l4-trip', 'l4-location', 410, 330, 260, 0, 'uses'),
];
