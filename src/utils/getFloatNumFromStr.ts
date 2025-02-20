export const getFloatNumFromStr = (value: string) => {
  const firstIndexOfDot = value.indexOf('.');
  let cleanValue = value.replace(/[^0-9]/g, '');
  if(firstIndexOfDot > 0) {
    cleanValue = `${cleanValue.slice(0, firstIndexOfDot)}.${cleanValue.slice(firstIndexOfDot)}`;
    if(firstIndexOfDot === value.length - 4) {
      cleanValue = cleanValue.slice(0, value.length - 1);
    }
  }
  return cleanValue;
};