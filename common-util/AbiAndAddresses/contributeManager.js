export const CONTRIBUTE_MANAGER_ADDRESS_BASE = '0xaea9ef993d8a1A164397642648DF43F053d43D85';

export const CONTRIBUTE_MANAGER_ABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_contributorsProxy',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_serviceManager',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_olas',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_stakingFactory',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_safeMultisig',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_fallbackHandler',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_agentId',
        type: 'uint256',
      },
      {
        internalType: 'bytes32',
        name: '_configHash',
        type: 'bytes32',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
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
    ],
    name: 'ServiceAlreadyStaked',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'socialId',
        type: 'uint256',
      },
    ],
    name: 'ServiceNotDefined',
    type: 'error',
  },
  {
    inputs: [
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
    ],
    name: 'WrongServiceSetup',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'stakingInstance',
        type: 'address',
      },
    ],
    name: 'WrongStakingInstance',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ZeroAddress',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ZeroValue',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'socialId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'serviceOwner',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'serviceId',
        type: 'uint256',
      },
      {
        indexed: true,
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
    name: 'Claimed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'socialId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'serviceOwner',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'serviceId',
        type: 'uint256',
      },
      {
        indexed: true,
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
    name: 'CreatedAndStaked',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'socialId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'serviceOwner',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'serviceId',
        type: 'uint256',
      },
      {
        indexed: true,
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
    name: 'Staked',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'socialId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'serviceOwner',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'serviceId',
        type: 'uint256',
      },
      {
        indexed: true,
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
    name: 'Unstaked',
    type: 'event',
  },
  {
    inputs: [],
    name: 'NUM_AGENT_INSTANCES',
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
    name: 'THRESHOLD',
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
    name: 'agentId',
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
    name: 'claim',
    outputs: [
      {
        internalType: 'uint256',
        name: 'reward',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'configHash',
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
    name: 'contributorsProxy',
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
        internalType: 'uint256',
        name: 'socialId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'stakingInstance',
        type: 'address',
      },
    ],
    name: 'createAndStake',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'fallbackHandler',
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
    inputs: [],
    name: 'olas',
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
    inputs: [],
    name: 'safeMultisig',
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
    inputs: [],
    name: 'serviceManager',
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
    inputs: [],
    name: 'serviceRegistry',
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
    inputs: [],
    name: 'serviceRegistryTokenUtility',
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
        name: 'stakingInstance',
        type: 'address',
      },
    ],
    name: 'stake',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'stakingFactory',
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
    inputs: [],
    name: 'unstake',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
