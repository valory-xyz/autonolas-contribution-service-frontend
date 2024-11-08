/**
 *
 * @param ms timestamp in ms
 * @returns time in format "12 days ago" or "5 hours ago"
 */
export const getTimeAgo = (ms, showPostfix = true) => {
  const differenceInMs = Date.now() - ms;

  // Calculate time differences
  const differenceInMinutes = Math.floor(differenceInMs / (1000 * 60));
  const differenceInHours = Math.floor(differenceInMinutes / 60);
  const differenceInDays = Math.floor(differenceInHours / 24);
  const differenceInMonths = Math.floor(differenceInDays / 30); // Approximate months

  const postfix = showPostfix ? ` ago` : '';

  if (differenceInMonths > 0) {
    return `${differenceInMonths} month${differenceInMonths > 1 ? 's' : ''}${postfix}`;
  } else if (differenceInDays > 0) {
    return `${differenceInDays} day${differenceInDays > 1 ? 's' : ''}${postfix}`;
  } else if (differenceInHours > 0) {
    return `${differenceInHours} hour${differenceInHours > 1 ? 's' : ''}${postfix}`;
  } else {
    return `${differenceInMinutes} minute${differenceInMinutes > 1 ? 's' : ''}${postfix}`;
  }
};
