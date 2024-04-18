import { Modal } from 'ant-design-vue'
import { useGlobalLoadingStore } from '@/stores/modules/loading'

export const useAlert = async (options) => {
  return new Promise((resolve) => {
    const storeLoading = useGlobalLoadingStore()
    const { showGlobalLoading } = storeLoading
    showGlobalLoading(false)
    Modal.info({
      title: '',
      content: '',
      wrapClassName: 'ModelAlertCustom',
      centered: true,
      icon: false,
      ...options,
      onOk: () => resolve(true),
      onCancel: () => resolve(false)
    })
  })
}

export const useAlertConfirm = async (options) => {
  return new Promise((resolve) => {
    const storeLoading = useGlobalLoadingStore()
    const { showGlobalLoading } = storeLoading
    showGlobalLoading(false)
    Modal.confirm({
      title: '',
      content: '',
      wrapClassName: 'ModelConfirmCustom',
      centered: true,
      icon: false,
      width: 270,
      okButtonProps: {
        prefixCls: 'button okButton'
      },
      cancelButtonProps: {
        prefixCls: ' button cancelButton'
      },
      ...options,
      onOk: () => resolve(true),
      onCancel: () => resolve(false)
    })
  })
}
