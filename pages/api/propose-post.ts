import { Wallet } from 'ethers';
import type { NextApiRequest, NextApiResponse } from 'next';

import { getNowTimestamp } from 'common-util/functions/time';
import type { ContributeModuleDetails } from 'types/moduleDetails';

// TODO: Update this once we point to prod.
const AGENT_TYPE = 1;
const ATTRIBUTE_TYPE_ID = 4;

const ENDPOINT_URL = '/api/agent-attributes';
const BASE_URL = `${process.env.NEXT_PUBLIC_AFMDB_URL}${ENDPOINT_URL}`;
const ERROR_MESSAGE = 'Failed to post tweet';

const agentAttr = {
  agent_id: AGENT_TYPE,
  attr_def_id: ATTRIBUTE_TYPE_ID,
  integer_value: null,
  float_value: null,
  string_value: null,
  boolean_value: true,
  date_value: null,
  last_updated: new Date().toISOString(),
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'PUT') {
      res.status(405).end();
      return;
    }

    const { moduleDetails, attributeId } = req.body;

    const privateKey = process.env.AGENT_DB_WALLET_PRIVATE_KEY;
    if (!privateKey) throw new Error('Missing AGENT_DB_WALLET_PRIVATE_KEY');

    const wallet = new Wallet(privateKey);
    const message = `timestamp:${getNowTimestamp()},endpoint:${ENDPOINT_URL}/${attributeId}`;
    const signature = await wallet.signMessage(message);

    const response = await fetch(`${BASE_URL}/${attributeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agent_attr: {
          ...agentAttr,
          json_value: moduleDetails,
        },
        auth: {
          agent_id: AGENT_TYPE,
          signature,
          message,
        },
      }),
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: ERROR_MESSAGE });
    }

    const json: ContributeModuleDetails = await response.json();
    res.status(200).json(json);
  } catch (error) {
    res.status(500).json({ error: ERROR_MESSAGE });
  }
}
