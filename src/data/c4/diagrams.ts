export const diagrams = {
  banking: {
    title: 'Online Banking System',
    description: 'An Online Banking System illustrated across all 4 levels of the C4 model.',
    level1: `C4Context
  title System Context – Online Banking System

  Person(customer, "Personal Banking Customer", "A customer of the bank with personal bank accounts.")
  Person(staff, "Bank Staff", "Bank employees managing accounts and support.")

  System(onlineBanking, "Online Banking System", "Allows customers to view account information and make payments.")

  System_Ext(email, "E-mail System", "The internal Microsoft Exchange e-mail system.")
  System_Ext(mainframe, "Mainframe Banking System", "Stores all core banking information about customers, accounts, and transactions.")

  Rel(customer, onlineBanking, "Views account balances and makes payments using")
  Rel(staff, onlineBanking, "Manages customer accounts and support requests using")
  Rel(onlineBanking, email, "Sends e-mail notifications using")
  Rel(onlineBanking, mainframe, "Gets account and transaction data from")`,
    level2: `C4Container
  title Container – Online Banking System

  Person(customer, "Personal Banking Customer", "A customer of the bank with personal bank accounts.")

  System_Boundary(ob, "Online Banking System") {
    Container(webApp, "Web Application", "Astro / Node.js", "Delivers the static web front-end to customers via their browser.")
    Container(spa, "Single-Page App", "JavaScript", "Provides the banking functionality to customers via their browser.")
    Container(mobileApp, "Mobile App", "React Native", "Provides the banking functionality to customers via their mobile device.")
    Container(apiApp, "API Application", "Node.js / Express", "Provides banking functionality via a JSON/HTTPS API.")
    ContainerDb(db, "Database", "PostgreSQL", "Stores customer and account information.")
  }

  System_Ext(email, "E-mail System", "Microsoft Exchange")
  System_Ext(mainframe, "Mainframe Banking System", "Core banking records")

  Rel(customer, webApp, "Visits", "HTTPS")
  Rel(customer, mobileApp, "Uses", "HTTPS")
  Rel(webApp, spa, "Delivers")
  Rel(spa, apiApp, "Makes API calls to", "JSON/HTTPS")
  Rel(mobileApp, apiApp, "Makes API calls to", "JSON/HTTPS")
  Rel(apiApp, db, "Reads/writes", "SQL")
  Rel(apiApp, email, "Sends emails using", "SMTP")
  Rel(apiApp, mainframe, "Reads/writes account data", "XML/HTTPS")`,
    level3: `C4Component
  title Component – API Application

  Container_Ext(spa, "Single-Page App", "JavaScript", "Front-end delivered by the web application.")
  Container_Ext(mobileApp, "Mobile App", "React Native", "Mobile front-end.")

  Container_Boundary(api, "API Application") {
    Component(authController, "Auth Controller", "Express Router", "Handles sign-in, sign-out, and token refresh.")
    Component(accountsController, "Accounts Controller", "Express Router", "Provides account balance and transaction history endpoints.")
    Component(paymentsController, "Payments Controller", "Express Router", "Handles payment initiation and confirmation.")
    Component(authService, "Auth Service", "Node.js module", "Validates credentials and issues JWT tokens.")
    Component(accountsService, "Accounts Service", "Node.js module", "Business logic for account data.")
    Component(paymentsService, "Payments Service", "Node.js module", "Business logic for payments.")
    Component(emailService, "E-mail Service", "Node.js module", "Sends notification e-mails.")
  }

  ContainerDb_Ext(db, "Database", "PostgreSQL", "Stores account and customer data.")
  System_Ext(email, "E-mail System", "Microsoft Exchange")
  System_Ext(mainframe, "Mainframe Banking System", "Core banking records")

  Rel(spa, authController, "Calls", "JSON/HTTPS")
  Rel(spa, accountsController, "Calls", "JSON/HTTPS")
  Rel(spa, paymentsController, "Calls", "JSON/HTTPS")
  Rel(mobileApp, authController, "Calls", "JSON/HTTPS")
  Rel(mobileApp, accountsController, "Calls", "JSON/HTTPS")
  Rel(mobileApp, paymentsController, "Calls", "JSON/HTTPS")
  Rel(authController, authService, "Uses")
  Rel(accountsController, accountsService, "Uses")
  Rel(paymentsController, paymentsService, "Uses")
  Rel(paymentsService, emailService, "Uses")
  Rel(accountsService, db, "Reads/writes", "SQL")
  Rel(paymentsService, db, "Reads/writes", "SQL")
  Rel(authService, db, "Reads/writes", "SQL")
  Rel(emailService, email, "Sends e-mail using", "SMTP")
  Rel(accountsService, mainframe, "Reads account data from", "XML/HTTPS")
  Rel(paymentsService, mainframe, "Submits payments to", "XML/HTTPS")`,
    level4: `classDiagram
  direction TB

  class AccountsController {
    +getBalance(req, res) void
    +getTransactions(req, res) void
  }

  class AccountsService {
    -accountsRepository: AccountsRepository
    -mainframeClient: MainframeClient
    +getBalance(customerId: string) Promise~Account~
    +getTransactions(customerId: string) Promise~Transaction~
  }

  class AccountsRepository {
    -db: DatabaseConnection
    +findByCustomerId(customerId: string) Promise~Account~
    +findTransactions(accountId: string) Promise~Transaction~
  }

  class MainframeClient {
    -baseUrl: string
    +fetchAccount(customerId: string) Promise~Account~
    +fetchTransactions(accountId: string) Promise~Transaction~
  }

  class Account {
    +id: string
    +customerId: string
    +balance: number
    +currency: string
  }

  class Transaction {
    +id: string
    +accountId: string
    +amount: number
    +description: string
    +date: Date
  }

  AccountsController --> AccountsService : uses
  AccountsService --> AccountsRepository : uses
  AccountsService --> MainframeClient : uses
  AccountsRepository --> Account : returns
  AccountsRepository --> Transaction : returns
  MainframeClient --> Account : returns
  MainframeClient --> Transaction : returns`,
  },
  ecommerce: {
    title: 'E-Commerce Platform',
    description: 'An E-Commerce Platform illustrated across all 4 levels of the C4 model.',
    level1: `C4Context
  title System Context – E-Commerce Platform

  Person(customer, "Customer", "A person who browses products and places orders.")
  Person(seller, "Seller", "A business or individual who lists products for sale.")

  System(ecommerce, "E-Commerce Platform", "Allows customers to browse products, place orders, and track deliveries.")

  System_Ext(payment, "Payment Gateway", "Processes credit card and digital wallet payments.")
  System_Ext(shipping, "Shipping Provider", "Handles order fulfillment and delivery tracking.")
  System_Ext(email, "E-mail System", "Sends order confirmations and shipping notifications.")

  Rel(customer, ecommerce, "Browses products and places orders using")
  Rel(seller, ecommerce, "Lists products and manages inventory using")
  Rel(ecommerce, payment, "Processes payments via")
  Rel(ecommerce, shipping, "Dispatches orders via")
  Rel(ecommerce, email, "Sends notifications using")`,
    level2: `C4Container
  title Container – E-Commerce Platform

  Person(customer, "Customer", "A person who shops online.")
  Person(seller, "Seller", "A product vendor.")

  System_Boundary(ec, "E-Commerce Platform") {
    Container(webApp, "Web Application", "Astro / Node.js", "Serves the storefront to customers via their browser.")
    Container(mobileApp, "Mobile App", "React Native", "Provides the shopping experience on mobile devices.")
    Container(apiGateway, "API Gateway", "Node.js / Express", "Routes requests to the appropriate microservices.")
    Container(productService, "Product Service", "Node.js", "Manages product catalogue and search.")
    Container(orderService, "Order Service", "Node.js", "Handles order creation, status, and history.")
    ContainerDb(db, "Database", "PostgreSQL", "Stores products, orders, and customer data.")
    Container(queue, "Message Queue", "RabbitMQ", "Decouples order events from downstream processing.")
  }

  System_Ext(payment, "Payment Gateway", "Stripe")
  System_Ext(shipping, "Shipping Provider", "FedEx / UPS")
  System_Ext(email, "E-mail System", "SendGrid")

  Rel(customer, webApp, "Visits", "HTTPS")
  Rel(customer, mobileApp, "Uses", "HTTPS")
  Rel(seller, webApp, "Manages listings via", "HTTPS")
  Rel(webApp, apiGateway, "Calls", "JSON/HTTPS")
  Rel(mobileApp, apiGateway, "Calls", "JSON/HTTPS")
  Rel(apiGateway, productService, "Routes to", "JSON/HTTPS")
  Rel(apiGateway, orderService, "Routes to", "JSON/HTTPS")
  Rel(productService, db, "Reads/writes", "SQL")
  Rel(orderService, db, "Reads/writes", "SQL")
  Rel(orderService, queue, "Publishes events to", "AMQP")
  Rel(queue, payment, "Triggers payment via")
  Rel(queue, shipping, "Triggers shipment via")
  Rel(queue, email, "Sends notifications via")`,
    level3: `C4Component
  title Component – Order Service

  Container_Ext(apiGateway, "API Gateway", "Node.js / Express", "Routes incoming requests.")
  Container_Ext(queue, "Message Queue", "RabbitMQ", "Receives order events.")

  Container_Boundary(os, "Order Service") {
    Component(orderController, "Order Controller", "Express Router", "Handles order creation and retrieval endpoints.")
    Component(orderService, "Order Service", "Node.js module", "Business logic for orders.")
    Component(paymentClient, "Payment Client", "Node.js module", "Integrates with the Payment Gateway.")
    Component(shippingClient, "Shipping Client", "Node.js module", "Integrates with the Shipping Provider.")
    Component(orderRepository, "Order Repository", "Node.js module", "Persists and queries order records.")
    Component(eventPublisher, "Event Publisher", "Node.js module", "Publishes order events to the message queue.")
  }

  ContainerDb_Ext(db, "Database", "PostgreSQL", "Stores order records.")

  Rel(apiGateway, orderController, "Calls", "JSON/HTTPS")
  Rel(orderController, orderService, "Uses")
  Rel(orderService, paymentClient, "Uses")
  Rel(orderService, shippingClient, "Uses")
  Rel(orderService, orderRepository, "Uses")
  Rel(orderService, eventPublisher, "Uses")
  Rel(orderRepository, db, "Reads/writes", "SQL")
  Rel(eventPublisher, queue, "Publishes to", "AMQP")`,
    level4: `classDiagram
  direction TB

  class OrderController {
    +createOrder(req, res) void
    +getOrder(req, res) void
    +listOrders(req, res) void
  }

  class OrderService {
    -orderRepository: OrderRepository
    -paymentClient: PaymentClient
    -eventPublisher: EventPublisher
    +createOrder(customerId: string, items: OrderItem[]) Promise~Order~
    +getOrder(orderId: string) Promise~Order~
  }

  class OrderRepository {
    -db: DatabaseConnection
    +save(order: Order) Promise~Order~
    +findById(orderId: string) Promise~Order~
    +findByCustomer(customerId: string) Promise~Order[]~
  }

  class PaymentClient {
    -apiKey: string
    +charge(amount: number, token: string) Promise~PaymentResult~
  }

  class Order {
    +id: string
    +customerId: string
    +status: string
    +total: number
    +createdAt: Date
  }

  class OrderItem {
    +productId: string
    +quantity: number
    +unitPrice: number
  }

  OrderController --> OrderService : uses
  OrderService --> OrderRepository : uses
  OrderService --> PaymentClient : uses
  OrderRepository --> Order : returns
  Order --> OrderItem : contains`,
  },
  ridesharing: {
    title: 'Ride-Sharing App',
    description: 'A Ride-Sharing App illustrated across all 4 levels of the C4 model.',
    level1: `C4Context
  title System Context – Ride-Sharing App

  Person(rider, "Rider", "A passenger who requests and pays for rides.")
  Person(driver, "Driver", "A driver who accepts ride requests.")

  System(ridesharing, "Ride-Sharing App", "Connects riders with nearby drivers and handles trip booking and payment.")

  System_Ext(maps, "Maps & Routing API", "Provides location search, routing, and ETA calculations.")
  System_Ext(payment, "Payment Gateway", "Processes ride fares and driver payouts.")
  System_Ext(sms, "SMS Provider", "Sends trip status notifications to riders and drivers.")

  Rel(rider, ridesharing, "Requests and pays for rides using")
  Rel(driver, ridesharing, "Accepts trips and receives payouts via")
  Rel(ridesharing, maps, "Gets routes and ETAs from")
  Rel(ridesharing, payment, "Processes fares via")
  Rel(ridesharing, sms, "Sends SMS notifications using")`,
    level2: `C4Container
  title Container – Ride-Sharing App

  Person(rider, "Rider", "Requests a ride.")
  Person(driver, "Driver", "Accepts a ride.")

  System_Boundary(rs, "Ride-Sharing App") {
    Container(riderApp, "Rider App", "React Native", "Lets riders request rides, track drivers, and pay.")
    Container(driverApp, "Driver App", "React Native", "Lets drivers accept trips and navigate to destinations.")
    Container(apiServer, "API Server", "Node.js / Express", "Core backend handling trips, matching, and payments.")
    Container(locationService, "Location Service", "Node.js", "Tracks real-time driver positions.")
    ContainerDb(db, "Database", "PostgreSQL", "Stores users, trips, and payment records.")
    ContainerDb(cache, "Cache", "Redis", "Stores active driver locations and trip state.")
  }

  System_Ext(maps, "Maps & Routing API", "Google Maps Platform")
  System_Ext(payment, "Payment Gateway", "Stripe")
  System_Ext(sms, "SMS Provider", "Twilio")

  Rel(rider, riderApp, "Uses", "HTTPS")
  Rel(driver, driverApp, "Uses", "HTTPS")
  Rel(riderApp, apiServer, "Calls", "JSON/HTTPS")
  Rel(driverApp, apiServer, "Calls", "JSON/HTTPS")
  Rel(driverApp, locationService, "Sends location updates to", "WebSocket")
  Rel(apiServer, db, "Reads/writes", "SQL")
  Rel(apiServer, cache, "Reads/writes", "Redis Protocol")
  Rel(locationService, cache, "Updates driver positions in", "Redis Protocol")
  Rel(apiServer, maps, "Gets routes from", "HTTPS")
  Rel(apiServer, payment, "Processes fares via", "HTTPS")
  Rel(apiServer, sms, "Sends notifications via", "HTTPS")`,
    level3: `C4Component
  title Component – API Server

  Container_Ext(riderApp, "Rider App", "React Native", "Mobile app for riders.")
  Container_Ext(driverApp, "Driver App", "React Native", "Mobile app for drivers.")

  Container_Boundary(api, "API Server") {
    Component(tripController, "Trip Controller", "Express Router", "Handles trip request, acceptance, and completion.")
    Component(matchingService, "Matching Service", "Node.js module", "Finds the nearest available driver for a rider.")
    Component(tripService, "Trip Service", "Node.js module", "Business logic for trip lifecycle.")
    Component(paymentService, "Payment Service", "Node.js module", "Calculates fares and triggers payment.")
    Component(notificationService, "Notification Service", "Node.js module", "Sends SMS updates to riders and drivers.")
    Component(tripRepository, "Trip Repository", "Node.js module", "Persists trip records to the database.")
  }

  ContainerDb_Ext(db, "Database", "PostgreSQL", "Stores trip records.")
  ContainerDb_Ext(cache, "Cache", "Redis", "Active driver locations.")
  System_Ext(payment, "Payment Gateway", "Stripe")
  System_Ext(sms, "SMS Provider", "Twilio")

  Rel(riderApp, tripController, "Calls", "JSON/HTTPS")
  Rel(driverApp, tripController, "Calls", "JSON/HTTPS")
  Rel(tripController, tripService, "Uses")
  Rel(tripService, matchingService, "Uses")
  Rel(tripService, paymentService, "Uses")
  Rel(tripService, notificationService, "Uses")
  Rel(tripService, tripRepository, "Uses")
  Rel(matchingService, cache, "Reads driver locations from", "Redis Protocol")
  Rel(tripRepository, db, "Reads/writes", "SQL")
  Rel(paymentService, payment, "Charges via", "HTTPS")
  Rel(notificationService, sms, "Sends via", "HTTPS")`,
    level4: `classDiagram
  direction TB

  class TripController {
    +requestTrip(req, res) void
    +acceptTrip(req, res) void
    +completeTrip(req, res) void
  }

  class TripService {
    -matchingService: MatchingService
    -tripRepository: TripRepository
    -paymentService: PaymentService
    +requestTrip(riderId: string, pickup: Location) Promise~Trip~
    +completeTrip(tripId: string) Promise~Trip~
  }

  class MatchingService {
    -cache: CacheClient
    +findNearestDriver(pickup: Location) Promise~Driver~
  }

  class TripRepository {
    -db: DatabaseConnection
    +save(trip: Trip) Promise~Trip~
    +findById(tripId: string) Promise~Trip~
  }

  class Trip {
    +id: string
    +riderId: string
    +driverId: string
    +status: string
    +fare: number
  }

  class Location {
    +lat: number
    +lng: number
  }

  TripController --> TripService : uses
  TripService --> MatchingService : uses
  TripService --> TripRepository : uses
  TripRepository --> Trip : returns
  Trip --> Location : uses`,
  },
  tooda: {
    title: 'Tooda',
    description: 'Tooda – a browser-based architecture diagramming tool – illustrated across all 4 levels of the C4 model.',
    level1: `C4Context
  title System Context – Tooda

  Person(developer, "Developer / Architect", "Creates and maintains software architecture diagrams.")

  System(tooda, "Tooda", "A browser-based tool for visualizing software architecture using C4/Mermaid and Excalidraw.")

  System_Ext(githubPages, "GitHub Pages", "Hosts and serves the Tooda static site.")
  System_Ext(mermaid, "Mermaid", "Renders C4 and class diagrams from plain-text definitions in the browser.")
  System_Ext(excalidraw, "Excalidraw", "Renders freehand-style architecture diagrams in the browser.")

  Rel(developer, tooda, "Browses and creates diagrams using")
  Rel(tooda, githubPages, "Is hosted and served by")
  Rel(tooda, mermaid, "Renders C4 diagrams with")
  Rel(tooda, excalidraw, "Renders freehand diagrams with")`,
    level2: `C4Container
  title Container – Tooda

  Person(developer, "Developer / Architect", "Creates and maintains architecture diagrams.")

  System_Boundary(t, "Tooda") {
    Container(webApp, "Static Web App", "Astro / Node.js", "Builds and serves the static site to users via their browser.")
    Container(c4Page, "C4 Viewer", "Astro Page + Mermaid.js", "Provides tabbed C4 diagram navigation for multiple example systems.")
    Container(excalidrawPage, "Excalidraw Viewer", "Astro Page + React", "Renders freehand-style diagrams using the Excalidraw component.")
    Container(apiPage, "API Explorer", "Astro Page", "Allows users to inspect and test API endpoints interactively.")
  }

  System_Ext(githubPages, "GitHub Pages", "Hosts and serves the built static site.")
  System_Ext(mermaidLib, "Mermaid Library", "Renders C4 and class diagrams as SVG in the browser.")
  System_Ext(excalidrawLib, "Excalidraw Library", "Renders interactive freehand diagrams in the browser.")

  Rel(developer, webApp, "Visits", "HTTPS")
  Rel(githubPages, webApp, "Hosts and serves")
  Rel(webApp, c4Page, "Routes /c4 to")
  Rel(webApp, excalidrawPage, "Routes /excalidraw to")
  Rel(webApp, apiPage, "Routes /api to")
  Rel(c4Page, mermaidLib, "Renders diagrams with")
  Rel(excalidrawPage, excalidrawLib, "Renders diagrams with")`,
    level3: `C4Component
  title Component – C4 Viewer

  Person_Ext(developer, "Developer / Architect", "Interacts with the C4 Viewer.")

  Container_Boundary(c4, "C4 Viewer") {
    Component(diagramData, "Diagram Data", "TypeScript module", "Holds Mermaid diagram definitions for all examples and all four C4 levels.")
    Component(tabController, "Tab Controller", "Vanilla JS", "Handles switching between Level 1–4 diagram tabs and URL hash routing.")
    Component(exampleSwitcher, "Example Switcher", "Vanilla JS", "Switches the active example and updates all level diagrams from Diagram Data.")
    Component(viewToggle, "View Toggle", "Vanilla JS", "Toggles between Diagram, Code, and Edit views and updates URL query params.")
    Component(mermaidRenderer, "Mermaid Renderer", "Mermaid.js", "Renders Mermaid source text as SVG diagrams on demand.")
    Component(panZoomController, "Pan/Zoom Controller", "Vanilla JS", "Handles mouse/touch pan and scroll-to-zoom interactions on diagram SVGs.")
    Component(nodeDragController, "Node Drag Controller", "Vanilla JS", "Allows repositioning diagram nodes in Edit mode and exports coordinates.")
  }

  System_Ext(mermaidLib, "Mermaid Library", "Renders SVG from Mermaid source text.")

  Rel(developer, tabController, "Clicks level tabs")
  Rel(developer, exampleSwitcher, "Selects example")
  Rel(developer, viewToggle, "Toggles view")
  Rel(developer, panZoomController, "Pans and zooms diagram")
  Rel(developer, nodeDragController, "Drags nodes in Edit mode")
  Rel(tabController, mermaidRenderer, "Triggers re-render on tab switch")
  Rel(exampleSwitcher, diagramData, "Reads diagram source from")
  Rel(exampleSwitcher, mermaidRenderer, "Triggers re-render on example switch")
  Rel(viewToggle, mermaidRenderer, "Triggers re-render when switching to Diagram view")
  Rel(mermaidRenderer, mermaidLib, "Delegates SVG rendering to")
  Rel(nodeDragController, panZoomController, "Coordinates transform with")`,
    level4: `classDiagram
  direction TB

  class DiagramEntry {
    +title: string
    +description: string
    +level1: string
    +level2: string
    +level3: string
    +level4: string
  }

  class DiagramCollection {
    +banking: DiagramEntry
    +ecommerce: DiagramEntry
    +ridesharing: DiagramEntry
    +tooda: DiagramEntry
  }

  class Logger {
    -prefix: string
    +debug(msg: string) void
    +info(msg: string) void
    +warn(msg: string) void
    +error(msg: string) void
  }

  class MermaidConfig {
    +startOnLoad: boolean
    +theme: string
  }

  DiagramCollection --> DiagramEntry : contains
  Logger ..> MermaidConfig : used alongside`,
  },
};
