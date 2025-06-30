import { Address } from 'viem';

export type LeaderboardUser = {
  points: number;
  token_id: string | null;
  discord_id: string | null;
  service_id: string | null;
  twitter_id: string | null;
  discord_handle: string | null;
  twitter_handle: string | null;
  wallet_address: Address;
  service_multisig: string | null;
  current_period_points: number;
  rowKeyUi: string;
  rank: number;
};

export type StateDetails = {
  details: { profile: { username: string }; metadata: { address: string } };
  status: number;
};
