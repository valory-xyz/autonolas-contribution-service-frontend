export type StateDetails = {
  details: { profile: { username: string }; metadata: { address: string } };
  status: number;
};

export type SetupState = {
  setup: {
    account: string;
    chainId: number;
    connection: StateDetails;
  };
};
