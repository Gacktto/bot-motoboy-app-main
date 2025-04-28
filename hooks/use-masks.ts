export const useMasks = () => {
  const formatPhoneNumber = (value: string) => {
    let phone = value.replace(/\D/g, "");

    if (phone.length <= 11) {
      // Format as (XX) XXXXX-XXXX
      if (phone.length > 2) {
        phone = `(${phone.substring(0, 2)}) ${phone.substring(2)}`;
      }
      if (phone.length > 10) {
        phone = `${phone.substring(0, 10)}-${phone.substring(10)}`;
      }

      return phone;
    }

    return value;
  };
  return { formatPhoneNumber };
};
