export type IApiResponseError = {
  group: string;
  meta?: Record<string, string[]> | null;
  message: string;
  name: string;
  success: boolean;
  timestamp: number;
};

export type ICampaignFilterOptions = string[];

export enum CAMPAIGN_TYPES {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PHONE = 'PHONE',
}

export enum CAMPAIGN_STATUS {
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  SCHEDULED = 'SCHEDULED',
}

export enum COMMUNICATION_DELIVERY_STATUS {
  QUEUED = 'QUEUED',
  COMPLETED = 'COMPLETED',
  NO_ANSWER = 'NO_ANSWER',
  BUSY = 'BUSY',
  FAILED = 'FAILED',
}

export type ICampaignItem = {
  name: string;
  createdAt: string;
  id: number;
  transport: string;
  type: CAMPAIGN_TYPES;
  status: CAMPAIGN_STATUS;
  totalAudiences: number;
};

export type ICampaignCreateItem = {
  name: string;
  startTime: string;
  details: string;
  transport: string;
  type: CAMPAIGN_TYPES;
  beneficiaries: string[];
};

export type ICampaigns = ICampaignItem[];

export type ICampaignsTableFilterValue = string | string[];

export type ICampaignPagination = {
  currentPage?: number;
  total?: number;
  perPage: number;
  lastPage?: number;
};

export type ICampaignsListApiResponse = {
  meta: ICampaignPagination;
  rows: ICampaignItem[];
};

export interface CampaignsListHookReturn {
  campaigns: ICampaignsListApiResponse['rows'];
  isLoading: boolean;
  error: any;
  meta: ICampaignsListApiResponse['meta'];
}

export type IFilterOptions = string[];

interface IVR {
  url: string;
  method: string;
}

interface Audio {
  url: string;
  method: string;
}

interface TwiML {
  ivr: IVR;
  audio: Audio;
}

interface AudienceDetails {
  name: string;
  email: string;
  phone: string;
  discordId: string;
  discordToken: string;
}

interface Audience {
  id: number;
  details: AudienceDetails;
  appId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: null | string;
}

interface TransportDetails {
  api: string;
  sid: string;
  token: string;
}

interface Transport {
  id: number;
  name: string;
  details: TransportDetails;
  createdAt: string;
  updatedAt: string;
  deletedAt: null | string;
}

export interface ICampaignItemApiResponse {
  id: number;
  appId: string;
  name: string;
  startTime: string;
  type: string;
  details: {
    from: string;
    twiml: TwiML;
    callbackUrl: string;
    countryCode: string;
  };
  status: string;
  createdAt: string;
  updatedAt: string;
  transportId: number;
  deletedAt: null | string;
  transport: Transport;
  audiences: Audience[];
}

export type ICampaignLogItem = {
  id: number;
  status: COMMUNICATION_DELIVERY_STATUS;
  details: null;
  createdAt: string;
  audience: Audience;
};

export type ICampaignLogsApiResponse = {
  meta: ICampaignPagination;
  rows: ICampaignLogItem[];
};

export type ICampaignDetailsHookReturn = {
  campaign: ICampaignItemApiResponse;
  isLoading: boolean;
  error: IApiResponseError;
};
export type ICampaignLogsHookReturn = {
  logs: ICampaignLogsApiResponse;
  isLoading: boolean;
  error: IApiResponseError;
};
