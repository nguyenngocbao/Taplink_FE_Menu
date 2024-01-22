import { useDataApi } from '@/hooks';
import { ServerValidationError } from '@/types';
import { ID, useCRUDServiceProps } from '@/types/CRUD';

export const useUpdate = <
  DTO extends { id?: ID } = { id?: ID },
  Modal = DTO,
  CreateReqPayload = Modal,
  UpdateReqPayload = CreateReqPayload
>({
  service
}: useCRUDServiceProps<DTO, Modal, CreateReqPayload, UpdateReqPayload>) => {
  const updateApi = useDataApi<Modal, ServerValidationError<CreateReqPayload>>(
    service.update.bind(service)
  );
  const updateItem = updateApi.call as typeof service.update;

  return {
    isUpdating: updateApi.isLoading,
    data: updateApi.data,
    updateItem,
    error: updateApi.error,
    setError: updateApi.setError
  };
};
