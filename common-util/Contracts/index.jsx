import { base, goerli, mainnet } from 'viem/chains';
import Web3 from 'web3';

import {
  CONTRIBUTE_MANAGER_ABI, // Contribute manager
  CONTRIBUTE_MANAGER_ADDRESS_BASE,
  DELEGATE_CONTRIBUTE_ABI, // delegateContribute
  DELEGATE_CONTRIBUTE_ADDRESS_MAINNET,
  MINT_NFT_CONTRACT_ABI_GOERLI,
  MINT_NFT_CONTRACT_ABI_MAINNET,
  MINT_NFT_CONTRACT_ADDRESS_GOERLI,
  MINT_NFT_CONTRACT_ADDRESS_MAINNET,
  SERVICE_REGISTRY_ABI,
  SERVICE_REGISTRY_ADDRESS_BASE,
  VEOLAS_ABI, // veOlas
  VEOLAS_ADDRESS_GOERLI,
  VEOLAS_ADDRESS_MAINNET,
} from 'common-util/AbiAndAddresses';
import { getChainId, getProvider } from 'common-util/functions';

const ADDRESSES = {
  1: {
    mintNft: MINT_NFT_CONTRACT_ADDRESS_MAINNET,
    veOlas: VEOLAS_ADDRESS_MAINNET,
  },
  5: {
    mintNft: MINT_NFT_CONTRACT_ADDRESS_GOERLI,
    veOlas: VEOLAS_ADDRESS_GOERLI,
  },
};

const getWeb3Details = () => {
  const web3 = new Web3(getProvider());
  const chainId = getChainId();
  const address = ADDRESSES[chainId];

  return { web3, address, chainId };
};

/**
 * returns the contract instance
 * @param {Array} abi - abi of the contract
 * @param {String} contractAddress - address of the contract
 */
const getContract = (abi, contractAddress) => {
  const { web3 } = getWeb3Details();
  const contract = new web3.eth.Contract(abi, contractAddress);
  return contract;
};

export const getMintContract = () => {
  const { chainId } = getWeb3Details();
  if (!ADDRESSES[chainId]) {
    return null;
  }

  const contract = getContract(
    chainId === 5 ? MINT_NFT_CONTRACT_ABI_GOERLI : MINT_NFT_CONTRACT_ABI_MAINNET,
    ADDRESSES[chainId].mintNft,
  );

  return contract;
};

export const getVeolasContract = () => {
  const contract = getContract(VEOLAS_ABI, VEOLAS_ADDRESS_MAINNET);
  return contract;
};

export const getDelegateContributeContract = () => {
  const contract = getContract(DELEGATE_CONTRIBUTE_ABI, DELEGATE_CONTRIBUTE_ADDRESS_MAINNET);
  return contract;
};

export const getContributeManagerContract = () => {
  const contract = getContract(CONTRIBUTE_MANAGER_ABI, CONTRIBUTE_MANAGER_ADDRESS_BASE);
  return contract;
};

export const getServiceRegistryL2Contract = () => {
  const contract = getContract(SERVICE_REGISTRY_ABI, SERVICE_REGISTRY_ADDRESS_BASE);
  return contract;
};

export const RPC_URLS = {
  [mainnet.id]: process.env.NEXT_PUBLIC_MAINNET_URL,
  [goerli.id]: process.env.NEXT_PUBLIC_GOERLI_URL,
  [base.id]: process.env.NEXT_PUBLIC_BASE_URL,
};
