import { ImageDeleteReq } from '@/types/file';
import { callApi } from '@/utils/common';

export const CATEGORY_APIs = {
  INDEX: '/api/v1/files/image'
};

class FileService {
  constructor() {}

  async deleteImage(body: ImageDeleteReq): Promise<any> {
    return callApi(
      `${CATEGORY_APIs.INDEX}`,
      'DELETE',
      body,
      false,
      undefined,
      true
    );
  }
}

export const fileService = new FileService();
