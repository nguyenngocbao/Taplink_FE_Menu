import axios from '@/lib/axios';
import fetchServer from '@/lib/fetch-server';
import { ConnectStoreReqPayload, DeviceModal } from '@/types/device';
import { isOnServer } from '@/utils/common';

export const DEVICE_APIs = {
  INDEX: '/api/v1/devices'
};

class DeviceService {
  async connectStore(body: ConnectStoreReqPayload): Promise<unknown> {
    let res = null;
    if (isOnServer()) {
      res = await fetchServer(DEVICE_APIs.INDEX, 'POST', { body });
    } else {
      res = await axios.post(DEVICE_APIs.INDEX, body);
    }
    return res;
  }

  async get(uuid: string): Promise<DeviceModal> {
    let res: DeviceModal = null;
    if (isOnServer()) {
      res = await fetchServer<DeviceModal>(
        `${DEVICE_APIs.INDEX}/${uuid}`,
        'GET'
      );
    } else {
      res = await axios.get(`${DEVICE_APIs.INDEX}/${uuid}`);
    }

    return res;
  }
}

export const deviceService = new DeviceService();
