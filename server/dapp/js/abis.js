const nftABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "approved",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "ApprovalForAll",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "version",
        "type": "uint8"
      }
    ],
    "name": "Initialized",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "previousAdminRole",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "newAdminRole",
        "type": "bytes32"
      }
    ],
    "name": "RoleAdminChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "RoleGranted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "RoleRevoked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "DEFAULT_ADMIN_ROLE",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "MINTER_ROLE",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "SUPERAPP_ROLE",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "exists",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "getApproved",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      }
    ],
    "name": "getRoleAdmin",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "grantRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "hasRole",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_admin",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_owner",
        "type": "address"
      },
      {
        "components": [
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "symbol",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "uri",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "maxSupply",
            "type": "uint256"
          }
        ],
        "internalType": "struct S2ONFT.Settings",
        "name": "_settings",
        "type": "tuple"
      }
    ],
    "name": "initialize",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      }
    ],
    "name": "isApprovedForAll",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "forwarder",
        "type": "address"
      }
    ],
    "name": "isTrustedForwarder",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "maxSupply",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "",
        "type": "bytes"
      }
    ],
    "name": "onERC721Received",
    "outputs": [
      {
        "internalType": "bytes4",
        "name": "",
        "type": "bytes4"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "onStreamChange",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "ownerOf",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "renounceRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "revokeRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "setApprovalForAll",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "interfaceId",
        "type": "bytes4"
      }
    ],
    "name": "supportsInterface",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "tokenURI",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const cfaJSON = {
  "abi": [
    {
        "inputs": [
            {
                "internalType": "contract ISuperfluid",
                "name": "host",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "AGREEMENT_BASE_ONLY_HOST",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_code",
                "type": "uint256"
            }
        ],
        "name": "APP_RULE",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "CFA_ACL_FLOW_RATE_ALLOWANCE_EXCEEDED",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "CFA_ACL_NO_NEGATIVE_ALLOWANCE",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "CFA_ACL_NO_SENDER_CREATE",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "CFA_ACL_NO_SENDER_FLOW_OPERATOR",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "CFA_ACL_NO_SENDER_UPDATE",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "CFA_ACL_OPERATOR_NO_CREATE_PERMISSIONS",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "CFA_ACL_OPERATOR_NO_DELETE_PERMISSIONS",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "CFA_ACL_OPERATOR_NO_UPDATE_PERMISSIONS",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "CFA_ACL_UNCLEAN_PERMISSIONS",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "CFA_DEPOSIT_TOO_BIG",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "CFA_FLOW_ALREADY_EXISTS",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "CFA_FLOW_DOES_NOT_EXIST",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "CFA_FLOW_RATE_TOO_BIG",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "CFA_HOOK_OUT_OF_GAS",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "CFA_INSUFFICIENT_BALANCE",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "CFA_INVALID_FLOW_RATE",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "CFA_NON_CRITICAL_SENDER",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "CFA_NO_SELF_FLOW",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "CFA_ZERO_ADDRESS_RECEIVER",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "CFA_ZERO_ADDRESS_SENDER",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "OUT_OF_GAS",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "bytes32",
                "name": "uuid",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "codeAddress",
                "type": "address"
            }
        ],
        "name": "CodeUpdated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "contract ISuperfluidToken",
                "name": "token",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "flowOperator",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint8",
                "name": "permissions",
                "type": "uint8"
            },
            {
                "indexed": false,
                "internalType": "int96",
                "name": "flowRateAllowance",
                "type": "int96"
            }
        ],
        "name": "FlowOperatorUpdated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "contract ISuperfluidToken",
                "name": "token",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "receiver",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "int96",
                "name": "flowRate",
                "type": "int96"
            },
            {
                "indexed": false,
                "internalType": "int256",
                "name": "totalSenderFlowRate",
                "type": "int256"
            },
            {
                "indexed": false,
                "internalType": "int256",
                "name": "totalReceiverFlowRate",
                "type": "int256"
            },
            {
                "indexed": false,
                "internalType": "bytes",
                "name": "userData",
                "type": "bytes"
            }
        ],
        "name": "FlowUpdated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "flowOperator",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "deposit",
                "type": "uint256"
            }
        ],
        "name": "FlowUpdatedExtension",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint8",
                "name": "version",
                "type": "uint8"
            }
        ],
        "name": "Initialized",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "CFA_HOOK_GAS_LIMIT",
        "outputs": [
            {
                "internalType": "uint64",
                "name": "",
                "type": "uint64"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "DEFAULT_MINIMUM_DEPOSIT",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "MAXIMUM_DEPOSIT",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "MAXIMUM_FLOW_RATE",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint8",
                "name": "existingPermissions",
                "type": "uint8"
            },
            {
                "internalType": "uint8",
                "name": "permissionDelta",
                "type": "uint8"
            }
        ],
        "name": "addPermissions",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "agreementType",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "contract ISuperfluidToken",
                "name": "token",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "flowOperator",
                "type": "address"
            },
            {
                "internalType": "bytes",
                "name": "ctx",
                "type": "bytes"
            }
        ],
        "name": "authorizeFlowOperatorWithFullControl",
        "outputs": [
            {
                "internalType": "bytes",
                "name": "newCtx",
                "type": "bytes"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "castrate",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "contract ISuperfluidToken",
                "name": "token",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "receiver",
                "type": "address"
            },
            {
                "internalType": "int96",
                "name": "flowRate",
                "type": "int96"
            },
            {
                "internalType": "bytes",
                "name": "ctx",
                "type": "bytes"
            }
        ],
        "name": "createFlow",
        "outputs": [
            {
                "internalType": "bytes",
                "name": "newCtx",
                "type": "bytes"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "contract ISuperfluidToken",
                "name": "token",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "receiver",
                "type": "address"
            },
            {
                "internalType": "int96",
                "name": "flowRate",
                "type": "int96"
            },
            {
                "internalType": "bytes",
                "name": "ctx",
                "type": "bytes"
            }
        ],
        "name": "createFlowByOperator",
        "outputs": [
            {
                "internalType": "bytes",
                "name": "newCtx",
                "type": "bytes"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "contract ISuperfluidToken",
                "name": "token",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "flowOperator",
                "type": "address"
            },
            {
                "internalType": "int96",
                "name": "subtractedFlowRateAllowance",
                "type": "int96"
            },
            {
                "internalType": "bytes",
                "name": "ctx",
                "type": "bytes"
            }
        ],
        "name": "decreaseFlowRateAllowance",
        "outputs": [
            {
                "internalType": "bytes",
                "name": "newCtx",
                "type": "bytes"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "contract ISuperfluidToken",
                "name": "token",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "flowOperator",
                "type": "address"
            },
            {
                "internalType": "uint8",
                "name": "permissionsToRemove",
                "type": "uint8"
            },
            {
                "internalType": "int96",
                "name": "subtractedFlowRateAllowance",
                "type": "int96"
            },
            {
                "internalType": "bytes",
                "name": "ctx",
                "type": "bytes"
            }
        ],
        "name": "decreaseFlowRateAllowanceWithPermissions",
        "outputs": [
            {
                "internalType": "bytes",
                "name": "newCtx",
                "type": "bytes"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "contract ISuperfluidToken",
                "name": "token",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "receiver",
                "type": "address"
            },
            {
                "internalType": "bytes",
                "name": "ctx",
                "type": "bytes"
            }
        ],
        "name": "deleteFlow",
        "outputs": [
            {
                "internalType": "bytes",
                "name": "newCtx",
                "type": "bytes"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "contract ISuperfluidToken",
                "name": "token",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "receiver",
                "type": "address"
            },
            {
                "internalType": "bytes",
                "name": "ctx",
                "type": "bytes"
            }
        ],
        "name": "deleteFlowByOperator",
        "outputs": [
            {
                "internalType": "bytes",
                "name": "newCtx",
                "type": "bytes"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "contract ISuperfluidToken",
                "name": "token",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "getAccountFlowInfo",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            },
            {
                "internalType": "int96",
                "name": "flowRate",
                "type": "int96"
            },
            {
                "internalType": "uint256",
                "name": "deposit",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "owedDeposit",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getCodeAddress",
        "outputs": [
            {
                "internalType": "address",
                "name": "codeAddress",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "contract ISuperfluidToken",
                "name": "token",
                "type": "address"
            },
            {
                "internalType": "int96",
                "name": "flowRate",
                "type": "int96"
            }
        ],
        "name": "getDepositRequiredForFlowRate",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "deposit",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "contract ISuperfluidToken",
                "name": "token",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "receiver",
                "type": "address"
            }
        ],
        "name": "getFlow",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            },
            {
                "internalType": "int96",
                "name": "flowRate",
                "type": "int96"
            },
            {
                "internalType": "uint256",
                "name": "deposit",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "owedDeposit",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "contract ISuperfluidToken",
                "name": "token",
                "type": "address"
            },
            {
                "internalType": "bytes32",
                "name": "flowId",
                "type": "bytes32"
            }
        ],
        "name": "getFlowByID",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            },
            {
                "internalType": "int96",
                "name": "flowRate",
                "type": "int96"
            },
            {
                "internalType": "uint256",
                "name": "deposit",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "owedDeposit",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "contract ISuperfluidToken",
                "name": "token",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "flowOperator",
                "type": "address"
            }
        ],
        "name": "getFlowOperatorData",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "flowOperatorId",
                "type": "bytes32"
            },
            {
                "internalType": "uint8",
                "name": "permissions",
                "type": "uint8"
            },
            {
                "internalType": "int96",
                "name": "flowRateAllowance",
                "type": "int96"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "contract ISuperfluidToken",
                "name": "token",
                "type": "address"
            },
            {
                "internalType": "bytes32",
                "name": "flowOperatorId",
                "type": "bytes32"
            }
        ],
        "name": "getFlowOperatorDataByID",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "permissions",
                "type": "uint8"
            },
            {
                "internalType": "int96",
                "name": "flowRateAllowance",
                "type": "int96"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "contract ISuperfluidToken",
                "name": "token",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "deposit",
                "type": "uint256"
            }
        ],
        "name": "getMaximumFlowRateFromDeposit",
        "outputs": [
            {
                "internalType": "int96",
                "name": "flowRate",
                "type": "int96"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "contract ISuperfluidToken",
                "name": "token",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "getNetFlow",
        "outputs": [
            {
                "internalType": "int96",
                "name": "flowRate",
                "type": "int96"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "contract ISuperfluidToken",
                "name": "token",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "flowOperator",
                "type": "address"
            },
            {
                "internalType": "int96",
                "name": "addedFlowRateAllowance",
                "type": "int96"
            },
            {
                "internalType": "bytes",
                "name": "ctx",
                "type": "bytes"
            }
        ],
        "name": "increaseFlowRateAllowance",
        "outputs": [
            {
                "internalType": "bytes",
                "name": "newCtx",
                "type": "bytes"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "contract ISuperfluidToken",
                "name": "token",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "flowOperator",
                "type": "address"
            },
            {
                "internalType": "uint8",
                "name": "permissionsToAdd",
                "type": "uint8"
            },
            {
                "internalType": "int96",
                "name": "addedFlowRateAllowance",
                "type": "int96"
            },
            {
                "internalType": "bytes",
                "name": "ctx",
                "type": "bytes"
            }
        ],
        "name": "increaseFlowRateAllowanceWithPermissions",
        "outputs": [
            {
                "internalType": "bytes",
                "name": "newCtx",
                "type": "bytes"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "contract ISuperfluidToken",
                "name": "token",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "isPatricianPeriod",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "contract ISuperfluidToken",
                "name": "token",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "isPatricianPeriodNow",
        "outputs": [
            {
                "internalType": "bool",
                "name": "isCurrentlyPatricianPeriod",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "proxiableUUID",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "contract ISuperfluidToken",
                "name": "token",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "time",
                "type": "uint256"
            }
        ],
        "name": "realtimeBalanceOf",
        "outputs": [
            {
                "internalType": "int256",
                "name": "dynamicBalance",
                "type": "int256"
            },
            {
                "internalType": "uint256",
                "name": "deposit",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "owedDeposit",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint8",
                "name": "existingPermissions",
                "type": "uint8"
            },
            {
                "internalType": "uint8",
                "name": "permissionDelta",
                "type": "uint8"
            }
        ],
        "name": "removePermissions",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "contract ISuperfluidToken",
                "name": "token",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "flowOperator",
                "type": "address"
            },
            {
                "internalType": "bytes",
                "name": "ctx",
                "type": "bytes"
            }
        ],
        "name": "revokeFlowOperatorWithFullControl",
        "outputs": [
            {
                "internalType": "bytes",
                "name": "newCtx",
                "type": "bytes"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newAddress",
                "type": "address"
            }
        ],
        "name": "updateCode",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "contract ISuperfluidToken",
                "name": "token",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "receiver",
                "type": "address"
            },
            {
                "internalType": "int96",
                "name": "flowRate",
                "type": "int96"
            },
            {
                "internalType": "bytes",
                "name": "ctx",
                "type": "bytes"
            }
        ],
        "name": "updateFlow",
        "outputs": [
            {
                "internalType": "bytes",
                "name": "newCtx",
                "type": "bytes"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "contract ISuperfluidToken",
                "name": "token",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "receiver",
                "type": "address"
            },
            {
                "internalType": "int96",
                "name": "flowRate",
                "type": "int96"
            },
            {
                "internalType": "bytes",
                "name": "ctx",
                "type": "bytes"
            }
        ],
        "name": "updateFlowByOperator",
        "outputs": [
            {
                "internalType": "bytes",
                "name": "newCtx",
                "type": "bytes"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "contract ISuperfluidToken",
                "name": "token",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "flowOperator",
                "type": "address"
            },
            {
                "internalType": "uint8",
                "name": "permissions",
                "type": "uint8"
            },
            {
                "internalType": "int96",
                "name": "flowRateAllowance",
                "type": "int96"
            },
            {
                "internalType": "bytes",
                "name": "ctx",
                "type": "bytes"
            }
        ],
        "name": "updateFlowOperatorPermissions",
        "outputs": [
            {
                "internalType": "bytes",
                "name": "newCtx",
                "type": "bytes"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]
};

