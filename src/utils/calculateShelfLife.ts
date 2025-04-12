import { differenceInDays, intervalToDuration } from 'date-fns';

function formatDurationParts({ years, months, days }: { years?: number; months?: number; days?: number }) {
  const parts = [];
  if (years) parts.push(`${years} year${years > 1 ? 's' : ''}`);
  if (months) parts.push(`${months} month${months > 1 ? 's' : ''}`);
  if (days) parts.push(`${days} day${days > 1 ? 's' : ''}`);
  return parts.join(', ');
}

export function getShelfLifeInfo(mfgDate: Date, expDate: Date) {
  const today = new Date();
  const totalDays = Math.max(differenceInDays(expDate, mfgDate), 0);
  const leftDays = Math.max(differenceInDays(expDate, today), 0);

  const totalDuration = intervalToDuration({ start: mfgDate, end: expDate });
  const leftDuration = intervalToDuration({ start: today, end: expDate });

  const totalText = `${formatDurationParts(totalDuration)} (${totalDays} day${totalDays !== 1 ? 's' : ''})`;
  const leftText = `${formatDurationParts(leftDuration)} (${leftDays} day${leftDays !== 1 ? 's' : ''})`;

  const percentShelfLifeLeft = totalDays
    ? ((leftDays / totalDays) * 100).toFixed(1)
    : '0';

  return {
    totalShelfLife: totalText,
    leftShelfLife: leftText,
    percentShelfLifeLeft: `${percentShelfLifeLeft}%`,
  };
}
