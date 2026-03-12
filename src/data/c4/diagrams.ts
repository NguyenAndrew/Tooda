import { bankingLevel1Elements } from '../excalidraw/banking/level1Elements';
import { bankingLevel2Elements } from '../excalidraw/banking/level2Elements';
import { bankingLevel3Elements } from '../excalidraw/banking/level3Elements';
import { bankingLevel4Elements } from '../excalidraw/banking/level4Elements';
import { ecommerceLevel1Elements } from '../excalidraw/ecommerce/level1Elements';
import { ecommerceLevel2Elements } from '../excalidraw/ecommerce/level2Elements';
import { ecommerceLevel3Elements } from '../excalidraw/ecommerce/level3Elements';
import { ecommerceLevel4Elements } from '../excalidraw/ecommerce/level4Elements';
import { ridesharingLevel1Elements } from '../excalidraw/ridesharing/level1Elements';
import { ridesharingLevel2Elements } from '../excalidraw/ridesharing/level2Elements';
import { ridesharingLevel3Elements } from '../excalidraw/ridesharing/level3Elements';
import { ridesharingLevel4Elements } from '../excalidraw/ridesharing/level4Elements';
import { toodaLevel1Elements } from '../excalidraw/tooda/level1Elements';
import { toodaLevel2Elements } from '../excalidraw/tooda/level2Elements';
import { toodaLevel3Elements } from '../excalidraw/tooda/level3Elements';
import { toodaLevel4Elements } from '../excalidraw/tooda/level4Elements';

export {
  bankingLevel1Elements, bankingLevel2Elements, bankingLevel3Elements, bankingLevel4Elements,
  ecommerceLevel1Elements, ecommerceLevel2Elements, ecommerceLevel3Elements, ecommerceLevel4Elements,
  ridesharingLevel1Elements, ridesharingLevel2Elements, ridesharingLevel3Elements, ridesharingLevel4Elements,
  toodaLevel1Elements, toodaLevel2Elements, toodaLevel3Elements, toodaLevel4Elements,
};

export const diagrams = {
  banking: {
    title: 'Online Banking System',
    description: 'An Online Banking System illustrated across all 4 levels of the C4 model.',
    level1: bankingLevel1Elements,
    level2: bankingLevel2Elements,
    level3: bankingLevel3Elements,
    level4: bankingLevel4Elements,
  },
  ecommerce: {
    title: 'E-Commerce Platform',
    description: 'An E-Commerce Platform illustrated across all 4 levels of the C4 model.',
    level1: ecommerceLevel1Elements,
    level2: ecommerceLevel2Elements,
    level3: ecommerceLevel3Elements,
    level4: ecommerceLevel4Elements,
  },
  ridesharing: {
    title: 'Ride-Sharing App',
    description: 'A Ride-Sharing App illustrated across all 4 levels of the C4 model.',
    level1: ridesharingLevel1Elements,
    level2: ridesharingLevel2Elements,
    level3: ridesharingLevel3Elements,
    level4: ridesharingLevel4Elements,
  },
  tooda: {
    title: 'Tooda',
    description: 'Tooda – a browser-based architecture diagramming tool – illustrated across all 4 levels of the C4 model.',
    level1: toodaLevel1Elements,
    level2: toodaLevel2Elements,
    level3: toodaLevel3Elements,
    level4: toodaLevel4Elements,
  },
};
