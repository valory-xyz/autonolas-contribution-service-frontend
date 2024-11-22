import { waitForTransactionReceipt } from '@wagmi/core';
import { base } from 'wagmi/chains';

import { getContributeManagerContract, getServiceRegistryL2Contract } from 'common-util/Contracts';
import { wagmiConfig } from 'common-util/Login/config';
import { getEstimatedGasLimit } from 'common-util/functions/requests';

export const unstake = async ({ account }) => {
  try {
    const contract = getContributeManagerContract();
    const unstakeFn = contract.methods.unstake();
    const estimatedGas = await getEstimatedGasLimit(unstakeFn, account);
    const result = await unstakeFn.send({ from: account, gas: estimatedGas });
    const receipt = await waitForTransactionReceipt(wagmiConfig, {
      chainId: base.id,
      hash: result.transactionHash,
    });
    return receipt;
  } catch (error) {
    console.error('Error unstaking:', error);
    throw error;
  }
};

export const stake = async ({ account, socialId, serviceId, stakingInstance }) => {
  try {
    const contract = getContributeManagerContract();
    const stakeFn = contract.methods.stake(socialId, serviceId, stakingInstance);
    const estimatedGas = await getEstimatedGasLimit(stakeFn, account);
    const result = await stakeFn.send({ from: account, gas: estimatedGas });
    const receipt = await waitForTransactionReceipt(wagmiConfig, {
      chainId: base.id,
      hash: result.transactionHash,
    });
    return receipt;
  } catch (error) {
    console.error('Error staking:', error);
    throw error;
  }
};

export const approveServiceTransfer = async ({ account, serviceId, contractAddress }) => {
  try {
    const contract = getServiceRegistryL2Contract();
    const approveFn = contract.methods.approve(contractAddress, serviceId);
    const estimatedGas = await getEstimatedGasLimit(approveFn, account);
    const result = await approveFn.send({ from: account, gas: estimatedGas });
    const receipt = await waitForTransactionReceipt(wagmiConfig, {
      chainId: base.id,
      hash: result.transactionHash,
    });
    return receipt;
  } catch (error) {
    console.error('Error staking:', error);
    throw error;
  }
};
