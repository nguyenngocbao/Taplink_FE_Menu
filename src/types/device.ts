import { ID } from './CRUD';

export type DeviceResponse = {
  id: ID;
  uuid: string;
  storeId: number;
};

export type ConnectStoreRequest = {
  uuid: string;
  storeId: ID;
};
