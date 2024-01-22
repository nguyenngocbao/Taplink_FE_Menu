import { useDataApi } from '@/hooks';
import { ID, useCRUDServiceProps } from '@/types/CRUD';

export const useDelete = <
  DTO extends { id?: ID },
  Modal = unknown,
  CreateReqPayload = DTO,
  UpdateReqPayload = CreateReqPayload
>({
  service
}: useCRUDServiceProps<DTO, Modal, CreateReqPayload, UpdateReqPayload>) => {
  const deleteApi = useDataApi(service.delete.bind(service));
  const deleteItem = deleteApi.call as typeof service.delete;

  return {
    isDeleting: deleteApi.isLoading,
    data: deleteApi.data,
    deleteItem
  };
};
