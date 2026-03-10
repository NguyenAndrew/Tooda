import { makeBox, makeArrow, makeTitle } from '../elementHelpers';

export const ridesharingLevel2Elements = [
  makeTitle('title', 'Container – Ride-Sharing App', 760),
  ...makeBox('l2-rider', 40, 100, 180, 60, 'Rider', '#bfdbfe'),
  ...makeBox('l2-driver', 40, 200, 180, 60, 'Driver', '#bfdbfe'),
  ...makeBox('l2-maps', 40, 320, 180, 60, 'Maps & Routing API', '#f1f5f9'),
  ...makeBox('l2-payment', 40, 420, 180, 60, 'Payment Gateway', '#f1f5f9'),
  ...makeBox('l2-sms', 40, 520, 180, 60, 'SMS Provider', '#f1f5f9'),
  ...makeBox('l2-riderApp', 280, 100, 200, 60, 'Rider App', '#ddd6fe'),
  ...makeBox('l2-driverApp', 280, 200, 200, 60, 'Driver App', '#ddd6fe'),
  ...makeBox('l2-apiServer', 520, 100, 200, 60, 'API Server', '#ddd6fe'),
  ...makeBox('l2-locationService', 520, 200, 200, 60, 'Location Service', '#ddd6fe'),
  ...makeBox('l2-db', 280, 320, 200, 60, 'Database', '#fde68a'),
  ...makeBox('l2-cache', 520, 320, 200, 60, 'Cache', '#fde68a'),
  // Arrows
  ...makeArrow('l2-a1', 'l2-rider', 'l2-riderApp', 130, 130, 150, 0, 'Uses'),
  ...makeArrow('l2-a2', 'l2-driver', 'l2-driverApp', 130, 230, 150, 0, 'Uses'),
  ...makeArrow('l2-a3', 'l2-riderApp', 'l2-apiServer', 380, 130, 140, 0, 'Calls'),
  ...makeArrow('l2-a4', 'l2-driverApp', 'l2-apiServer', 380, 230, 140, -100, 'Calls'),
  ...makeArrow('l2-a5', 'l2-driverApp', 'l2-locationService', 380, 230, 140, 0, 'Sends location updates to'),
  ...makeArrow('l2-a6', 'l2-apiServer', 'l2-db', 620, 130, -240, 220, 'Reads/writes'),
  ...makeArrow('l2-a7', 'l2-apiServer', 'l2-cache', 620, 130, 0, 220, 'Reads/writes'),
  ...makeArrow('l2-a8', 'l2-locationService', 'l2-cache', 620, 230, 0, 120, 'Updates driver positions in'),
  ...makeArrow('l2-a9', 'l2-apiServer', 'l2-maps', 620, 130, -580, 220, 'Gets routes from'),
  ...makeArrow('l2-a10', 'l2-apiServer', 'l2-payment', 620, 130, -580, 320, 'Processes fares via'),
  ...makeArrow('l2-a11', 'l2-apiServer', 'l2-sms', 620, 130, -580, 420, 'Sends notifications via'),
];
