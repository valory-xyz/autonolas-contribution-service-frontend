export type Tweet = {
  epoch: number;
  points: number;
  campaign: string;
  timestamp: string;
};

export type XProfile = {
  points: number;
  tweets: Record<string, Tweet>;
  token_id: string | null;
  discord_id: string | null;
  service_id: string | null;
  service_id_old: string | null; // old broken service id
  twitter_id: string | null;
  discord_handle: string | null;
  twitter_handle: string | null;
  wallet_address: string | null;
  service_multisig: string | null;
  service_multisig_old: string | null; // old broken multisig id
  current_period_points: number;
};
