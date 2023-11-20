import { flatMap, reverse } from 'lodash';
import { areAddressesEqual } from '@autonolas/frontend-library';

export const areBothMembersChatting = (
  loggedInAddress,
  toChatWithAddress,
  receipientDetails,
) => {
  const [memberOne, memberTwo] = receipientDetails;
  const addressOfMemberOne = memberOne.metadata.address;
  const addressOfMemberTwo = memberTwo.metadata.address;

  if (
    areAddressesEqual(loggedInAddress, addressOfMemberOne)
    && areAddressesEqual(toChatWithAddress, addressOfMemberTwo)
  ) {
    return true;
  }

  if (
    areAddressesEqual(loggedInAddress, addressOfMemberTwo)
    && areAddressesEqual(toChatWithAddress, addressOfMemberOne)
  ) {
    return true;
  }

  return false;
};

/** Calls the Orbis SDK and handle the results */
export const connectOrbis = async (orbis) => {
  const response = await orbis.connect();

  if (response.status === 200) {
    // once the user is connect, create a context
    const res = await orbis.createContext({
      project_id: process.env.NEXT_PUBLIC_ORBIS_CONTEXT_ID,
      name: 'Centaur',
      websiteUrl: 'https://centaurs-frontend.vercel.app/',
    });
    window.console.log('User connected and context created: ', res);

    return response.did;
  }

  window.console.error('Error connecting to Ceramic: ', response);
  return null;
};

// get the details of the user we want to send the message to
export const getToChatWithDid = async (orbis, toChatWith) => {
  const { data, error } = await orbis.getDids(toChatWith);

  if (error) {
    window.console.error('Error getting dids of the user: ', error);
    return null;
  }

  const receipientDid = data[0]?.did;

  if (!receipientDid) {
    window.console.error('Error getting dids of the user: ', data);
    return null;
  }

  return receipientDid;
};

export const createOrbisConversation = async (
  orbis,
  account,
  toChatWith,
  receipientDid,
) => {
  const { doc, status } = await orbis.createConversation({
    recipients: [receipientDid],
    name: 'Member Chat',
    description: `Conversation chat between ${account} and ${toChatWith}`,
    // context: contextResponse.context_id,

    // TODO: hardcoded context for now
    // hardcoded context fetched from previous response
    context: 'kjzl6cwe1jw147us13qxynuk6t5fnwjxcleponhduqx6qanc6azcr4z3xjvfybw',
  });

  if (status !== 200) {
    window.console.log('Error creating conversation');
    return null;
  }

  return doc;
};

/**
 * get messages from the conversation id
 */
export const getMessages = async (orbis, conversationId) => {
  const { data: messagesData, error: messagesError } = await orbis.getMessages(
    conversationId,
  );

  if (messagesError) {
    window.console.error('Error getting messages: ', messagesError);
    return null;
  }

  const decryptedMessages = await Promise.all(
    messagesData.map(async (message) => {
      const decryptedMessage = await orbis.decryptMessage(message.content);
      return {
        message: decryptedMessage.result,
        address: message?.creator_details?.metadata?.address,
      };
    }),
  );

  return decryptedMessages;
};

// get all the messages from the user we want to chat with
export const getAllTheMessages = async (orbis, account, toChatWith) => {
  const receipientDid = await getToChatWithDid(orbis, toChatWith);
  const { data, error } = await orbis.getConversations({
    did: receipientDid,
  });

  if (error) {
    window.console.error('Error getting conversations: ', error);
    return [];
  }

  const filteredMessages = data.filter((e) => {
    const areSame = areBothMembersChatting(
      account,
      toChatWith,
      e.recipients_details,
    );

    return areSame;
  });

  const everyDecryptedMessages = await Promise.all(
    filteredMessages.map(async (e) => {
      const decryptedMessage = await getMessages(orbis, e.stream_id);
      return decryptedMessage;
    }),
  );

  const messsageList = reverse(flatMap(everyDecryptedMessages));
  return messsageList;
};
