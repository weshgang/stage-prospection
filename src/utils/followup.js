export const deriveStatus = (lastSentISO, replied) => {
  if (replied) return { label: 'Replied', color: 'green' };
  const last = new Date(lastSentISO);
  const now = new Date();
  const days = (now - last) / (1000 * 60 * 60 * 24);
  return days >= 7
    ? { label: 'Follow-Up Needed', color: 'red' }
    : { label: 'Waiting', color: 'gray' };
};
