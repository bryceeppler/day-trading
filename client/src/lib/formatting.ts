export const numbersOnly = (value?: string): string => {
  if (!value) return '';
  return value.replace(/[^0-9]/g, '');
};

export const formatPhone = (phoneNumber?: string) => {
  if (!phoneNumber) return '';
  const number = numbersOnly(phoneNumber);
  let value = '';
  if (number.length <= 3) return phoneNumber;
  if (number.length > 3) value += '(' + number.substring(0, 3) + ') ' + number.substring(3, 6);
  if (number.length > 6) value += '-' + number.substring(6, 10);
  return value.trim();
};

export const cleanPhone = (phoneNumber?: string) => {
  if (!phoneNumber) return '';
  return phoneNumber.replace(/\D/g, '');
};

export const formatPrice = (price?: number, includeDollarSign?: boolean) => {
  if (price === 0) return includeDollarSign ? '$0.00' : '0.00';
  if (!price) return '';
  if (isNaN(price)) return '######';

  const number = (+price).toFixed(2);

  return includeDollarSign ? `$${number}` : number;
};

export const formatNumber = (number?: number, decimals = 2) => {
  if (number === undefined) return '';
  if (decimals === 0) return Math.round(number);
  return (Math.round(number * 10 * decimals) / (10 * decimals)).toFixed(decimals);
};

export const cleanString = (value?: string) => {
  if (!value) return '';
  return value.trim();
};

export const formatPostalCode = (postalCode?: string) => {
  if (!postalCode) return '';
  let value = postalCode.replace(/ /g, '');
  value = value.substring(0, 3) + ' ' + value.substring(3, 7);
  return value.trim().toLocaleUpperCase();
};

export const cleanPostalCode = (postalCode?: string) => {
  if (!postalCode) return '';
  const temp = postalCode.replace(/ /g, '');
  return temp.substring(0, 3) + ' ' + temp.substring(3);
};

export const priceWithSpacing = (price?: number, includeDollarSign?: boolean) => {
  if (price === 0) return includeDollarSign ? '$0.00' : '0.00';
  if (!price) return '';
  const number = price.toLocaleString('en-US').replace(/,/g, ' ');
  return includeDollarSign ? `$${number}` : number;
};
