import apiService from '@/http/api'
import { useGlobalLoadingStore } from '@/stores/modules/loading'

export const useDownloadFileS3 = async (url, filename) => {
  const { showGlobalLoading } = useGlobalLoadingStore()
  showGlobalLoading(true)
  const data = await apiService.mediaStorageService.downloadFile(url, filename)
  showGlobalLoading(false)

  if (!data.success) return

  const objectUrl = URL.createObjectURL(data)
  const link = document.createElement('a')
  link.setAttribute('href', objectUrl)
  link.setAttribute('download', filename)
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
