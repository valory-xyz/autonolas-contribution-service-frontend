import Web3 from 'web3';
import {
  MINT_NFT_CONTRACT_ADDRESS_GOERLI,
  MINT_NFT_CONTRACT_ABI_GOERLI,
  MINT_NFT_CONTRACT_ADDRESS_MAINNET,
  MINT_NFT_CONTRACT_ABI_MAINNET,

  // veOlas
  VEOLAS_ADDRESS_GOERLI,
  VEOLAS_ADDRESS_MAINNET,
  VEOLAS_ABI,

  // wveOlas
  WVEOLAS_ADDRESS_MAINNET,
  WVEOLAS_ABI_MAINNET,
} from 'common-util/AbiAndAddresses';

const getWeb3Details = () => {
  /**
   * provider = wallect-connect provider or currentProvider by metamask
   */
  const web3 = new Web3(window.WEB3_PROVIDER || window.web3.currentProvider);
  // Get chainId from window object or default to ethereum
  const chainId = Number(window?.ethereum?.chainId) || 1;

  return { web3, chainId };
};

export const getMintContract = () => {
  const { web3, chainId } = getWeb3Details();

  console.log({ chainId });
  const contract = new web3.eth.Contract(
    chainId === 5
      ? MINT_NFT_CONTRACT_ABI_GOERLI
      : MINT_NFT_CONTRACT_ABI_MAINNET,
    chainId === 5
      ? MINT_NFT_CONTRACT_ADDRESS_GOERLI
      : MINT_NFT_CONTRACT_ADDRESS_MAINNET,
  );
  return contract;
};

export const getVeolasContract = (isViewOnly) => {
  const { web3, chainId } = getWeb3Details();

  const getAddressAndAbi = () => {
    // for view methods use wveolas abi and address
    if (chainId === 1) {
      if (isViewOnly) {
        return { abi: WVEOLAS_ABI_MAINNET, address: WVEOLAS_ADDRESS_MAINNET };
      }
      return { abi: VEOLAS_ABI, address: VEOLAS_ADDRESS_MAINNET };
    }

    return { abi: VEOLAS_ABI, address: VEOLAS_ADDRESS_GOERLI };
  };

  const { address, abi } = getAddressAndAbi();
  const contract = new web3.eth.Contract(abi, address);
  return contract;
};

export const rpc = {
  1: process.env.NEXT_PUBLIC_MAINNET_URL,
  5: process.env.NEXT_PUBLIC_GOERLI_URL,
};
