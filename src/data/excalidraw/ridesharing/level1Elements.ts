import { makeBox, makeArrow, makeTitle } from '../elementHelpers';

export const ridesharingLevel1Elements = [
  makeTitle('title', 'System Context – Ride-Sharing App', 760),
  ...makeBox('l1-rider', 40, 100, 180, 60, 'Rider', '#bfdbfe'),
  ...makeBox('l1-driver', 260, 100, 180, 60, 'Driver', '#bfdbfe'),
  ...makeBox('l1-ridesharing', 480, 100, 200, 60, 'Ride-Sharing App', '#bbf7d0'),
  ...makeBox('l1-maps', 40, 260, 200, 60, 'Maps & Routing API', '#f1f5f9'),
  ...makeBox('l1-payment', 280, 260, 180, 60, 'Payment Gateway', '#f1f5f9'),
  ...makeBox('l1-sms', 500, 260, 180, 60, 'SMS Provider', '#f1f5f9'),
  // Arrows
  ...makeArrow('l1-a1', 'l1-rider', 'l1-ridesharing', 130, 130, 450, 0, 'Requests and pays for rides using'),
  ...makeArrow('l1-a2', 'l1-driver', 'l1-ridesharing', 350, 130, 230, 0, 'Accepts trips and receives payouts via'),
  ...makeArrow('l1-a3', 'l1-ridesharing', 'l1-maps', 580, 130, -440, 160, 'Gets routes and ETAs from'),
  ...makeArrow('l1-a4', 'l1-ridesharing', 'l1-payment', 580, 130, -210, 160, 'Processes fares via'),
  ...makeArrow('l1-a5', 'l1-ridesharing', 'l1-sms', 580, 130, 10, 160, 'Sends SMS notifications using'),
];
