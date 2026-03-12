import type { DiagramNode } from '../../healthcare/nodes';

export const LEVEL_NODES: Record<number, DiagramNode[]> = {
  1: [
    { label: 'Personal Banking Customer', icon: '👤', color: 0x3b82f6, description: 'A personal banking customer who uses the online banking system.',         excalidrawId: 'l1-customer'      },
    { label: 'Bank Staff',                icon: '👷', color: 0x3b82f6, description: 'A member of bank staff who manages customer accounts and support.',       excalidrawId: 'l1-staff'         },
    { label: 'Online Banking System',     icon: '🏦', color: 0x22c55e, description: 'Provides internet banking to customers and bank staff.',                  excalidrawId: 'l1-onlineBanking' },
    { label: 'E-mail System',             icon: '📧', color: 0x64748b, description: 'Sends e-mail notifications to customers.',                                excalidrawId: 'l1-email'         },
    { label: 'Mainframe Banking System',  icon: '🖥️', color: 0x64748b, description: 'Stores core banking data and processes transactions.',                    excalidrawId: 'l1-mainframe'     },
  ],
  2: [
    { label: 'Personal Banking Customer', icon: '👤', color: 0x3b82f6, description: 'A personal banking customer who uses the online banking system.',         excalidrawId: 'l2-customer'  },
    { label: 'Web Application',           icon: '🌐', color: 0x8b5cf6, description: 'Delivers the static content and the single-page application.',            excalidrawId: 'l2-webApp'    },
    { label: 'Mobile App',                icon: '📱', color: 0x8b5cf6, description: 'Provides banking access on mobile devices.',                              excalidrawId: 'l2-mobileApp' },
    { label: 'Single-Page App',           icon: '🖥️', color: 0x8b5cf6, description: 'Provides banking features via a JavaScript SPA in the browser.',         excalidrawId: 'l2-spa'       },
    { label: 'API Application',           icon: '🔀', color: 0x8b5cf6, description: 'Provides banking functionality via a JSON/HTTPS API.',                    excalidrawId: 'l2-apiApp'    },
    { label: 'Database',                  icon: '🗄️', color: 0xf59e0b, description: 'Stores user registration information, hashed auth credentials, and more.',excalidrawId: 'l2-db'        },
    { label: 'E-mail System',             icon: '📧', color: 0x64748b, description: 'Sends e-mail notifications to customers.',                                excalidrawId: 'l2-email'     },
    { label: 'Mainframe Banking System',  icon: '🖥️', color: 0x64748b, description: 'Stores core banking data and processes transactions.',                    excalidrawId: 'l2-mainframe' },
  ],
  3: [
    { label: 'Client Applications',     icon: '📱', color: 0x64748b, description: 'The web SPA and mobile app that call the API.',                       excalidrawId: 'l3-clients'            },
    { label: 'Payments Controller',     icon: '🎮', color: 0x0ea5e9, description: 'Handles payment-related API requests.',                                excalidrawId: 'l3-paymentsController' },
    { label: 'Accounts Controller',     icon: '🎮', color: 0x0ea5e9, description: 'Handles account balance and transaction requests.',                    excalidrawId: 'l3-accountsController' },
    { label: 'Auth Controller',         icon: '🔐', color: 0x0ea5e9, description: 'Handles sign-in, sign-out, and password change requests.',            excalidrawId: 'l3-authController'     },
    { label: 'Payments Service',        icon: '⚙️', color: 0x0ea5e9, description: 'Business logic for processing payments.',                             excalidrawId: 'l3-paymentsService'    },
    { label: 'Accounts Service',        icon: '⚙️', color: 0x0ea5e9, description: 'Business logic for account and transaction data.',                    excalidrawId: 'l3-accountsService'    },
    { label: 'Auth Service',            icon: '🔑', color: 0x0ea5e9, description: 'Validates credentials and issues tokens.',                            excalidrawId: 'l3-authService'        },
    { label: 'E-mail Service',          icon: '📧', color: 0x0ea5e9, description: 'Sends payment confirmations and alerts via e-mail.',                  excalidrawId: 'l3-emailService'       },
    { label: 'Mainframe Banking System',icon: '🖥️', color: 0x64748b, description: 'Stores core banking data and processes transactions.',                excalidrawId: 'l3-mainframe'          },
    { label: 'Database',                icon: '🗄️', color: 0xf59e0b, description: 'Stores user accounts and transaction history.',                       excalidrawId: 'l3-db'                 },
    { label: 'E-mail System',           icon: '📮', color: 0x64748b, description: 'The external e-mail infrastructure.',                                 excalidrawId: 'l3-email'              },
  ],
  4: [
    { label: 'AccountsController', icon: '🎮', color: 0x3b82f6, description: 'Exposes REST endpoints for account balances and transactions.',       excalidrawId: 'l4-ctrl'    },
    { label: 'AccountsService',    icon: '⚙️', color: 0x22c55e, description: 'Business logic for retrieving accounts and transactions.',            excalidrawId: 'l4-svc'     },
    { label: 'AccountsRepository', icon: '📦', color: 0xf59e0b, description: 'Abstracts database access for account data.',                         excalidrawId: 'l4-repo'    },
    { label: 'MainframeClient',    icon: '🖥️', color: 0xa855f7, description: 'Fetches account data from the Mainframe Banking System.',             excalidrawId: 'l4-mf'      },
    { label: 'Account',           icon: '📄', color: 0xec4899, description: 'Entity representing a bank account.',                                  excalidrawId: 'l4-account' },
    { label: 'Transaction',       icon: '📊', color: 0x3b82f6, description: 'Entity representing a single banking transaction.',                     excalidrawId: 'l4-tx'      },
  ],
};
