export enum GENDER {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
  UNKNOWN = 'UNKNOWN',
}

export enum BANK_STATUS {
  UNKNOWN = 'UNKNOWN',
  UNBANKED = 'UNBANKED',
  BANKED = 'BANKED',
  UNDERBANKED = 'UNDERBANKED',
}

export enum PHONE_OWNERSHIP {
  UNKNOWN = 'UNKNOWN',
  NO_PHONE = 'NO_PHONE',
  FEATURE = 'FEATURE',
  SMART = 'SMART',
}

export enum INTERNET_ACCESS {
  UNKNOWN = 'UNKNOWN',
  NO_INTERNET = 'NO_INTERNET',
  PHONE_INTERNET = 'PHONE_INTERNET',
  HOME_INTERNET = 'HOME_INTERNET',
}

export type IBeneficiaryApiFilters = {
  status?: string;
  name?: string;
  gender?: GENDER;
  internetAccess?: INTERNET_ACCESS | string;
  bankStatus?: BANK_STATUS | string;
  phoneOwnership?: PHONE_OWNERSHIP | string;
  orderBy?: string;
  order?: 'asc' | 'desc';
  perPage?: number;
  page?: number;
};

export type IBeneficiariesTableFilterValue = string | string[];

export type IBeneficiaryPagination = {
  currentPage?: number;
  total?: number;
  perPage: number;
  lastPage?: number;
};

export type IBeneficiariesItem = {
  bankStatus: BANK_STATUS;
  createdAt: string;
  deletedAt: string | null;
  internetAccess: INTERNET_ACCESS;
  isApproved: boolean;
  latitude: number;
  longitude: number;
  name: string;
  phone?: string | null;
  phoneOwnership: PHONE_OWNERSHIP;
  tokensAssigned: number;
  tokensClaimed: number;
  updatedAt: string;
  uuid: string;
  walletAddress: string;
};

export type IBeneficiariesList = {
  meta: IBeneficiaryPagination;
  rows: IBeneficiariesItem[];
};

/**
 * hooks returns
 */

export interface BeneficiariesListHookReturn {
  beneficiaries: IBeneficiariesList['rows'];
  loading: boolean;
  error: any;
  meta: IBeneficiariesList['meta'];
}
export interface BeneficiariesDetailsHookReturn {
  beneficiary: IBeneficiaryDetails;
  isLoading: boolean;
  error: IApiResponseError;
}

export type IFilterOptions = string[];

export type IBeneficiaryDetails = {
  address: {
    location: string;
  };
  bankStatus: string;
  createdAt: string;
  deletedAt: string | null;
  dob: string | null;
  email: string | null;
  gender: string;
  id: number;
  internetAccess: string;
  isApproved: boolean;
  latitude: number;
  longitude: number;
  name: string;
  phone: string | null;
  phoneOwnership: string;
  tokensAssigned: number;
  tokensClaimed: number;
  updatedAt: string;
  uuid: string;
  walletAddress: string;
  _count: {
    projects: number;
  };
};

export type IBeneficiaryClaimsDetails = {
  receivedDate: string;
  claimedDate: string;
  claimedAmount: number;
  receivedAmount: number;
  walletAddress: string;
  uuid: string;
};

export type IBeneficiaryDetailsTableItem = {
  timestamp: string;
  hash: string;
  event: string;
  amount: number;
};

export type IBeneficiaryDetailsTableList = IBeneficiaryDetailsTableItem[];

export type IBeneficiariesCreateItem = {
  name: string;
  phone: string | null;
  gender: GENDER | null;
  phoneOwnership: PHONE_OWNERSHIP | null;
  bankStatus: BANK_STATUS | null;
  internetAccess: INTERNET_ACCESS | null;
  dob: Date | null;
  walletAddress: string;
  longitude: number | null;
  latitude: number | null;
};

export type IApiResponseError = {
  group: string;
  meta?: Record<string, string[]> | null;
  message: string;
  name: string;
  success: boolean;
  timestamp: number;
};

export type IAssignProjectItem = {
  projectId: number | null;
};

export type IAssignProjectDetails = {};
