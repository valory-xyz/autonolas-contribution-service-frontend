import data from 'common-util/Education/data.json';

export const getEducationItemByComponent = (component) => {
  const items = data.filter((item) => component === item.component);
  return items[0];
};
