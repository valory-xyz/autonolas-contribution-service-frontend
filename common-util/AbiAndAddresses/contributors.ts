/** @deprecated */
export const CONTRIBUTORS_ADDRESS_BASE = '0x4be7A91e67be963806FeFA9C1FD6C53DfC358d94';
/** @deprecated */
export const CONTRIBUTE_MANAGER_ADDRESS_BASE = '0xaea9ef993d8a1A164397642648DF43F053d43D85';

/** @deprecated */
export const CONTRIBUTORS_ABI = [
  {
    inputs: [],
    name: 'AlreadyInitialized',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'manager',
        type: 'address',
      },
    ],
    name: 'OnlyManager',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'OwnerOnly',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'UnauthorizedAccount',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'numValues1',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'numValues2',
        type: 'uint256',
      },
    ],
    name: 'WrongArrayLength',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ZeroAddress',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'implementation',
        type: 'address',
      },
    ],
    name: 'ImplementationUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'manager',
        type: 'address',
      },
    ],
    name: 'ManagerUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'senderAgent',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address[]',
        name: 'multisigs',
        type: 'address[]',
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: 'activityChanges',
        type: 'uint256[]',
      },
    ],
    name: 'MultisigActivityChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'OwnerUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address[]',
        name: 'contributeAgents',
        type: 'address[]',
      },
      {
        indexed: false,
        internalType: 'bool[]',
        name: 'statuses',
        type: 'bool[]',
      },
    ],
    name: 'SetContributeAgentStatuses',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'serviceOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'socialId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'serviceId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'multisig',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'stakingInstance',
        type: 'address',
      },
    ],
    name: 'SetServiceInfoForId',
    type: 'event',
  },
  {
    inputs: [],
    name: 'CONTRIBUTORS_PROXY',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'VERSION',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newImplementation',
        type: 'address',
      },
    ],
    name: 'changeImplementation',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newManager',
        type: 'address',
      },
    ],
    name: 'changeManager',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'changeOwner',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'multisigs',
        type: 'address[]',
      },
      {
        internalType: 'uint256[]',
        name: 'activityChanges',
        type: 'uint256[]',
      },
    ],
    name: 'increaseActivity',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'manager',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'mapAccountServiceInfo',
    outputs: [
      {
        internalType: 'uint256',
        name: 'socialId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'serviceId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'multisig',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'stakingInstance',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'mapContributeAgents',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'mapMutisigActivities',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'contributeAgents',
        type: 'address[]',
      },
      {
        internalType: 'bool[]',
        name: 'statuses',
        type: 'bool[]',
      },
    ],
    name: 'setContributeAgentStatuses',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'serviceOwner',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'socialId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'serviceId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'multisig',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'stakingInstance',
        type: 'address',
      },
    ],
    name: 'setServiceInfoForId',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;
