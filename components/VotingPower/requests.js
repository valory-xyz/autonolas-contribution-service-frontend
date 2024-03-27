import { getDelegateContributeContract, getVeolasContract } from 'common-util/Contracts';

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
export const delegate = async ({ account, delegatee }) => {
  const contract = getDelegateContributeContract();
  const result = await contract.methods.delegate(delegatee).send({ from: account });
  return result;
};

export const fetchVeolasBalance = async ({ account }) => {
  const contract = getVeolasContract();
  const balance = await contract.methods.getVotes(account).call();
  return balance;
};
