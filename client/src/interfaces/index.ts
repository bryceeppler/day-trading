export interface ClientTableData {
  id: number;
  name: string;
  overdue: boolean;
}

export interface AddressTableData {
  id: number;
  address: string;
  client: string;
}

export interface ClientHeadCell {
  id: keyof ClientTableData;
  label: string;
}

export interface AddressHeadCell {
  id: keyof AddressTableData;
  label: string;
}

export interface AddressSummerizedHeadCell {
  id: keyof AddressTableData;
  label: string;
}
