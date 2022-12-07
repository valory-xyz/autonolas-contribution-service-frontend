export async function verifyAddress(account, id, chainId) {
  const url = chainId === 1
    ? 'https://contribution-service-backend.autonolas.tech/link'
    : 'https://contribution-service-backend.staging.autonolas.tech/link';

  try {
    const response = await fetch(url, {
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
