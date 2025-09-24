export const phoneMask = (phone: string) => {
  // Apply Brazilian phone mask
  let value = phone.replace(/\D/g, "");

  if (value.length <= 2) {
    value = `(${value}`;
  } else if (value.length <= 6) {
    value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
  } else if (value.length <= 10) {
    value = `(${value.substring(0, 2)}) ${value.substring(
      2,
      6
    )}-${value.substring(6)}`;
  } else {
    value = `(${value.substring(0, 2)}) ${value.substring(
      2,
      7
    )}-${value.substring(7, 11)}`;
  }

  return value;
};
