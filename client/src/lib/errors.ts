import { ValidationError } from 'types';

type NetworkError = {
  response: {
    data: {
      message: string;
    };
  };
};

export const validationError = (id: string, description: string): ValidationError => {
  return { id, description };
};

export const getInputError = (errors: Array<ValidationError>, id: string) => {
  return errors.find((error) => error.id === id)?.description;
};

export const handleApiError = (error: unknown): string => {
	console.log()
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const networkError = error as NetworkError;
		console.log(networkError.response?.data.message)
    return networkError.response?.data?.message || 'Invalid Error';
  }
  return '';
};
