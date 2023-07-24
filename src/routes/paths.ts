// utils
import { paramCase } from 'src/utils/change-case';

// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  AUTH_DEMO: '/auth-demo',
  DASHBOARD: '/dashboard',
  TRANSACTIONS: '/transactions',
  BENEFICIARIES: '/beneficiaries',
  PROJECTS: '/projects',
  PHOTO_GALLERY: '/photo-gallery',
  VENDORS: '/vendors',
  CAMPAIGNS: '/campaigns',
  ADMINISTATION: '/administration',
};

// ----------------------------------------------------------------------

export const paths = {
  page403: '/403',
  page404: '/404',
  page500: '/500',

  // AUTH
  auth: {
    login: `${ROOTS.AUTH}/jwt/login`,
  },

  dashboard: {
    root: ROOTS.DASHBOARD,

    general: {
      app: `${ROOTS.DASHBOARD}/app`,
      projects: {
        list: `${ROOTS.PROJECTS}`,
        add: `${ROOTS.PROJECTS}/add`,
        details: (contractAddress: string) => `${ROOTS.PROJECTS}/${contractAddress}`,
        edit: (contractAddress: string) => `${ROOTS.PROJECTS}/${contractAddress}/edit`,
      },
      photoGallery: `${ROOTS.PHOTO_GALLERY}`,
      vendors: {
        list: `${ROOTS.VENDORS}`,
        details: (address: string) => `${ROOTS.VENDORS}/${address}`,
      },

      transactions: {
        list: `${ROOTS.TRANSACTIONS}`,
        details: (txHash: string) => `${ROOTS.TRANSACTIONS}/${paramCase(txHash)}`,
      },
      beneficiaries: {
        list: `${ROOTS.BENEFICIARIES}`,
        details: (address: string) => `${ROOTS.BENEFICIARIES}/${paramCase(address)}`,
        add: `${ROOTS.BENEFICIARIES}/add`,
      },
      campaigns: {
        list: `${ROOTS.CAMPAIGNS}`,
        add: `${ROOTS.CAMPAIGNS}/add`,
        edit: (id: number) => `${ROOTS.CAMPAIGNS}/${id}/edit`,
        details: (id: number) => `${ROOTS.CAMPAIGNS}/${id}`,
      },
    },
    administration: {
      users: {
        list: `${ROOTS.ADMINISTATION}/users`,
      },
    },
  },
};
