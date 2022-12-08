import { getUrl } from 'common-util/functions';

export async function verifyAddress(account, id, chainId) {
  try {
    const response = await fetch(`${getUrl(chainId)}/link`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        discord_id: id,
        wallet_address: account,
      }),
    });

    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
    return error;
  }
}
