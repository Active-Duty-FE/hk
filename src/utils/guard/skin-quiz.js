import apiService from '@/http/api'
import { getIsLoggedIn } from '@/utils/auth'
import { CountryEnum } from '@/helpers/enum'

export const checkAccessSkinQuiz = async () => {
  if (getIsLoggedIn()) {
    // check by member's country
    const { data } = await apiService.authService.me()
    return data?.country === CountryEnum.US.value
  } else {
    // check by ip
    const { data } = await apiService.productService.getMyIpAddress()
    return data?.country === CountryEnum.US.label
  }
}
