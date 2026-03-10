import { excalidrawToMermaid } from '../../utils/excalidrawToMermaid';
import type { LevelMeta } from '../../utils/excalidrawToMermaid';

// ── Banking element arrays ────────────────────────────────────────────────────
export { bankingLevel1Elements } from '../excalidraw/banking/level1Elements';
export { bankingLevel2Elements } from '../excalidraw/banking/level2Elements';
export { bankingLevel3Elements } from '../excalidraw/banking/level3Elements';
export { bankingLevel4Elements } from '../excalidraw/banking/level4Elements';

import { bankingLevel1Elements } from '../excalidraw/banking/level1Elements';
import { bankingLevel2Elements } from '../excalidraw/banking/level2Elements';
import { bankingLevel3Elements } from '../excalidraw/banking/level3Elements';
import { bankingLevel4Elements } from '../excalidraw/banking/level4Elements';

// ── E-Commerce element arrays ─────────────────────────────────────────────────
export { ecommerceLevel1Elements } from '../excalidraw/ecommerce/level1Elements';
export { ecommerceLevel2Elements } from '../excalidraw/ecommerce/level2Elements';
export { ecommerceLevel3Elements } from '../excalidraw/ecommerce/level3Elements';
export { ecommerceLevel4Elements } from '../excalidraw/ecommerce/level4Elements';

import { ecommerceLevel1Elements } from '../excalidraw/ecommerce/level1Elements';
import { ecommerceLevel2Elements } from '../excalidraw/ecommerce/level2Elements';
import { ecommerceLevel3Elements } from '../excalidraw/ecommerce/level3Elements';
import { ecommerceLevel4Elements } from '../excalidraw/ecommerce/level4Elements';

// ── Ride-Sharing element arrays ───────────────────────────────────────────────
export { ridesharingLevel1Elements } from '../excalidraw/ridesharing/level1Elements';
export { ridesharingLevel2Elements } from '../excalidraw/ridesharing/level2Elements';
export { ridesharingLevel3Elements } from '../excalidraw/ridesharing/level3Elements';
export { ridesharingLevel4Elements } from '../excalidraw/ridesharing/level4Elements';

import { ridesharingLevel1Elements } from '../excalidraw/ridesharing/level1Elements';
import { ridesharingLevel2Elements } from '../excalidraw/ridesharing/level2Elements';
import { ridesharingLevel3Elements } from '../excalidraw/ridesharing/level3Elements';
import { ridesharingLevel4Elements } from '../excalidraw/ridesharing/level4Elements';

// ── Tooda element arrays ──────────────────────────────────────────────────────
export { toodaLevel1Elements } from '../excalidraw/tooda/level1Elements';
export { toodaLevel2Elements } from '../excalidraw/tooda/level2Elements';
export { toodaLevel3Elements } from '../excalidraw/tooda/level3Elements';
export { toodaLevel4Elements } from '../excalidraw/tooda/level4Elements';

import { toodaLevel1Elements } from '../excalidraw/tooda/level1Elements';
import { toodaLevel2Elements } from '../excalidraw/tooda/level2Elements';
import { toodaLevel3Elements } from '../excalidraw/tooda/level3Elements';
import { toodaLevel4Elements } from '../excalidraw/tooda/level4Elements';

// ── Banking LevelMeta ─────────────────────────────────────────────────────────

const bankingLevel1Meta: LevelMeta = {
  diagramType: 'C4Context',
  useElk: true,
  nodes: {
    'l1-customer': { c4type: 'Person', desc: 'A customer of the bank with personal bank accounts.' },
    'l1-staff': { c4type: 'Person', desc: 'Bank employees managing accounts and support.' },
    'l1-onlineBanking': { c4type: 'System', desc: 'Allows customers to view account information and make payments.' },
    'l1-email': { c4type: 'System_Ext', desc: 'The internal Microsoft Exchange e-mail system.' },
    'l1-mainframe': { c4type: 'System_Ext', desc: 'Stores all core banking information about customers, accounts, and transactions.' },
  },
};

