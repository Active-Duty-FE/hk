import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getListMenus, transformNestedMenu, textToSlug, findOtherMenus } from '@/utils/common'
import { MOBILE_MENUS, STORAGE_MENUS_FLAT } from '@/helpers/constant'
import storage from '@/utils/storage'

const menuNotHavChild = (menu) => {
  return menu?.children && menu?.children.length
}

export const useMenuStore = defineStore('menuStore', () => {
  const currentMenus = ref([])
  const flatMenus = ref([])
  const specialMenus = ref([])

  function setCurrentMenus(value) {
    currentMenus.value = value
  }

  function setCurrentFlatMenus(value) {
    flatMenus.value = value
  }

  function setSpecialMenus(value) {
    specialMenus.value = value
  }

  const fetchListMenus = async () => {
    const response = await getListMenus()
    const flatData = response.data?.map((el) => ({ ...el, path: textToSlug(el.categoryName) }))
    setCurrentFlatMenus(flatData)
    storage.set(STORAGE_MENUS_FLAT, flatData, 'localStorage')
    let menus = transformNestedMenu(response.data, null)
    // find all category level 1 and not have child
    const specialMenus = menus.filter((el) => !el?.children?.length && el.level === 1) || []
    setSpecialMenus(specialMenus)
    menus = menus.map((el) => ({ ...el, others: findOtherMenus(el), specials: specialMenus }))
    const fixData = menus.filter((el) => menuNotHavChild(el))
    setCurrentMenus([...fixData, ...MOBILE_MENUS])
  }

  return {
    currentMenus,
    flatMenus,
    specialMenus,
    setCurrentMenus,
    setCurrentFlatMenus,
    setSpecialMenus,
    fetchListMenus
  }
})