const hostJSON = {
  "abi": [
    {
        "inputs": [
            {
                "internalType": "bool",
                "name": "nonUpgradable",
                "type": "bool"
            },
            {
                "internalType": "bool",
                "name": "appWhiteListingEnabled",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_code",
                "type": "uint256"
            }
        ],
        "name": "APP_RULE",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "HOST_AGREEMENT_ALREADY_REGISTERED",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "HOST_AGREEMENT_CALLBACK_IS_NOT_ACTION",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "HOST_AGREEMENT_IS_NOT_REGISTERED",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "HOST_CALL_AGREEMENT_WITH_CTX_FROM_WRONG_ADDRESS",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "HOST_CALL_APP_ACTION_WITH_CTX_FROM_WRONG_ADDRESS",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "HOST_CANNOT_DOWNGRADE_TO_NON_UPGRADEABLE",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "HOST_INVALID_CONFIG_WORD",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "HOST_INVALID_OR_EXPIRED_SUPER_APP_REGISTRATION_KEY",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "HOST_MAX_256_AGREEMENTS",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "HOST_MUST_BE_CONTRACT",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "HOST_NEED_MORE_GAS",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "HOST_NON_UPGRADEABLE",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "HOST_NON_ZERO_LENGTH_PLACEHOLDER_CTX",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "HOST_NOT_A_SUPER_APP",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "HOST_NO_APP_REGISTRATION_PERMISSIONS",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "HOST_ONLY_GOVERNANCE",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "HOST_ONLY_LISTED_AGREEMENT",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "HOST_RECEIVER_IS_NOT_SUPER_APP",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "HOST_SENDER_IS_NOT_SUPER_APP",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "HOST_SOURCE_APP_NEEDS_HIGHER_APP_LEVEL",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "HOST_SUPER_APP_ALREADY_REGISTERED",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "HOST_SUPER_APP_IS_JAILED",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "HOST_UNAUTHORIZED_SUPER_APP_FACTORY",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "HOST_UNKNOWN_BATCH_CALL_OPERATION_TYPE",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "bytes32",
                "name": "agreementType",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "code",
                "type": "address"
            }
        ],
        "name": "AgreementClassRegistered",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "bytes32",
                "name": "agreementType",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "code",
                "type": "address"
            }
        ],
        "name": "AgreementClassUpdated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "contract ISuperApp",
                "name": "app",
                "type": "address"
            }
        ],
        "name": "AppRegistered",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "bytes32",
                "name": "uuid",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "codeAddress",
                "type": "address"
            }
        ],
        "name": "CodeUpdated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "contract ISuperfluidGovernance",
                "name": "oldGov",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "contract ISuperfluidGovernance",
                "name": "newGov",
                "type": "address"
            }
        ],
        "name": "GovernanceReplaced",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint8",
                "name": "version",
                "type": "uint8"
            }
        ],
        "name": "Initialized",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "contract ISuperApp",
                "name": "app",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "reason",
                "type": "uint256"
            }
        ],
        "name": "Jail",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "contract ISuperTokenFactory",
                "name": "newFactory",
                "type": "address"
            }
        ],
        "name": "SuperTokenFactoryUpdated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "contract ISuperToken",
                "name": "token",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "code",
                "type": "address"
            }
        ],
        "name": "SuperTokenLogicUpdated",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "APP_WHITE_LISTING_ENABLED",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "CALLBACK_GAS_LIMIT",
        "outputs": [
            {
                "internalType": "uint64",
                "name": "",
                "type": "uint64"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "MAX_APP_CALLBACK_LEVEL",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "MAX_NUM_AGREEMENTS",
        "outputs": [
            {
                "internalType": "uint32",
                "name": "",
                "type": "uint32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "NON_UPGRADABLE_DEPLOYMENT",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "bitmap",
                "type": "uint256"
            },
            {
                "internalType": "bytes32",
                "name": "agreementType",
                "type": "bytes32"
            }
        ],
        "name": "addToAgreementClassesBitmap",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "newBitmap",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "contract ISuperApp",
                "name": "targetApp",
                "type": "address"
            }
        ],
        "name": "allowCompositeApp",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes",
                "name": "ctx",
                "type": "bytes"
            },
            {
                "internalType": "int256",
                "name": "appCreditUsedDelta",
                "type": "int256"
            }
        ],
        "name": "appCallbackPop",
        "outputs": [
            {
                "internalType": "bytes",
                "name": "newCtx",
                "type": "bytes"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes",
                "name": "ctx",
                "type": "bytes"
            },
            {
                "internalType": "contract ISuperApp",
                "name": "app",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "appCreditGranted",
                "type": "uint256"
            },
            {
                "internalType": "int256",
                "name": "appCreditUsed",
                "type": "int256"
            },
            {
                "internalType": "contract ISuperfluidToken",
                "name": "appCreditToken",
                "type": "address"
            }
        ],
        "name": "appCallbackPush",
        "outputs": [
            {
                "internalType": "bytes",
                "name": "appCtx",
                "type": "bytes"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "uint32",
                        "name": "operationType",
                        "type": "uint32"
                    },
                    {
                        "internalType": "address",
                        "name": "target",
                        "type": "address"
                    },
                    {
                        "internalType": "bytes",
                        "name": "data",
                        "type": "bytes"
                    }
                ],
                "internalType": "struct ISuperfluid.Operation[]",
                "name": "operations",
                "type": "tuple[]"
            }
        ],
        "name": "batchCall",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "contract ISuperAgreement",
                "name": "agreementClass",
                "type": "address"
            },
            {
                "internalType": "bytes",
                "name": "callData",
                "type": "bytes"
            },
            {
                "internalType": "bytes",
                "name": "userData",
                "type": "bytes"
            }
        ],
        "name": "callAgreement",
        "outputs": [
            {
                "internalType": "bytes",
                "name": "returnedData",
                "type": "bytes"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "contract ISuperAgreement",
                "name": "agreementClass",
                "type": "address"
            },
            {
                "internalType": "bytes",
                "name": "callData",
                "type": "bytes"
            },
            {
                "internalType": "bytes",
                "name": "userData",
                "type": "bytes"
            },
            {
                "internalType": "bytes",
                "name": "ctx",
                "type": "bytes"
            }
        ],
        "name": "callAgreementWithContext",
        "outputs": [
            {
                "internalType": "bytes",
                "name": "newCtx",
                "type": "bytes"
            },
            {
                "internalType": "bytes",
                "name": "returnedData",
                "type": "bytes"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "contract ISuperApp",
                "name": "app",
                "type": "address"
            },
            {
                "internalType": "bytes",
                "name": "callData",
                "type": "bytes"
            }
        ],
        "name": "callAppAction",
        "outputs": [
            {
                "internalType": "bytes",
                "name": "returnedData",
                "type": "bytes"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "contract ISuperApp",
                "name": "app",
                "type": "address"
            },
            {
                "internalType": "bytes",
                "name": "callData",
                "type": "bytes"
            },
            {
                "internalType": "bytes",
                "name": "ctx",
                "type": "bytes"
            }
        ],
        "name": "callAppActionWithContext",
        "outputs": [
            {
                "internalType": "bytes",
                "name": "newCtx",
                "type": "bytes"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "contract ISuperApp",
                "name": "app",
                "type": "address"
            },
            {
                "internalType": "bytes",
                "name": "callData",
                "type": "bytes"
            },
            {
                "internalType": "bool",
                "name": "isTermination",
                "type": "bool"
            },
            {
                "internalType": "bytes",
                "name": "ctx",
                "type": "bytes"
            }
        ],
        "name": "callAppAfterCallback",
        "outputs": [
            {
                "internalType": "bytes",
                "name": "newCtx",
                "type": "bytes"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "contract ISuperApp",
                "name": "app",
                "type": "address"
            },
            {
                "internalType": "bytes",
                "name": "callData",
                "type": "bytes"
            },
            {
                "internalType": "bool",
                "name": "isTermination",
                "type": "bool"
            },
            {
                "internalType": "bytes",
                "name": "ctx",
                "type": "bytes"
            }
        ],
        "name": "callAppBeforeCallback",
        "outputs": [
            {
                "internalType": "bytes",
                "name": "cbdata",
                "type": "bytes"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "castrate",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes",
                "name": "ctx",
                "type": "bytes"
            },
            {
                "internalType": "int256",
                "name": "appCreditUsedMore",
                "type": "int256"
            }
        ],
        "name": "ctxUseCredit",
        "outputs": [
            {
                "internalType": "bytes",
                "name": "newCtx",
                "type": "bytes"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes",
                "name": "ctx",
                "type": "bytes"
            }
        ],
        "name": "decodeCtx",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint8",
                        "name": "appCallbackLevel",
                        "type": "uint8"
                    },
                    {
                        "internalType": "uint8",
                        "name": "callType",
                        "type": "uint8"
                    },
                    {
                        "internalType": "uint256",
                        "name": "timestamp",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "msgSender",
                        "type": "address"
                    },
                    {
                        "internalType": "bytes4",
                        "name": "agreementSelector",
                        "type": "bytes4"
                    },
                    {
                        "internalType": "bytes",
                        "name": "userData",
                        "type": "bytes"
                    },
                    {
                        "internalType": "uint256",
                        "name": "appCreditGranted",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "appCreditWantedDeprecated",
                        "type": "uint256"
                    },
                    {
                        "internalType": "int256",
                        "name": "appCreditUsed",
                        "type": "int256"
                    },
                    {
                        "internalType": "address",
                        "name": "appAddress",
                        "type": "address"
                    },
                    {
                        "internalType": "contract ISuperfluidToken",
                        "name": "appCreditToken",
                        "type": "address"
                    }
                ],
                "internalType": "struct ISuperfluid.Context",
                "name": "context",
                "type": "tuple"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "uint32",
                        "name": "operationType",
                        "type": "uint32"
                    },
                    {
                        "internalType": "address",
                        "name": "target",
                        "type": "address"
                    },
                    {
                        "internalType": "bytes",
                        "name": "data",
                        "type": "bytes"
                    }
                ],
                "internalType": "struct ISuperfluid.Operation[]",
                "name": "operations",
                "type": "tuple[]"
            }
        ],
        "name": "forwardBatchCall",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "agreementType",
                "type": "bytes32"
            }
        ],
        "name": "getAgreementClass",
        "outputs": [
            {
                "internalType": "contract ISuperAgreement",
                "name": "agreementClass",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "contract ISuperApp",
                "name": "appAddr",
                "type": "address"
            }
        ],
        "name": "getAppCallbackLevel",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "contract ISuperApp",
                "name": "app",
                "type": "address"
            }
        ],
        "name": "getAppManifest",
        "outputs": [
            {
                "internalType": "bool",
                "name": "isSuperApp",
                "type": "bool"
            },
            {
                "internalType": "bool",
                "name": "isJailed",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "noopMask",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getCodeAddress",
        "outputs": [
            {
                "internalType": "address",
                "name": "codeAddress",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getGovernance",
        "outputs": [
            {
                "internalType": "contract ISuperfluidGovernance",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getNow",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getSuperTokenFactory",
        "outputs": [
            {
                "internalType": "contract ISuperTokenFactory",
                "name": "factory",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getSuperTokenFactoryLogic",
        "outputs": [
            {
                "internalType": "address",
                "name": "logic",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "contract ISuperfluidGovernance",
                "name": "gov",
                "type": "address"
            }
        ],
        "name": "initialize",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "contract ISuperAgreement",
                "name": "agreementClass",
                "type": "address"
            }
        ],
        "name": "isAgreementClassListed",
        "outputs": [
            {
                "internalType": "bool",
                "name": "yes",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "agreementType",
                "type": "bytes32"
            }
        ],
        "name": "isAgreementTypeListed",
        "outputs": [
            {
                "internalType": "bool",
                "name": "yes",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "contract ISuperApp",
                "name": "app",
                "type": "address"
            }
        ],
        "name": "isApp",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "contract ISuperApp",
                "name": "app",
                "type": "address"
            }
        ],
        "name": "isAppJailed",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "contract ISuperApp",
                "name": "app",
                "type": "address"
            },
            {
                "internalType": "contract ISuperApp",
                "name": "targetApp",
                "type": "address"
            }
        ],
        "name": "isCompositeAppAllowed",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes",
                "name": "ctx",
                "type": "bytes"
            }
        ],
        "name": "isCtxValid",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "forwarder",
                "type": "address"
            }
        ],
        "name": "isTrustedForwarder",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes",
                "name": "ctx",
                "type": "bytes"
            },
            {
                "internalType": "contract ISuperApp",
                "name": "app",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "reason",
                "type": "uint256"
            }
        ],
        "name": "jailApp",
        "outputs": [
            {
                "internalType": "bytes",
                "name": "newCtx",
                "type": "bytes"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "bitmap",
                "type": "uint256"
            }
        ],
        "name": "mapAgreementClasses",
        "outputs": [
            {
                "internalType": "contract ISuperAgreement[]",
                "name": "agreementClasses",
                "type": "address[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "proxiableUUID",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "contract ISuperAgreement",
                "name": "agreementClassLogic",
                "type": "address"
            }
        ],
        "name": "registerAgreementClass",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "configWord",
                "type": "uint256"
            }
        ],
        "name": "registerApp",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "contract ISuperApp",
                "name": "app",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "configWord",
                "type": "uint256"
            }
        ],
        "name": "registerAppByFactory",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "configWord",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "registrationKey",
                "type": "string"
            }
        ],
        "name": "registerAppWithKey",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "bitmap",
                "type": "uint256"
            },
            {
                "internalType": "bytes32",
                "name": "agreementType",
                "type": "bytes32"
            }
        ],
        "name": "removeFromAgreementClassesBitmap",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "newBitmap",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "contract ISuperfluidGovernance",
                "name": "newGov",
                "type": "address"
            }
        ],
        "name": "replaceGovernance",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "contract ISuperAgreement",
                "name": "agreementClassLogic",
                "type": "address"
            }
        ],
        "name": "updateAgreementClass",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newAddress",
                "type": "address"
            }
        ],
        "name": "updateCode",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "contract ISuperTokenFactory",
                "name": "newFactory",
                "type": "address"
            }
        ],
        "name": "updateSuperTokenFactory",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "contract ISuperToken",
                "name": "token",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "newLogicOverride",
                "type": "address"
            }
        ],
        "name": "updateSuperTokenLogic",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "versionRecipient",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
    }
]
};

