export enum GLOBAL_MESSAGE_TYPE {
  ERROR = 'error',
  SUCCESS = ' success',
}

export type GlobalMessage = {
  message: string;
  type: GLOBAL_MESSAGE_TYPE;
};

export type DateRange = {
  startDate?: string;
  endDate?: string;
};

export type ButtonInfo = {
  onClick: () => void;
  label: string;
  disabled?: boolean;
};

export type SuccessApiResponse = {
  error?: string;
  data?: any;
};

export type Stat = {
  total: number;
  week?: number;
};

export type FetchMonthlyStatsParams = {
  years: Array<number>;
};

export type GraphStat = {
  label: string;
  data: Array<number>;
};

export type CreateClockInOutParams = {
  dateTime?: string;
  useCurrentTime: boolean;
  reason?: string;
};

export type EditTimeCardParams = {
  id: number;
  clockInTime: string;
  clockOutTime: string;
  clockInReason?: string;
  clockOutReason?: string;
};

export type StyleProps = {
  isActive: boolean;
};
