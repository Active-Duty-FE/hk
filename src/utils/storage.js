import config from '@/helpers/config'

const options = Object.assign(
  {
    namespace: 'ls_', // key prefix
    storage: 'sessionStorage', // storage name session, local, memory
    default_cache_time: 60 * 60 * 24 * 7,
    isEncrypt: false
  },
  config.storage
)

let hasSetStorage = false

export const storage = {
  getKey: (key) => {
    return options.namespace + key
  },
  setOptions: (opt) => {
    if (hasSetStorage) {
      console.error('Has set storage:', options)
      return
    }
    Object.assign(options, opt)
    hasSetStorage = true
  },
  set: (key, value, storageType = options.storage, expire = options.default_cache_time) => {
    const stringData = JSON.stringify({
      value,
      expire: expire != null ? new Date().getTime() + expire * 1000 : null
    })

    window[storageType].setItem(storage.getKey(key), stringData)
  },
  setObj: (key, newVal, expire = options.default_cache_time) => {
    const oldVal = storage.get(key)
    if (!oldVal) {
      storage.set(key, newVal, expire)
    } else {
      Object.assign(oldVal, newVal)
      storage.set(key, oldVal, expire)
    }
  },
  get: (key, storageType = options.storage) => {
    const item = window[storageType].getItem(storage.getKey(key))
    if (item) {
      try {
        const data = JSON.parse(item)
        const { value, expire } = data
        if (expire === null || expire >= Date.now()) {
          return value
        }
        storage.remove(storage.getKey(key))
      } catch (e) {
        console.error(e)
      }
    }
    return null
  },
  remove: (key, storageType = options.storage) => {
    window[storageType].removeItem(storage.getKey(key))
  },
  removeAllStorage: (key) => {
    window['sessionStorage'].removeItem(storage.getKey(key))
    window['localStorage'].removeItem(storage.getKey(key))
  },
  clear: (storageType = options.storage) => {
    window[storageType].clear()
  }
}

export default storage
