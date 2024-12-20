import { readContract, waitForTransactionReceipt, writeContract } from '@wagmi/core';
import { base } from 'wagmi/chains';

import {
  CONTRIBUTE_MANAGER_ADDRESS_BASE,
  OLAS_ABI,
  OLAS_ADDRESS_BASE,
} from 'common-util/AbiAndAddresses';
import { getContributeManagerContract } from 'common-util/Contracts';
import { wagmiConfig } from 'common-util/Login/config';
import { getEstimatedGasLimit } from 'common-util/functions/requests';

// Value in wei that should be sent with CreateAndStake transaction
// 1 wei for the service registration activation,
// and 1 wei for agent instance bond, which is always equal to 1 for now
const CREATE_AND_STAKE_VALUE = 2;

/**
 * Check if user has enough OLAS balance
 */
export const checkHasEnoughOlas = async (account, amountInWei) => {
  const result = await readContract(wagmiConfig, {
    address: OLAS_ADDRESS_BASE,
    abi: OLAS_ABI,
    chainId: base.id,
    functionName: 'balanceOf',
    args: [account],
  });

  return result ? BigInt(result) >= BigInt(amountInWei) : false;
};

/**
 * Check if the OLAS token allowance is sufficient for transfer to the Contribute Manager.
 */
const hasSufficientOlasAllowanceForManager = async ({ account, amountToApprove }) => {
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
const approveOlasForManager = async ({ amountToApprove }) => {
  try {
    const hash = await writeContract(wagmiConfig, {
      address: OLAS_ADDRESS_BASE,
      abi: OLAS_ABI,
      chainId: base.id,
      functionName: 'approve',
      args: [CONTRIBUTE_MANAGER_ADDRESS_BASE, amountToApprove],
    });
    // Wait for the transaction receipt
    const receipt = await waitForTransactionReceipt(wagmiConfig, {
      chainId: base.id,
      hash,
    });
    return receipt;
  } catch (error) {
    console.error('Error approving tokens:', error);
  }
};

/**
 * Check and approve token transfer if not yet approved
 */
export const checkAndApproveOlasForManager = async ({ account, amountToApprove }) => {
  const hasTokenBalance = await hasSufficientOlasAllowanceForManager({
    account,
    amountToApprove,
  });

  if (!hasTokenBalance) {
    const response = await approveOlasForManager({
      amountToApprove,
    });
    return response;
  }

  return null;
};

/**
 * Create, deploy and stake a service
 */
export const createAndStake = async ({ account, socialId, stakingInstance }) => {
  try {
    const contract = getContributeManagerContract();
    const createAndStakeFn = contract.methods.createAndStake(socialId, stakingInstance);
    const estimatedGas = await getEstimatedGasLimit(
      createAndStakeFn,
      account,
      CREATE_AND_STAKE_VALUE,
    );
    const result = await createAndStakeFn.send({
      from: account,
      gas: estimatedGas,
      value: CREATE_AND_STAKE_VALUE,
    });
    const receipt = await waitForTransactionReceipt(wagmiConfig, {
      chainId: base.id,
      hash: result.transactionHash,
    });
    return receipt;
  } catch (error) {
    console.error('Error creating and staking:', error);
    throw error;
  }
};
