import { notification } from 'ant-design-vue'

export function useNotification() {
  const showNotification = (args) => {
    notification.open({
      duration: 3, // second
      ...args
    })
  }

  return {
    showNotification
  }
}
