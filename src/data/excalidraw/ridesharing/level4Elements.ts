import { computeLayout } from '../elementHelpers';

export const ridesharingLevel4Elements = [
  ...computeLayout(
    [
      { id: 'l4-ctrl',     label: 'TripController\n─────────────────\n+requestTrip(req, res) void\n+acceptTrip(req, res) void\n+completeTrip(req, res) void',                                                                                     color: '#bfdbfe', width: 220, height: 120 },
      { id: 'l4-svc',      label: 'TripService\n─────────────────\n-matchingService: MatchingService\n-tripRepository: TripRepository\n-paymentService: PaymentService\n+requestTrip(riderId: string, pickup: Location) Promise~Trip~\n+completeTrip(tripId: string) Promise~Trip~', color: '#bbf7d0', width: 220, height: 140 },
      { id: 'l4-matching', label: 'MatchingService\n─────────────────\n-cache: CacheClient\n+findNearestDriver(pickup: Location) Promise~Driver~',                                                                                                 color: '#fde68a', width: 220, height: 100 },
      { id: 'l4-repo',     label: 'TripRepository\n─────────────────\n-db: DatabaseConnection\n+save(trip: Trip) Promise~Trip~\n+findById(tripId: string) Promise~Trip~',                                                                          color: '#f3e8ff', width: 220, height: 100 },
      { id: 'l4-trip',     label: 'Trip\n─────────────────\n+id: string\n+riderId: string\n+driverId: string\n+status: string\n+fare: number',                                                                                                     color: '#fce7f3', width: 220, height: 100 },
      { id: 'l4-location', label: 'Location\n─────────────────\n+lat: number\n+lng: number',                                                                                                                                                       color: '#bfdbfe', width: 220, height: 100 },
    ],
    [
      { id: 'l4-a1', from: 'l4-ctrl',     to: 'l4-svc',      label: 'uses' },
      { id: 'l4-a2', from: 'l4-svc',      to: 'l4-matching',  label: 'uses' },
      { id: 'l4-a3', from: 'l4-svc',      to: 'l4-repo',      label: 'uses' },
      { id: 'l4-a4', from: 'l4-repo',     to: 'l4-trip',      label: 'returns' },
      { id: 'l4-a5', from: 'l4-trip',     to: 'l4-location',  label: 'uses' },
    ],
    { hStep: 260, vGap: 60 },
  ),
];

