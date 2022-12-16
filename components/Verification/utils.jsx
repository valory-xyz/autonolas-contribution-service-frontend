const DISCORD_VERIFICATION_ADDRESS = "0x35deF2280E22eA7724bae8e3B5Bb8b50D4e296EC"
import { ethers } from "ethers";

function payloadToText(payload) {
  const payloadString = JSON.stringify(payload);
  return payloadString;
}

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


function verifyPayload(payload, signature) {
    const messageHash = ethers.utils.hashMessage(payload);
    const recoveredAddress = ethers.utils.recoverAddress(messageHash, signature);
    return recoveredAddress === DISCORD_VERIFICATION_ADDRESS;
}



export function isRouteValid(linkExpiration, signature, discordId) {
  const isExpiration = !!linkExpiration;
  const isSignature = !!signature;
  if (!isExpiration && !isSignature && !discordId) {
    // when we have no args in the contribute flow, allow redirect to the flow
    return true;
  }
  if (isExpiration && linkExpiration < Date.now()) {
      // if the verification is included and lower than now we return not valid
      return false;
  }
  if (!isSignature) {
    // if no signature we return false
    return false;
  }
  var payload = {
      "discord-id": String(discordId),
      "link-expiration": Number(linkExpiration),
  }
  payload = payloadToText(payload);
  // our check that the address of the signer of the message matches the address we are expecting.
  return verifyPayload(payload, signature);

}