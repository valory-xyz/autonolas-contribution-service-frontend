import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setChainId } from 'store/setup';

import { getChainId } from '../functions';

type RootState = {
  setup: {
    account: string | null;
    chainId: number;
  };
};

export const useHelpers = () => {
  const dispatch = useDispatch();
  const account = useSelector((state: RootState) => state?.setup?.account);
  const chainId = useSelector((state: RootState) => state?.setup?.chainId);
  const isStaging = process.env.NEXT_PUBLIC_PFP_URL?.includes('staging');

  /**
   * Set chainId to redux on page load.
   * This should be single source of truth for chainId
   */
  const currentChainId = getChainId();
  useEffect(() => {
    if (currentChainId !== chainId) {
      dispatch(setChainId(currentChainId));
    }
  }, [currentChainId, chainId, dispatch]);

  return {
    chainId,
    account,
    isStaging,
  };
};