const sTokenJSON = {
  "abi": [
    {
      "inputs": [
        {
          "internalType": "contract ISuperfluid",
          "name": "host",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "agreementClass",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bytes",
          "name": "state",
          "type": "bytes"
        }
      ],
      "name": "AgreementAccountStateUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "agreementClass",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "id",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "bytes32[]",
          "name": "data",
          "type": "bytes32[]"
        }
      ],
      "name": "AgreementCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "agreementClass",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "id",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "penaltyAccount",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "rewardAccount",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "rewardAmount",
          "type": "uint256"
        }
      ],
      "name": "AgreementLiquidated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "liquidatorAccount",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "agreementClass",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "id",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "penaltyAccount",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "bondAccount",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "rewardAmount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "bailoutAmount",
          "type": "uint256"
        }
      ],
      "name": "AgreementLiquidatedBy",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "agreementClass",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "slotId",
          "type": "uint256"
        }
      ],
      "name": "AgreementStateUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "agreementClass",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "id",
          "type": "bytes32"
        }
      ],
      "name": "AgreementTerminated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "agreementClass",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "id",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "bytes32[]",
          "name": "data",
          "type": "bytes32[]"
        }
      ],
      "name": "AgreementUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "tokenHolder",
          "type": "address"
        }
      ],
      "name": "AuthorizedOperator",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "bailoutAccount",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "bailoutAmount",
          "type": "uint256"
        }
      ],
      "name": "Bailout",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        },
        {
          "indexed": false,
          "internalType": "bytes",
          "name": "operatorData",
          "type": "bytes"
        }
      ],
      "name": "Burned",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "uuid",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "codeAddress",
          "type": "address"
        }
      ],
      "name": "CodeUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        },
        {
          "indexed": false,
          "internalType": "bytes",
          "name": "operatorData",
          "type": "bytes"
        }
      ],
      "name": "Minted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "tokenHolder",
          "type": "address"
        }
      ],
      "name": "RevokedOperator",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        },
        {
          "indexed": false,
          "internalType": "bytes",
          "name": "operatorData",
          "type": "bytes"
        }
      ],
      "name": "Sent",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "TokenDowngraded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "TokenUpgraded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        }
      ],
      "name": "allowance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        }
      ],
      "name": "authorizeOperator",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "balance",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "burn",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "id",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32[]",
          "name": "data",
          "type": "bytes32[]"
        }
      ],
      "name": "createAgreement",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "subtractedValue",
          "type": "uint256"
        }
      ],
      "name": "decreaseAllowance",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "defaultOperators",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "downgrade",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "getAccountActiveAgreements",
      "outputs": [
        {
          "internalType": "contract ISuperAgreement[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "agreementClass",
          "type": "address"
        },
        {
          "internalType": "bytes32",
          "name": "id",
          "type": "bytes32"
        },
        {
          "internalType": "uint256",
          "name": "dataLength",
          "type": "uint256"
        }
      ],
      "name": "getAgreementData",
      "outputs": [
        {
          "internalType": "bytes32[]",
          "name": "data",
          "type": "bytes32[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "agreementClass",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "slotId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "dataLength",
          "type": "uint256"
        }
      ],
      "name": "getAgreementStateSlot",
      "outputs": [
        {
          "internalType": "bytes32[]",
          "name": "slotData",
          "type": "bytes32[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getCodeAddress",
      "outputs": [
        {
          "internalType": "address",
          "name": "codeAddress",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getHost",
      "outputs": [
        {
          "internalType": "address",
          "name": "host",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getUnderlyingToken",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "granularity",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "addedValue",
          "type": "uint256"
        }
      ],
      "name": "increaseAllowance",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "contract IERC20",
          "name": "underlyingToken",
          "type": "address"
        },
        {
          "internalType": "uint8",
          "name": "underlyingDecimals",
          "type": "uint8"
        },
        {
          "internalType": "string",
          "name": "n",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "s",
          "type": "string"
        }
      ],
      "name": "initialize",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "isAccountCritical",
      "outputs": [
        {
          "internalType": "bool",
          "name": "isCritical",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "isAccountCriticalNow",
      "outputs": [
        {
          "internalType": "bool",
          "name": "isCritical",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "isAccountSolvent",
      "outputs": [
        {
          "internalType": "bool",
          "name": "isSolvent",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "isAccountSolventNow",
      "outputs": [
        {
          "internalType": "bool",
          "name": "isSolvent",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "tokenHolder",
          "type": "address"
        }
      ],
      "name": "isOperatorFor",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "id",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "liquidator",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "penaltyAccount",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "rewardAmount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "bailoutAmount",
          "type": "uint256"
        }
      ],
      "name": "makeLiquidationPayouts",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "operationApprove",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "operationDowngrade",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "operationTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "operationUpgrade",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        },
        {
          "internalType": "bytes",
          "name": "operatorData",
          "type": "bytes"
        }
      ],
      "name": "operatorBurn",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        },
        {
          "internalType": "bytes",
          "name": "operatorData",
          "type": "bytes"
        }
      ],
      "name": "operatorSend",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "proxiableUUID",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "realtimeBalanceOf",
      "outputs": [
        {
          "internalType": "int256",
          "name": "availableBalance",
          "type": "int256"
        },
        {
          "internalType": "uint256",
          "name": "deposit",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "owedDeposit",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "realtimeBalanceOfNow",
      "outputs": [
        {
          "internalType": "int256",
          "name": "availableBalance",
          "type": "int256"
        },
        {
          "internalType": "uint256",
          "name": "deposit",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "owedDeposit",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        }
      ],
      "name": "revokeOperator",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "userData",
          "type": "bytes"
        }
      ],
      "name": "selfBurn",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "userData",
          "type": "bytes"
        }
      ],
      "name": "selfMint",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "send",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "internalType": "int256",
          "name": "delta",
          "type": "int256"
        }
      ],
      "name": "settleBalance",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "id",
          "type": "bytes32"
        },
        {
          "internalType": "uint256",
          "name": "dataLength",
          "type": "uint256"
        }
      ],
      "name": "terminateAgreement",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        }
      ],
      "name": "transferAll",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "holder",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "id",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32[]",
          "name": "data",
          "type": "bytes32[]"
        }
      ],
      "name": "updateAgreementData",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "slotId",
          "type": "uint256"
        },
        {
          "internalType": "bytes32[]",
          "name": "slotData",
          "type": "bytes32[]"
        }
      ],
      "name": "updateAgreementStateSlot",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newAddress",
          "type": "address"
        }
      ],
      "name": "updateCode",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "upgrade",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "upgradeTo",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
};

