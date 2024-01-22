import { ID } from './CRUD';

export type DeviceModal = {
  id: ID;
  uuid: string;
  storeId: number;
};

export type ConnectStoreReqPayload = {
  uuid: string;
  storeId: ID;
};
