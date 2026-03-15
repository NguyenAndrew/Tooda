/** A node in the Healthcare Platform architecture diagram. */
export interface DiagramNode {
  label: string;
  icon: string;
  color: number;
  description: string;
  /** Excalidraw element ID – used to map Excalidraw arrow bindings to nodes. */
  excalidrawId: string;
}

export const LEVEL_NODES: Record<number, DiagramNode[]> = {
  1: [
    { label: 'Patient',             icon: '👤', color: 0x6366f1, description: 'Books appointments and views medical records.',            excalidrawId: 'l1-patient'  },
    { label: 'Doctor',              icon: '🩺', color: 0x6366f1, description: 'Views patient records and orders tests.',                  excalidrawId: 'l1-doctor'   },
    { label: 'Admin',               icon: '👑', color: 0x6366f1, description: 'Manages users and platform configuration.',               excalidrawId: 'l1-admin'    },
    { label: 'Healthcare Platform', icon: '🏥', color: 0x8b5cf6, description: 'Provides appointment scheduling, EMR, and billing.',       excalidrawId: 'l1-platform' },
    { label: 'Pharmacy',            icon: '💊', color: 0x64748b, description: 'Receives prescriptions and dispenses medication.',         excalidrawId: 'l1-pharmacy' },
    { label: 'Insurance',           icon: '🛡️', color: 0x64748b, description: 'Verifies patient coverage and processes claims.',          excalidrawId: 'l1-insurance'},
    { label: 'Lab',                 icon: '🔬', color: 0x64748b, description: 'Receives test orders and returns results.',                excalidrawId: 'l1-lab'      },
  ],
  2: [
    { label: 'Patient',         icon: '👤', color: 0x6366f1, description: 'Books appointments and views medical records.',    excalidrawId: 'l2-patient' },
    { label: 'Doctor',          icon: '🩺', color: 0x6366f1, description: 'Views patient records and orders tests.',          excalidrawId: 'l2-doctor'  },
    { label: 'Web App',         icon: '🌐', color: 0x0ea5e9, description: 'Delivers the web front-end to users via their browser.', excalidrawId: 'l2-webapp'  },
    { label: 'Mobile App',      icon: '📱', color: 0x0ea5e9, description: 'Provides healthcare access on mobile devices.',    excalidrawId: 'l2-mobile'  },
    { label: 'API Gateway',     icon: '🔀', color: 0x0ea5e9, description: 'Routes requests and enforces authentication.',      excalidrawId: 'l2-api'     },
    { label: 'EMR Service',     icon: '📋', color: 0x0ea5e9, description: 'Manages electronic medical records.',              excalidrawId: 'l2-emr'     },
    { label: 'Appt Service',    icon: '📅', color: 0x0ea5e9, description: 'Handles appointment scheduling and reminders.',    excalidrawId: 'l2-appt'    },
    { label: 'Billing Service', icon: '💳', color: 0x0ea5e9, description: 'Processes billing and insurance claims.',          excalidrawId: 'l2-billing' },
    { label: 'Database',        icon: '🗄️', color: 0x06b6d4, description: 'Stores patient records, appointments, and billing data.', excalidrawId: 'l2-db'      },
    { label: 'Message Queue',   icon: '📨', color: 0x0ea5e9, description: 'Decouples async communication between services.',  excalidrawId: 'l2-queue'   },
  ],
  3: [
    { label: 'API Gateway',       icon: '🔀', color: 0x64748b, description: 'Routes authenticated requests to the EMR Service.', excalidrawId: 'l3-gateway' },
    { label: 'Database',          icon: '🗄️', color: 0x64748b, description: 'Stores medical records.',                           excalidrawId: 'l3-db'      },
    { label: 'Record Controller', icon: '🎮', color: 0x10b981, description: 'Exposes REST endpoints for medical records.',        excalidrawId: 'l3-ctrl'    },
    { label: 'Record Service',    icon: '⚙️', color: 0x10b981, description: 'Business logic for creating and retrieving records.', excalidrawId: 'l3-svc'     },
    { label: 'Record Repo',       icon: '📦', color: 0x10b981, description: 'Abstracts database access for medical records.',     excalidrawId: 'l3-repo'    },
    { label: 'Auth Module',       icon: '🔐', color: 0x10b981, description: 'Validates JWT tokens on incoming requests.',         excalidrawId: 'l3-auth'    },
    { label: 'Audit Logger',      icon: '📝', color: 0x10b981, description: 'Logs all record access for compliance.',             excalidrawId: 'l3-audit'   },
    { label: 'Cache Client',      icon: '⚡', color: 0x10b981, description: 'Caches frequently accessed records.',                excalidrawId: 'l3-cache'   },
  ],
  4: [
    { label: 'RecordController',  icon: '🎮', color: 0x8b5cf6, description: 'Exposes REST endpoints for medical records.',               excalidrawId: 'l4-ctrl'  },
    { label: 'RecordService',     icon: '⚙️', color: 0x8b5cf6, description: 'Business logic for creating and retrieving records.',       excalidrawId: 'l4-svc'   },
    { label: 'RecordRepository',  icon: '📦', color: 0x8b5cf6, description: 'Implements IRecordRepository using PostgreSQL.',            excalidrawId: 'l4-repo'  },
    { label: 'MedicalRecord',     icon: '📄', color: 0x8b5cf6, description: 'Entity representing a medical record.',                     excalidrawId: 'l4-model' },
    { label: 'CacheClient',       icon: '⚡', color: 0x8b5cf6, description: 'Caches frequently accessed records.',                       excalidrawId: 'l4-cache' },
  ],
};
