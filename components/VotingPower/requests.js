import { getDelegateContributeContract } from 'common-util/Contracts';

/**
 * delegatorList - those who delegated veOlas to the provided account
 */
export const fetchDelegatorList = async ({ account }) => {
  const contract = getDelegateContributeContract();
  const delegatorList = await contract.methods.getDelegatorList(account).call();
  return delegatorList;
};

/**
 * delegatee - who you delegated to
 */
export const fetchDelegatee = async ({ account }) => {
  const contract = getDelegateContributeContract();
  const delegatee = await contract.methods.mapDelegation(account).call();
  return delegatee;
};

/**
 * delegates Contribute voting power to an address.
 */
export const delegate = async ({ delegatee }) => {
  const contract = getDelegateContributeContract();
  const result = await contract.methods.delegate(delegatee).call();
  return result;
};
