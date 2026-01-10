import Vue3Toastify, { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const toastify = Vue3Toastify

export function getToastify() {
  return toastify
}

export { toast }
