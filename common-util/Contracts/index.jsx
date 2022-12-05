import Web3 from 'web3';
import {
  MINT_NFT_CONTRACT_ADDRESS_GOERLI,
  MINT_NFT_CONTRACT_ABI_GOERLI,
  MINT_NFT_CONTRACT_ADDRESS_MAINNET,
  MINT_NFT_CONTRACT_ABI_MAINNET,
} from 'common-util/AbiAndAddresses';

export const getMintContract = (p, chainId) => {
  const web3 = new Web3(p);

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
