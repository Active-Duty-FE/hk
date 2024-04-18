export const response = async (response) => {
  try {
    return responseSuccess(await response)
  } catch (e) {
    return responseError(e)
  }
}

export const responseSuccess = (response) => {
  const responseData = response.data
  responseData.success = true
  responseData.status = response.status
  return responseData
}

const handleMessage = (errorResponse) => {
  // TODO CHECK RESPONSE FROM API
  if (errorResponse?.data && errorResponse.data.message) {
    const errorMessage = errorResponse.data.message
    return errorMessage
  }
  return ''
}

export const responseError = (error) => {
  const code = parseInt(String(error?.response && error?.response?.status))
  handleCode(code, handleMessage(error?.response) || error?.message)
  return {
    success: false,
    code: error?.response?.data?.code,
    data: (error?.response?.data && error?.response?.data?.message) || null,
    status: (error?.response && error?.response?.status) || 500,
    message: handleMessage(error?.response) || error?.message
  }
}

export const handleCode = (code, message) => {
  // TODO display common message: but need qualify with BE
}
