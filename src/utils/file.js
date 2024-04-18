export const isValidAcceptFile = (files, accept) => {
  const arrAccept = accept.split(',').map((str) => str.replaceAll('.', '').replaceAll(' ', ''))
  let isValid = true
  for (const file of files) {
    const fileExt = file.name.split('.').pop()
    if (!arrAccept.includes(fileExt) && !arrAccept.includes(file.type)) {
      isValid = false
      break
    }
  }

  return isValid
}

export const getBase64 = (blob, callbackFn) => {
  const reader = new FileReader()
  reader.addEventListener('load', () => {
    callbackFn(reader.result)
  })
  reader.readAsDataURL(blob)
}

export const validateFilesize = (fileSize, maxFileSize) => {
  return fileSize <= maxFileSize
}