const bankingLevel2Meta: LevelMeta = {
  diagramType: 'C4Container',
  useElk: true,
  nodes: {
    'l2-customer': { c4type: 'Person', desc: 'A customer of the bank with personal bank accounts.' },
    'l2-email': { c4type: 'System_Ext', desc: 'Microsoft Exchange' },
    'l2-mainframe': { c4type: 'System_Ext', desc: 'Core banking records' },
    'l2-webApp': { c4type: 'Container', tech: 'Astro / Node.js', desc: 'Delivers the static web front-end to customers via their browser.' },
    'l2-spa': { c4type: 'Container', tech: 'JavaScript', desc: 'Provides the banking functionality to customers via their browser.' },
    'l2-mobileApp': { c4type: 'Container', tech: 'React Native', desc: 'Provides the banking functionality to customers via their mobile device.' },
    'l2-apiApp': { c4type: 'Container', tech: 'Node.js / Express', desc: 'Provides banking functionality via a JSON/HTTPS API.' },
    'l2-db': { c4type: 'ContainerDb', tech: 'PostgreSQL', desc: 'Stores customer and account information.' },
  },
  boundaries: [
    {
      id: 'ob',
      label: 'Online Banking System',
      type: 'System_Boundary',
      nodeIds: ['l2-webApp', 'l2-spa', 'l2-mobileApp', 'l2-apiApp', 'l2-db'],
    },
  ],
};

const bankingLevel3Meta: LevelMeta = {
  diagramType: 'C4Component',
  useElk: true,
  nodes: {
    'l3-spa': { c4type: 'Container_Ext', tech: 'JavaScript', desc: 'Front-end delivered by the web application.' },
    'l3-mobileApp': { c4type: 'Container_Ext', tech: 'React Native', desc: 'Mobile front-end.' },
    'l3-db': { c4type: 'ContainerDb_Ext', tech: 'PostgreSQL', desc: 'Stores account and customer data.' },
    'l3-email': { c4type: 'System_Ext', desc: 'Microsoft Exchange' },
    'l3-mainframe': { c4type: 'System_Ext', desc: 'Core banking records' },
    'l3-authController': { c4type: 'Component', tech: 'Express Router', desc: 'Handles sign-in, sign-out, and token refresh.' },
    'l3-accountsController': { c4type: 'Component', tech: 'Express Router', desc: 'Provides account balance and transaction history endpoints.' },
    'l3-paymentsController': { c4type: 'Component', tech: 'Express Router', desc: 'Handles payment initiation and confirmation.' },
    'l3-authService': { c4type: 'Component', tech: 'Node.js module', desc: 'Validates credentials and issues JWT tokens.' },
    'l3-accountsService': { c4type: 'Component', tech: 'Node.js module', desc: 'Business logic for account data.' },
    'l3-paymentsService': { c4type: 'Component', tech: 'Node.js module', desc: 'Business logic for payments.' },
    'l3-emailService': { c4type: 'Component', tech: 'Node.js module', desc: 'Sends notification e-mails.' },
  },
  boundaries: [
    {
      id: 'api',
      label: 'API Application',
      type: 'Container_Boundary',
      nodeIds: ['l3-authController', 'l3-accountsController', 'l3-paymentsController', 'l3-authService', 'l3-accountsService', 'l3-paymentsService', 'l3-emailService'],
    },
  ],
};

const bankingLevel4Meta: LevelMeta = {
  diagramType: 'classDiagram',
};

// ── E-Commerce LevelMeta ──────────────────────────────────────────────────────

