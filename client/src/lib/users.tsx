enum USER_TYPE_IDS {
  UNAUTHORIZED = 0,
  SUPER_ADMIN = 1,
  ADMIN = 2,
  RECEPTIONIST = 3,
  CLEANER = 4,
}
export const USER_TYPES = {
  ADMIN: { id: USER_TYPE_IDS.ADMIN, name: 'Admin' },
  RECEPTIONIST: { id: USER_TYPE_IDS.RECEPTIONIST, name: 'Receptionist' },
  CLEANER: { id: USER_TYPE_IDS.CLEANER, name: 'Cleaner' },
};

export const UNAUTHORIZED_USER_TYPE = USER_TYPE_IDS.UNAUTHORIZED;

export const ADMIN_USER_TYPES = [USER_TYPE_IDS.SUPER_ADMIN, USER_TYPE_IDS.ADMIN];

export const ALL_STAFF_USER_TYPES = [
  USER_TYPE_IDS.SUPER_ADMIN,
  USER_TYPE_IDS.ADMIN,
  USER_TYPE_IDS.RECEPTIONIST,
  USER_TYPE_IDS.CLEANER,
];

const PASSWORD_LENGTH = 8;
export const noSpaces = (password?: string) => !!(password && !/\s/g.test(password || ''));
export const uppercaseLetters = (password?: string) => /[A-Z]/.test(password || '');
export const lowercaseLetters = (password?: string) => /[a-z]/.test(password || '');
export const numbers = (password?: string) => /[0-9]/.test(password || '');
export const specialCharacters = (password?: string) => /[^A-Za-z0-9\s]/.test(password || '');
export const totalSize = (password?: string) => !!(password && password?.length > PASSWORD_LENGTH);

export const validatePassword = (password?: string) => {
  return (
    noSpaces(password) &&
    uppercaseLetters(password) &&
    lowercaseLetters(password) &&
    numbers(password) &&
    specialCharacters(password) &&
    totalSize(password)
  );
};
