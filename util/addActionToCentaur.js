import { updateMemoryDetails } from 'common-util/api';

export const addActionToCentaur = async (centaurId, action, centaurList) => {
  if (!action.actorAddress || !action.description || !action.timestamp) {
    throw new Error('Missing required action fields');
  }

  const centaur = centaurList.find((c) => c.id === centaurId) || {};

  const updatedActions = [...(centaur.actions || []), action];
  const updatedCentaur = {
    ...centaur,
    actions: updatedActions,
  };

  const updatedMemoryDetails = centaurList.map((c) => {
    if (c.id === centaurId) {
      return updatedCentaur;
    }
    return c;
  });

  // Update the Ceramic stream with the new data
  await updateMemoryDetails(updatedMemoryDetails);
};
