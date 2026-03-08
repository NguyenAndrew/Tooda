/**
 * Healthcare Platform – single source of truth
 *
 * This file is the canonical definition of the Healthcare Platform architecture.
 * Both the Mermaid C4 diagram strings and the Excalidraw element sets are
 * exported from here so that every view of the Healthcare Platform diagram
 * traces back to one place.
 */

export { level1Elements } from '../excalidraw/level1Elements';
export { level2Elements } from '../excalidraw/level2Elements';
export { level3Elements } from '../excalidraw/level3Elements';
export { level4Elements } from '../excalidraw/level4Elements';

export const mermaidDiagrams = {
  level1: `C4Context
  title System Context – Healthcare Platform

  Person(patient, "Patient", "Books appointments and views medical records.")
  Person(doctor, "Doctor", "Views patient records and orders tests.")
  Person(admin, "Admin", "Manages users and platform configuration.")

  System(healthcarePlatform, "Healthcare Platform", "Provides appointment scheduling, electronic medical records, and billing.")

  System_Ext(pharmacySystem, "Pharmacy System", "Receives prescriptions and dispenses medication.")
  System_Ext(insuranceSystem, "Insurance System", "Verifies patient coverage and processes claims.")
  System_Ext(laboratorySystem, "Laboratory System", "Receives test orders and returns results.")

  Rel(patient, healthcarePlatform, "Schedules appointments using")
  Rel(doctor, healthcarePlatform, "Views patient records using")
  Rel(admin, healthcarePlatform, "Manages users using")
  Rel(healthcarePlatform, pharmacySystem, "Sends prescriptions to")
  Rel(healthcarePlatform, insuranceSystem, "Verifies coverage with")
  Rel(healthcarePlatform, laboratorySystem, "Orders tests via")`,

  level2: `C4Container
  title Container – Healthcare Platform

  Person(patient, "Patient", "Books appointments and views medical records.")
  Person(doctor, "Doctor", "Views patient records and orders tests.")

  System_Boundary(hp, "Healthcare Platform") {
    Container(webApp, "Web App", "Astro", "Delivers the web front-end to users via their browser.")
    Container(mobileApp, "Mobile App", "React Native", "Provides healthcare access on mobile devices.")
    Container(apiGateway, "API Gateway", "Node.js", "Routes requests and enforces authentication.")
    Container(emrService, "EMR Service", "Node.js", "Manages electronic medical records.")
    Container(appointmentService, "Appointment Service", "Node.js", "Handles appointment scheduling and reminders.")
    Container(billingService, "Billing Service", "Node.js", "Processes billing and insurance claims.")
    ContainerDb(database, "Database", "PostgreSQL", "Stores patient records, appointments, and billing data.")
    Container(messageQueue, "Message Queue", "RabbitMQ", "Decouples async communication between services.")
  }

  Rel(patient, webApp, "Uses", "HTTPS")
  Rel(patient, mobileApp, "Uses", "HTTPS")
  Rel(doctor, webApp, "Uses", "HTTPS")
  Rel(webApp, apiGateway, "Calls", "JSON/HTTPS")
  Rel(mobileApp, apiGateway, "Calls", "JSON/HTTPS")
  Rel(apiGateway, emrService, "Routes to", "JSON/HTTPS")
  Rel(apiGateway, appointmentService, "Routes to", "JSON/HTTPS")
  Rel(apiGateway, billingService, "Routes to", "JSON/HTTPS")
  Rel(emrService, database, "Reads/writes", "SQL")
  Rel(appointmentService, database, "Reads/writes", "SQL")
  Rel(billingService, database, "Reads/writes", "SQL")
  Rel(emrService, messageQueue, "Publishes events to", "AMQP")
  Rel(appointmentService, messageQueue, "Subscribes to", "AMQP")`,

  level3: `C4Component
  title Component – EMR Service

  Container_Ext(apiGateway, "API Gateway", "Node.js", "Routes authenticated requests to the EMR Service.")
  ContainerDb_Ext(database, "Database", "PostgreSQL", "Stores medical records.")

  Container_Boundary(emr, "EMR Service") {
    Component(authMiddleware, "Auth Middleware", "Node.js module", "Validates JWT tokens on incoming requests.")
    Component(recordController, "Record Controller", "Express Router", "Exposes REST endpoints for medical records.")
    Component(recordService, "Record Service", "Node.js module", "Business logic for creating and retrieving records.")
    Component(recordRepository, "Record Repository", "Node.js module", "Abstracts database access for medical records.")
    Component(auditLogger, "Audit Logger", "Node.js module", "Logs all record access for compliance.")
    Component(cacheManager, "Cache Manager", "Redis client", "Caches frequently accessed records.")
  }

  Rel(apiGateway, authMiddleware, "Sends requests through", "JSON/HTTPS")
  Rel(authMiddleware, recordController, "Passes validated request to")
  Rel(recordController, recordService, "Uses")
  Rel(recordController, auditLogger, "Logs access via")
  Rel(recordService, recordRepository, "Uses")
  Rel(recordService, cacheManager, "Caches results with")
  Rel(recordRepository, database, "Reads/writes", "SQL")`,

  level4: `classDiagram
  direction TB

  class RecordController {
    +getRecord(req, res) void
    +createRecord(req, res) void
  }

  class RecordService {
    -recordRepository: RecordRepository
    -cacheClient: CacheClient
    +getRecord(id: string) Promise~MedicalRecord~
    +createRecord(data: object) Promise~MedicalRecord~
  }

  class RecordRepository {
    -db: DatabaseConnection
    +findById(id: string) Promise~MedicalRecord~
    +save(record: MedicalRecord) Promise~MedicalRecord~
  }

  class MedicalRecord {
    +id: string
    +patientId: string
    +diagnosis: string
  }

  class CacheClient {
    +get(key: string) Promise~string~
    +set(key: string, value: string) Promise~void~
  }

  RecordController --> RecordService : uses
  RecordService --> RecordRepository : uses
  RecordService --> CacheClient : uses
  RecordRepository --> MedicalRecord : returns
  RecordService --> MedicalRecord : returns`,
};