const ecommerceLevel1Meta: LevelMeta = {
  diagramType: 'C4Context',
  useElk: true,
  nodes: {
    'l1-customer': { c4type: 'Person', desc: 'A person who browses products and places orders.' },
    'l1-seller': { c4type: 'Person', desc: 'A business or individual who lists products for sale.' },
    'l1-ecommerce': { c4type: 'System', desc: 'Allows customers to browse products, place orders, and track deliveries.' },
    'l1-payment': { c4type: 'System_Ext', desc: 'Processes credit card and digital wallet payments.' },
    'l1-shipping': { c4type: 'System_Ext', desc: 'Handles order fulfillment and delivery tracking.' },
    'l1-email': { c4type: 'System_Ext', desc: 'Sends order confirmations and shipping notifications.' },
  },
};

const ecommerceLevel2Meta: LevelMeta = {
  diagramType: 'C4Container',
  useElk: true,
  nodes: {
    'l2-customer': { c4type: 'Person', desc: 'A person who shops online.' },
    'l2-seller': { c4type: 'Person', desc: 'A product vendor.' },
    'l2-payment': { c4type: 'System_Ext', desc: 'Stripe' },
    'l2-shipping': { c4type: 'System_Ext', desc: 'FedEx / UPS' },
    'l2-email': { c4type: 'System_Ext', desc: 'SendGrid' },
    'l2-webApp': { c4type: 'Container', tech: 'Astro / Node.js', desc: 'Serves the storefront to customers via their browser.' },
    'l2-mobileApp': { c4type: 'Container', tech: 'React Native', desc: 'Provides the shopping experience on mobile devices.' },
    'l2-apiGateway': { c4type: 'Container', tech: 'Node.js / Express', desc: 'Routes requests to the appropriate microservices.' },
    'l2-productService': { c4type: 'Container', tech: 'Node.js', desc: 'Manages product catalogue and search.' },
    'l2-orderService': { c4type: 'Container', tech: 'Node.js', desc: 'Handles order creation, status, and history.' },
    'l2-db': { c4type: 'ContainerDb', tech: 'PostgreSQL', desc: 'Stores products, orders, and customer data.' },
    'l2-queue': { c4type: 'Container', tech: 'RabbitMQ', desc: 'Decouples order events from downstream processing.' },
  },
  boundaries: [
    {
      id: 'ec',
      label: 'E-Commerce Platform',
      type: 'System_Boundary',
      nodeIds: ['l2-webApp', 'l2-mobileApp', 'l2-apiGateway', 'l2-productService', 'l2-orderService', 'l2-db', 'l2-queue'],
    },
  ],
};

const ecommerceLevel3Meta: LevelMeta = {
  diagramType: 'C4Component',
  useElk: true,
  nodes: {
    'l3-apiGateway': { c4type: 'Container_Ext', tech: 'Node.js / Express', desc: 'Routes incoming requests.' },
    'l3-queue': { c4type: 'Container_Ext', tech: 'RabbitMQ', desc: 'Receives order events.' },
    'l3-db': { c4type: 'ContainerDb_Ext', tech: 'PostgreSQL', desc: 'Stores order records.' },
    'l3-orderController': { c4type: 'Component', tech: 'Express Router', desc: 'Handles order creation and retrieval endpoints.' },
    'l3-orderService': { c4type: 'Component', tech: 'Node.js module', desc: 'Business logic for orders.' },
    'l3-paymentClient': { c4type: 'Component', tech: 'Node.js module', desc: 'Integrates with the Payment Gateway.' },
    'l3-shippingClient': { c4type: 'Component', tech: 'Node.js module', desc: 'Integrates with the Shipping Provider.' },
    'l3-orderRepository': { c4type: 'Component', tech: 'Node.js module', desc: 'Persists and queries order records.' },
    'l3-eventPublisher': { c4type: 'Component', tech: 'Node.js module', desc: 'Publishes order events to the message queue.' },
  },
  boundaries: [
    {
      id: 'os',
      label: 'Order Service',
      type: 'Container_Boundary',
      nodeIds: ['l3-orderController', 'l3-orderService', 'l3-paymentClient', 'l3-shippingClient', 'l3-orderRepository', 'l3-eventPublisher'],
    },
  ],
};

