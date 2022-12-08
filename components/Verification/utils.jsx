export async function verifyAddress(account, id) {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/link`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        discord_id: id,
        wallet_address: account,
      }),
    });

    // no need to return the response, if resolved then verified
    return null;
  } catch (error) {
    console.error(error);
    return error;
  }
}
