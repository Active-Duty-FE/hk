import { UPLOAD_FILE_MULTIPLE, ORDER_UPLOAD_FILE_MULTIPLE } from '@/http/endpoints/upload'
import { response } from '@/http/response'

export default (axiosInstance) => ({
  uploadFileMultiple(files) {
    const payload = new FormData()

    payload.set('type', 'PRODUCT')
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      payload.set(`request[${i}].file`, file)
      payload.set(`request[${i}].contentType`, file.type)
    }

    return response(axiosInstance.post(UPLOAD_FILE_MULTIPLE, payload))
  },
  orderUploadFileMultiple(files) {
    const payload = new FormData()

    payload.set('type', 'ORDER')
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      payload.set(`request[${i}].file`, file)
      payload.set(`request[${i}].contentType`, file.type)
    }

    return response(
      axiosInstance.post(ORDER_UPLOAD_FILE_MULTIPLE, payload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    )
  }
})
