export const getFloatNumFromStr = (value: string) => {
  console.log(value);
  const cleanedValue = value.replace(/[^0-9]/g, "");
  console.log(cleanedValue)
  const floatValue = parseFloat(cleanedValue);
  
  return isNaN(floatValue) ? 0 : floatValue;
}