import { makeBox, makeArrow, makeTitle } from '../elementHelpers';

export const ecommerceLevel1Elements = [
  makeTitle('title', 'System Context – E-Commerce Platform', 760),
  ...makeBox('l1-customer', 40, 100, 180, 60, 'Customer', '#bfdbfe'),
  ...makeBox('l1-seller', 260, 100, 180, 60, 'Seller', '#bfdbfe'),
  ...makeBox('l1-ecommerce', 480, 100, 200, 60, 'E-Commerce Platform', '#bbf7d0'),
  ...makeBox('l1-payment', 40, 260, 200, 60, 'Payment Gateway', '#f1f5f9'),
  ...makeBox('l1-shipping', 280, 260, 200, 60, 'Shipping Provider', '#f1f5f9'),
  ...makeBox('l1-email', 520, 260, 200, 60, 'E-mail System', '#f1f5f9'),
  // Arrows
  ...makeArrow('l1-a1', 'l1-customer', 'l1-ecommerce', 130, 130, 450, 0, 'Browses products and places orders using'),
  ...makeArrow('l1-a2', 'l1-seller', 'l1-ecommerce', 350, 130, 230, 0, 'Lists products and manages inventory using'),
  ...makeArrow('l1-a3', 'l1-ecommerce', 'l1-payment', 580, 130, -440, 160, 'Processes payments via'),
  ...makeArrow('l1-a4', 'l1-ecommerce', 'l1-shipping', 580, 130, -200, 160, 'Dispatches orders via'),
  ...makeArrow('l1-a5', 'l1-ecommerce', 'l1-email', 580, 130, 40, 160, 'Sends notifications using'),
];