const ecommerceLevel4Meta: LevelMeta = {
  diagramType: 'classDiagram',
};

// ── Ride-Sharing LevelMeta ────────────────────────────────────────────────────

const ridesharingLevel1Meta: LevelMeta = {
  diagramType: 'C4Context',
  useElk: true,
  nodes: {
    'l1-rider': { c4type: 'Person', desc: 'A passenger who requests and pays for rides.' },
    'l1-driver': { c4type: 'Person', desc: 'A driver who accepts ride requests.' },
    'l1-ridesharing': { c4type: 'System', desc: 'Connects riders with nearby drivers and handles trip booking and payment.' },
    'l1-maps': { c4type: 'System_Ext', desc: 'Provides location search, routing, and ETA calculations.' },
    'l1-payment': { c4type: 'System_Ext', desc: 'Processes ride fares and driver payouts.' },
    'l1-sms': { c4type: 'System_Ext', desc: 'Sends trip status notifications to riders and drivers.' },
  },
};

const ridesharingLevel2Meta: LevelMeta = {
  diagramType: 'C4Container',
  useElk: true,
  nodes: {
    'l2-rider': { c4type: 'Person', desc: 'Requests a ride.' },
    'l2-driver': { c4type: 'Person', desc: 'Accepts a ride.' },
    'l2-maps': { c4type: 'System_Ext', desc: 'Google Maps Platform' },
    'l2-payment': { c4type: 'System_Ext', desc: 'Stripe' },
    'l2-sms': { c4type: 'System_Ext', desc: 'Twilio' },
    'l2-riderApp': { c4type: 'Container', tech: 'React Native', desc: 'Lets riders request rides, track drivers, and pay.' },
    'l2-driverApp': { c4type: 'Container', tech: 'React Native', desc: 'Lets drivers accept trips and navigate to destinations.' },
    'l2-apiServer': { c4type: 'Container', tech: 'Node.js / Express', desc: 'Core backend handling trips, matching, and payments.' },
    'l2-locationService': { c4type: 'Container', tech: 'Node.js', desc: 'Tracks real-time driver positions.' },
    'l2-db': { c4type: 'ContainerDb', tech: 'PostgreSQL', desc: 'Stores users, trips, and payment records.' },
    'l2-cache': { c4type: 'ContainerDb', tech: 'Redis', desc: 'Stores active driver locations and trip state.' },
  },
  boundaries: [
    {
      id: 'rs',
      label: 'Ride-Sharing App',
      type: 'System_Boundary',
      nodeIds: ['l2-riderApp', 'l2-driverApp', 'l2-apiServer', 'l2-locationService', 'l2-db', 'l2-cache'],
    },
  ],
};

const ridesharingLevel3Meta: LevelMeta = {
  diagramType: 'C4Component',
  useElk: true,
  nodes: {
    'l3-riderApp': { c4type: 'Container_Ext', tech: 'React Native', desc: 'Mobile app for riders.' },
    'l3-driverApp': { c4type: 'Container_Ext', tech: 'React Native', desc: 'Mobile app for drivers.' },
    'l3-db': { c4type: 'ContainerDb_Ext', tech: 'PostgreSQL', desc: 'Stores trip records.' },
    'l3-cache': { c4type: 'ContainerDb_Ext', tech: 'Redis', desc: 'Active driver locations.' },
    'l3-payment': { c4type: 'System_Ext', desc: 'Stripe' },
    'l3-sms': { c4type: 'System_Ext', desc: 'Twilio' },
    'l3-tripController': { c4type: 'Component', tech: 'Express Router', desc: 'Handles trip request, acceptance, and completion.' },
    'l3-matchingService': { c4type: 'Component', tech: 'Node.js module', desc: 'Finds the nearest available driver for a rider.' },
    'l3-tripService': { c4type: 'Component', tech: 'Node.js module', desc: 'Business logic for trip lifecycle.' },
    'l3-paymentService': { c4type: 'Component', tech: 'Node.js module', desc: 'Calculates fares and triggers payment.' },
    'l3-notificationService': { c4type: 'Component', tech: 'Node.js module', desc: 'Sends SMS updates to riders and drivers.' },
    'l3-tripRepository': { c4type: 'Component', tech: 'Node.js module', desc: 'Persists trip records to the database.' },
  },
  boundaries: [
    {
      id: 'api',
      label: 'API Server',
      type: 'Container_Boundary',
      nodeIds: ['l3-tripController', 'l3-matchingService', 'l3-tripService', 'l3-paymentService', 'l3-notificationService', 'l3-tripRepository'],
    },
  ],
};

