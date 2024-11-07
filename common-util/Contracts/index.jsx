import Web3 from 'web3';
import { mainnet, goerli, base } from 'viem/chains';
import {
  MINT_NFT_CONTRACT_ADDRESS_GOERLI,
  MINT_NFT_CONTRACT_ABI_GOERLI,
  MINT_NFT_CONTRACT_ADDRESS_MAINNET,
  MINT_NFT_CONTRACT_ABI_MAINNET,

  // veOlas
  VEOLAS_ADDRESS_GOERLI,
  VEOLAS_ADDRESS_MAINNET,

  // delegateContribute
  DELEGATE_CONTRIBUTE_ADDRESS_MAINNET,
  DELEGATE_CONTRIBUTE_ABI,

  VEOLAS_ABI,
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
  const contract = getContract(
    chainId === 5
      ? MINT_NFT_CONTRACT_ABI_GOERLI
      : MINT_NFT_CONTRACT_ABI_MAINNET,
    ADDRESSES[chainId]?.mintNft,
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

export const RPC_URLS = {
  [mainnet.id]: process.env.NEXT_PUBLIC_MAINNET_URL,
  [goerli.id]: process.env.NEXT_PUBLIC_GOERLI_URL,
  [base.id]: process.env.NEXT_PUBLIC_BASE_URL,
};
