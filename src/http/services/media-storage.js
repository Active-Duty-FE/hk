import { DOWNLOAD_MEDIA_STORAGE } from '@/http/endpoints/media-storage'
import { response } from '@/http/response'

export default (axiosInstance) => ({
  downloadFile(fileUrl, fileName) {
    return response(
      axiosInstance.get(DOWNLOAD_MEDIA_STORAGE, {
        params: {
          fileUrl,
          fileName
        },
        responseType: 'blob'
      })
    )
  }
})