const ridesharingLevel4Meta: LevelMeta = {
  diagramType: 'classDiagram',
};

// ── Tooda LevelMeta ───────────────────────────────────────────────────────────

const toodaLevel1Meta: LevelMeta = {
  diagramType: 'C4Context',
  useElk: true,
  nodes: {
    'l1-developer': { c4type: 'Person', desc: 'Creates and maintains software architecture diagrams.' },
    'l1-tooda': { c4type: 'System', desc: 'A browser-based tool for visualizing software architecture using C4/Mermaid and Excalidraw.' },
    'l1-githubPages': { c4type: 'System_Ext', desc: 'Hosts and serves the Tooda static site.' },
    'l1-mermaid': { c4type: 'System_Ext', desc: 'Renders C4 and class diagrams from plain-text definitions in the browser.' },
    'l1-excalidraw': { c4type: 'System_Ext', desc: 'Renders freehand-style architecture diagrams in the browser.' },
  },
};

const toodaLevel2Meta: LevelMeta = {
  diagramType: 'C4Container',
  useElk: true,
  nodes: {
    'l2-developer': { c4type: 'Person', desc: 'Creates and maintains architecture diagrams.' },
    'l2-githubPages': { c4type: 'System_Ext', desc: 'Hosts and serves the built static site.' },
    'l2-mermaidLib': { c4type: 'System_Ext', desc: 'Renders C4 and class diagrams as SVG in the browser.' },
    'l2-excalidrawLib': { c4type: 'System_Ext', desc: 'Renders interactive freehand diagrams in the browser.' },
    'l2-webApp': { c4type: 'Container', tech: 'Astro / Node.js', desc: 'Builds and serves the static site to users via their browser.' },
    'l2-c4Page': { c4type: 'Container', tech: 'Astro Page + Mermaid.js', desc: 'Provides tabbed C4 diagram navigation for multiple example systems.' },
    'l2-excalidrawPage': { c4type: 'Container', tech: 'Astro Page + React', desc: 'Renders freehand-style diagrams using the Excalidraw component.' },
    'l2-apiPage': { c4type: 'Container', tech: 'Astro Page', desc: 'Allows users to inspect and test API endpoints interactively.' },
  },
  boundaries: [
    {
      id: 't',
      label: 'Tooda',
      type: 'System_Boundary',
      nodeIds: ['l2-webApp', 'l2-c4Page', 'l2-excalidrawPage', 'l2-apiPage'],
    },
  ],
};

