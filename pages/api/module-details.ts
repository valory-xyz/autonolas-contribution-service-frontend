import type { NextApiRequest, NextApiResponse } from 'next';

import { ContributeModuleDetails } from 'types/moduleDetails';

// TODO: Update this once we point to prod.
const AGENT_TYPE = 1;
const ATTRIBUTE_TYPE_ID = 4;

export const MODULE_DETAILS_API_BASE_URL = `${process.env.NEXT_PUBLIC_AFMDB_URL}/api/agent-types/${AGENT_TYPE}/attributes/${ATTRIBUTE_TYPE_ID}/values`;

const ERROR_MESSAGE = 'Failed to fetch module details.';

/**
 * Prevent nextjs from caching the route which is the default behaviour.
 */
export const revalidate = 0;

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch(MODULE_DETAILS_API_BASE_URL);

    if (!response.ok) {
      return res.status(response.status).json({ error: ERROR_MESSAGE });
    }

    const data: ContributeModuleDetails = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: ERROR_MESSAGE, details: error });
  }
}
