import { toast } from 'vue3-toastify'

export function useToast() {
  return {
    success: (message: string, options?: any) => {
      return toast.success(message, {
        ...options,
        position: toast.POSITION.TOP_CENTER,
      })
    },
    error: (message: string, options?: any) => {
      return toast.error(message, {
        ...options,
        position: toast.POSITION.TOP_CENTER,
      })
    },
    warn: (message: string, options?: any) => {
      return toast.warn(message, {
        ...options,
        position: toast.POSITION.TOP_CENTER,
      })
    },
    info: (message: string, options?: any) => {
      return toast.info(message, {
        ...options,
        position: toast.POSITION.TOP_CENTER,
      })
    },
    loading: (message: string, options?: any) => {
      return toast.loading(message, {
        ...options,
        position: toast.POSITION.TOP_CENTER,
      })
    },
    default: (message: string, options?: any) => {
      return toast(message, {
        ...options,
        position: toast.POSITION.TOP_CENTER,
      })
    },
    clearAll: () => toast.clearAll(),
    remove: (toastId: string | number) => toast.remove(toastId),
  }
}