const toodaLevel3Meta: LevelMeta = {
  diagramType: 'C4Component',
  useElk: true,
  nodes: {
    'l3-developer': { c4type: 'Person', desc: 'Interacts with the C4 Viewer.' },
    'l3-mermaidLib': { c4type: 'System_Ext', desc: 'Renders SVG from Mermaid source text.' },
    'l3-diagramData': { c4type: 'Component', tech: 'TypeScript module', desc: 'Holds Mermaid diagram definitions for all examples and all four C4 levels.' },
    'l3-tabController': { c4type: 'Component', tech: 'Vanilla JS', desc: 'Handles switching between Level 1–4 diagram tabs and URL hash routing.' },
    'l3-exampleSwitcher': { c4type: 'Component', tech: 'Vanilla JS', desc: 'Switches the active example and updates all level diagrams from Diagram Data.' },
    'l3-viewToggle': { c4type: 'Component', tech: 'Vanilla JS', desc: 'Toggles between Diagram, Code, and Edit views and updates URL query params.' },
    'l3-mermaidRenderer': { c4type: 'Component', tech: 'Mermaid.js', desc: 'Renders Mermaid source text as SVG diagrams on demand.' },
    'l3-panZoomController': { c4type: 'Component', tech: 'Vanilla JS', desc: 'Handles mouse/touch pan and scroll-to-zoom interactions on diagram SVGs.' },
    'l3-nodeDragController': { c4type: 'Component', tech: 'Vanilla JS', desc: 'Allows repositioning diagram nodes in Edit mode and exports coordinates.' },
  },
  boundaries: [
    {
      id: 'c4',
      label: 'C4 Viewer',
      type: 'Container_Boundary',
      nodeIds: ['l3-diagramData', 'l3-tabController', 'l3-exampleSwitcher', 'l3-viewToggle', 'l3-mermaidRenderer', 'l3-panZoomController', 'l3-nodeDragController'],
    },
  ],
};

const toodaLevel4Meta: LevelMeta = {
  diagramType: 'classDiagram',
};

// ── Derived Mermaid diagram strings ───────────────────────────────────────────

export const diagrams = {
  banking: {
    title: 'Online Banking System',
    description: 'An Online Banking System illustrated across all 4 levels of the C4 model.',
    level1: excalidrawToMermaid(bankingLevel1Elements, bankingLevel1Meta),
    level2: excalidrawToMermaid(bankingLevel2Elements, bankingLevel2Meta),
    level3: excalidrawToMermaid(bankingLevel3Elements, bankingLevel3Meta),
    level4: excalidrawToMermaid(bankingLevel4Elements, bankingLevel4Meta),
  },
  ecommerce: {
    title: 'E-Commerce Platform',
    description: 'An E-Commerce Platform illustrated across all 4 levels of the C4 model.',
    level1: excalidrawToMermaid(ecommerceLevel1Elements, ecommerceLevel1Meta),
    level2: excalidrawToMermaid(ecommerceLevel2Elements, ecommerceLevel2Meta),
    level3: excalidrawToMermaid(ecommerceLevel3Elements, ecommerceLevel3Meta),
    level4: excalidrawToMermaid(ecommerceLevel4Elements, ecommerceLevel4Meta),
  },
  ridesharing: {
    title: 'Ride-Sharing App',
    description: 'A Ride-Sharing App illustrated across all 4 levels of the C4 model.',
    level1: excalidrawToMermaid(ridesharingLevel1Elements, ridesharingLevel1Meta),
    level2: excalidrawToMermaid(ridesharingLevel2Elements, ridesharingLevel2Meta),
    level3: excalidrawToMermaid(ridesharingLevel3Elements, ridesharingLevel3Meta),
    level4: excalidrawToMermaid(ridesharingLevel4Elements, ridesharingLevel4Meta),
  },
  tooda: {
    title: 'Tooda',
    description: 'Tooda – a browser-based architecture diagramming tool – illustrated across all 4 levels of the C4 model.',
    level1: excalidrawToMermaid(toodaLevel1Elements, toodaLevel1Meta),
    level2: excalidrawToMermaid(toodaLevel2Elements, toodaLevel2Meta),
    level3: excalidrawToMermaid(toodaLevel3Elements, toodaLevel3Meta),
    level4: excalidrawToMermaid(toodaLevel4Elements, toodaLevel4Meta),
  },
};
