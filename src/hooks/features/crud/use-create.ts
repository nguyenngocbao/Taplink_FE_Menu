import { useDataApi } from '@/hooks';
import { ServerValidationError } from '@/types';
import { ID, useCRUDServiceProps } from '@/types/CRUD';

export const useCreate = <
  DTO extends { id?: ID },
  Modal = unknown,
  CreateReqPayload = DTO,
  UpdateReqPayload = CreateReqPayload
>({
  service
}: useCRUDServiceProps<DTO, Modal, CreateReqPayload, UpdateReqPayload>) => {
  const createApi = useDataApi<Modal, ServerValidationError<CreateReqPayload>>(
    service.create.bind(service)
  );
  const createItem = createApi.call as typeof service.create;

  return {
    isCreating: createApi.isLoading,
    data: createApi.data,
    createItem,
    error: createApi.error
  };
};
