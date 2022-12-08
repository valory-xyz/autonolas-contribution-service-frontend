export async function verifyAddress(account, id) {
  try {
    const response = await fetch(`${process.env.NODE_ENV}/link`, {
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
