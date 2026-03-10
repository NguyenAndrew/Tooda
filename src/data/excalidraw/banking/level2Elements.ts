import { makeBox, makeArrow, makeTitle } from '../elementHelpers';

export const bankingLevel2Elements = [
  makeTitle('title', 'Container – Online Banking System', 760),
  ...makeBox('l2-customer', 40, 100, 200, 60, 'Personal Banking Customer', '#bfdbfe'),
  ...makeBox('l2-email', 40, 260, 200, 60, 'E-mail System', '#f1f5f9'),
  ...makeBox('l2-mainframe', 40, 360, 200, 60, 'Mainframe Banking System', '#f1f5f9'),
  ...makeBox('l2-webApp', 280, 100, 200, 60, 'Web Application', '#ddd6fe'),
  ...makeBox('l2-spa', 280, 200, 200, 60, 'Single-Page App', '#ddd6fe'),
  ...makeBox('l2-mobileApp', 280, 300, 200, 60, 'Mobile App', '#ddd6fe'),
  ...makeBox('l2-apiApp', 520, 200, 200, 60, 'API Application', '#ddd6fe'),
  ...makeBox('l2-db', 520, 300, 200, 60, 'Database', '#fde68a'),
  // Arrows
  ...makeArrow('l2-a1', 'l2-customer', 'l2-webApp', 140, 130, 140, 0, 'Visits'),
  ...makeArrow('l2-a2', 'l2-customer', 'l2-mobileApp', 140, 130, 140, 170, 'Uses'),
  ...makeArrow('l2-a3', 'l2-webApp', 'l2-spa', 380, 130, 0, 70, 'Delivers'),
  ...makeArrow('l2-a4', 'l2-spa', 'l2-apiApp', 380, 230, 140, 0, 'Makes API calls to'),
  ...makeArrow('l2-a5', 'l2-mobileApp', 'l2-apiApp', 380, 330, 140, -100, 'Makes API calls to'),
  ...makeArrow('l2-a6', 'l2-apiApp', 'l2-db', 620, 230, 0, 100, 'Reads/writes'),
  ...makeArrow('l2-a7', 'l2-apiApp', 'l2-email', 620, 230, -580, 60, 'Sends emails using'),
  ...makeArrow('l2-a8', 'l2-apiApp', 'l2-mainframe', 620, 230, -580, 160, 'Reads/writes account data'),
];
