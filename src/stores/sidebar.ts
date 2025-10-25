import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useSidebarStore = defineStore('sidebar', () => {
  const localStorageKey = 'sidebar-open'

  const open = ref(localStorage.getItem(localStorageKey) === 'true')

  function toggle() {
    open.value = !open.value
    localStorage.setItem(localStorageKey, open.value.toString())
  }

  return { open, toggle }
})
