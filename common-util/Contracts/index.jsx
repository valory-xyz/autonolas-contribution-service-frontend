import Web3 from 'web3';
import {
  MINT_NFT_CONTRACT_ADDRESS_GOERLI,
  MINT_NFT_CONTRACT_ABI_GOERLI,
  MINT_NFT_CONTRACT_ADDRESS_MAINNET,
  MINT_NFT_CONTRACT_ABI_MAINNET,
} from 'common-util/AbiAndAddresses';

const getWeb3Details = () => {
  /**
   * provider = wallect-connect provider or currentProvider by metamask
   */
  const web3 = new Web3(window.WEB3_PROVIDER || window.web3.currentProvider);
  const chainId = Number(window.ethereum.chainId);

  return { web3, chainId };
};

export const getMintContract = () => {
  const { web3, chainId } = getWeb3Details();
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
