import { makeBox, makeArrow, makeTitle } from '../elementHelpers';

export const bankingLevel1Elements = [
  makeTitle('title', 'System Context – Online Banking System', 760),
  ...makeBox('l1-customer', 40, 100, 200, 60, 'Personal Banking Customer', '#bfdbfe'),
  ...makeBox('l1-staff', 280, 100, 200, 60, 'Bank Staff', '#bfdbfe'),
  ...makeBox('l1-onlineBanking', 520, 100, 200, 60, 'Online Banking System', '#bbf7d0'),
  ...makeBox('l1-email', 160, 260, 200, 60, 'E-mail System', '#f1f5f9'),
  ...makeBox('l1-mainframe', 440, 260, 200, 60, 'Mainframe Banking System', '#f1f5f9'),
  // Arrows: x=center of fromBox, y=center of fromBox, dx/dy to center of toBox
  ...makeArrow('l1-a1', 'l1-customer', 'l1-onlineBanking', 140, 130, 380, 0, 'Views account balances and makes payments using'),
  ...makeArrow('l1-a2', 'l1-staff', 'l1-onlineBanking', 380, 130, 140, 0, 'Manages customer accounts and support requests using'),
  ...makeArrow('l1-a3', 'l1-onlineBanking', 'l1-email', 620, 130, -360, 160, 'Sends e-mail notifications using'),
  ...makeArrow('l1-a4', 'l1-onlineBanking', 'l1-mainframe', 620, 130, -80, 160, 'Gets account and transaction data from'),
];
