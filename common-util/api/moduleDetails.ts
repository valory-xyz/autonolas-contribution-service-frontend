import { ContributeModuleDetails } from 'types/moduleDetails';

export const getModuleDetails = async () => {
  const response = await fetch('/api/module-details', {
    headers: {
      /* Prevent caching on the server / by browsers.
       * Required in order to update the UI with the latest posts on user's action.
       */
      'Cache-Control': 'max-age=0, no-cache',
    },
  });
  const json: ContributeModuleDetails[] = await response.json();
  // The array contains only one element
  // TODO: consider convenient return right in the api endpoint
  const moduleDetails: ContributeModuleDetails['json_value'] = json?.[0]?.json_value;
  const attributeId = json?.[0]?.attribute_id;

  return { moduleDetails, attributeId };
};
