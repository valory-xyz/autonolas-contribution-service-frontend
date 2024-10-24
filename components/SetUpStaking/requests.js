
import { useReadContract } from 'wagmi';
import { base } from 'wagmi/chains';
import { readContract, writeContract, waitForTransactionReceipt } from '@wagmi/core';
import {
  CONTRIBUTE_MANAGER_ADDRESS_BASE,
  CONTRIBUTE_STAKING_INSTANCE_ADDRESS_BASE,
  STAKING_TOKEN_ABI,
  OLAS_ADDRESS_BASE,
  OLAS_ABI,
  CONTRIBUTE_MANAGER_ABI
} from 'common-util/AbiAndAddresses';
import { wagmiConfig } from 'common-util/Login/config';

export const useTotalBond = () => {
  const { data, isLoading } = useReadContract({
    address: CONTRIBUTE_STAKING_INSTANCE_ADDRESS_BASE,
    abi: STAKING_TOKEN_ABI,
    chainId: base.id,
    functionName: 'minStakingDeposit',
  });

  // Calculate the total bond required for the service deployment
  // by the formula: (1 + NUM_AGENT_INSTANCES) * minStakingDeposit
  // where NUM_AGENT_INSTANCES always equals to 1 for this contract
  const totalBond = data ? 2n * data : null

  return { totalBond, isLoading };
};

/**
 * Check if the OLAS token allowance is sufficient for transfer to the Contribute Manager.
 */
const hasSufficientTokenRequest = async ({ account, amountToApprove }) => {
  try {
    const allowance = await readContract(wagmiConfig, {
      address: OLAS_ADDRESS_BASE,
      abi: OLAS_ABI,
      chainId: base.id,
      functionName: 'allowance',
      args: [account, CONTRIBUTE_MANAGER_ADDRESS_BASE],
    });
    return allowance >= amountToApprove;
  } catch (error) {
    console.error('Error checking allowance:', error);
    return null;
  }
};

/**
 * Approve Olas transfer to the Contribute Manager
 */
const approveToken = async ({ amountToApprove }) => {
  try {
    const hash = await writeContract(wagmiConfig, {
      address: OLAS_ADDRESS_BASE,
      abi: OLAS_ABI,
      chainId: base.id,
      functionName: 'approve',
      args: [CONTRIBUTE_MANAGER_ADDRESS_BASE, amountToApprove],
    });
    // Wait for the transaction receipt
    const receipt = await waitForTransactionReceipt(wagmiConfig, { chainId: base.id, hash });
    return receipt;
  } catch (error) {
    console.error('Error approving tokens:', error);
  }
};

/**
 * Check and approve token transfer if not yet approved
 */
export const checkAndApproveToken = async ({ account, amountToApprove }) => {
  const hasTokenBalance = await hasSufficientTokenRequest({
    account,
    amountToApprove,
  });

  if (!hasTokenBalance) {
    const response = await approveToken({
      amountToApprove,
    });
    return response;
  }

  return null;
};

/**
 * Create, deploy and stake a service
 */
export const createAndStake = async ({ socialId }) => {
  try {
    const hash = await writeContract(wagmiConfig, {
      address: CONTRIBUTE_MANAGER_ADDRESS_BASE,
      abi: CONTRIBUTE_MANAGER_ABI,
      chainId: base.id,
      functionName: 'createAndStake',
      args: [socialId, CONTRIBUTE_STAKING_INSTANCE_ADDRESS_BASE],
      value: 2
    });
    // Wait for the transaction receipt
    const receipt = await waitForTransactionReceipt(wagmiConfig, { chainId: base.id, hash });
    return receipt;
  } catch (error) {
    console.error('Error creating and staking:', error);
  }
};