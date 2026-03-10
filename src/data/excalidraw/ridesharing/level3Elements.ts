import { makeBox, makeArrow, makeTitle } from '../elementHelpers';

export const ridesharingLevel3Elements = [
  makeTitle('title', 'Component – API Server', 760),
  ...makeBox('l3-riderApp', 40, 100, 200, 60, 'Rider App', '#f1f5f9'),
  ...makeBox('l3-driverApp', 40, 200, 200, 60, 'Driver App', '#f1f5f9'),
  ...makeBox('l3-db', 40, 320, 200, 60, 'Database', '#fef3c7'),
  ...makeBox('l3-cache', 40, 420, 200, 60, 'Cache', '#fef3c7'),
  ...makeBox('l3-payment', 40, 520, 200, 60, 'Payment Gateway', '#f1f5f9'),
  ...makeBox('l3-sms', 40, 620, 200, 60, 'SMS Provider', '#f1f5f9'),
  ...makeBox('l3-tripController', 280, 100, 200, 60, 'Trip Controller', '#e0f2fe'),
  ...makeBox('l3-matchingService', 280, 200, 200, 60, 'Matching Service', '#e0f2fe'),
  ...makeBox('l3-tripService', 520, 100, 200, 60, 'Trip Service', '#e0f2fe'),
  ...makeBox('l3-paymentService', 520, 200, 200, 60, 'Payment Service', '#e0f2fe'),
  ...makeBox('l3-notificationService', 520, 300, 200, 60, 'Notification Service', '#e0f2fe'),
  ...makeBox('l3-tripRepository', 280, 300, 200, 60, 'Trip Repository', '#e0f2fe'),
  // Arrows
  ...makeArrow('l3-a1', 'l3-riderApp', 'l3-tripController', 140, 130, 140, 0, 'Calls'),
  ...makeArrow('l3-a2', 'l3-driverApp', 'l3-tripController', 140, 230, 140, -100, 'Calls'),
  ...makeArrow('l3-a3', 'l3-tripController', 'l3-tripService', 380, 130, 140, 0, 'Uses'),
  ...makeArrow('l3-a4', 'l3-tripService', 'l3-matchingService', 620, 130, -240, 100, 'Uses'),
  ...makeArrow('l3-a5', 'l3-tripService', 'l3-paymentService', 620, 130, 0, 100, 'Uses'),
  ...makeArrow('l3-a6', 'l3-tripService', 'l3-notificationService', 620, 130, 0, 200, 'Uses'),
  ...makeArrow('l3-a7', 'l3-tripService', 'l3-tripRepository', 620, 130, -240, 200, 'Uses'),
  ...makeArrow('l3-a8', 'l3-matchingService', 'l3-cache', 380, 230, -340, 220, 'Reads driver locations from'),
  ...makeArrow('l3-a9', 'l3-tripRepository', 'l3-db', 380, 330, -340, 20, 'Reads/writes'),
  ...makeArrow('l3-a10', 'l3-paymentService', 'l3-payment', 620, 230, -580, 320, 'Charges via'),
  ...makeArrow('l3-a11', 'l3-notificationService', 'l3-sms', 620, 330, -580, 320, 'Sends via'),
];
