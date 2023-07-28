import { axiosInstance, endpoints } from '@utils/axios';
import { IBeneficiariesCreateItem, IBeneficiaryApiFilters } from 'src/types/beneficiaries';

const BeneficiaryService = {
  list: (params?: IBeneficiaryApiFilters) =>
    axiosInstance.get(endpoints.beneficiaries.list, { params }),
  create: (data: IBeneficiariesCreateItem) =>
    axiosInstance.post(endpoints.beneficiaries.create, { ...data }),
  details: (uuid: string) => axiosInstance.get(endpoints.beneficiaries.details(uuid)),
  assignProject: (uuid: string, data: any) =>
    axiosInstance.post(endpoints.beneficiaries.assignProject(uuid), { ...data }),
};

export default BeneficiaryService;
