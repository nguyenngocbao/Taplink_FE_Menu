import axios from '@/lib/axios';
import fetchServer from '@/lib/fetch-server';
import { ConnectStoreRequest, DeviceResponse } from '@/types/device';
import { isOnServer } from '@/utils/common';

export const DEVICE_APIs = {
  INDEX: '/api/v1/devices'
};

class DeviceService {
  async connectStore(body: ConnectStoreRequest): Promise<unknown> {
    let res = null;
    if (isOnServer()) {
      res = await fetchServer(DEVICE_APIs.INDEX, 'POST', { body });
    } else {
      res = await axios.post(DEVICE_APIs.INDEX, body);
    }
    return res;
  }

  async get(uuid: string): Promise<DeviceResponse> {
    let res: DeviceResponse = null;
    if (isOnServer()) {
      res = await fetchServer<DeviceResponse>(
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
