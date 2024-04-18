import CryptoJS from 'crypto-js'

const secure = {
  encrypt(data, key) {
    return CryptoJS.AES.encrypt(data, key).toString()
  },
  decrypt(data, key) {
    return CryptoJS.AES.decrypt(data, key).toString(CryptoJS.enc.Utf8)
  }
}

export default secure
