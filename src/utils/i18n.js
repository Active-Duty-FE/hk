import { createI18n } from 'vue-i18n'
import storage from './storage'
import axios from 'axios'
import en from '@/assets/lang/en.json'
import hk from '@/assets/lang/hk.json'

export const locale = 'en' // default 설정값
export const locales = ['hk', 'en']
const DATA_LANG = 'hk-lang'

export const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  globalInjection: true,
  messages: {
    en,
    hk
  }
})

const loadedLanguages = []

// 다국어 적용
export function loadLocale() {
  const lang = storage.get(DATA_LANG, 'localStorage')
  if (lang && locales.includes(lang)) {
    loadMessage(lang)
  } else {
    loadMessage(locale)
  }
}

// 다국어 변경 : lang - 다국어 종류 kr/en
export function changeLocale(lang) {
  loadMessage(lang)
}

// i18n 설정
function setI18n(lang) {
  i18n.locale = lang
  i18n.global.locale.value = lang
  storage.set(DATA_LANG, lang, 'localStorage')
  document.querySelector('html').setAttribute('lang', lang)
  return lang
}

// 다국어 파일 로딩
export function loadMessage(lang) {
  if (i18n.locale !== lang || !loadedLanguages.length) {
    if (!loadedLanguages.includes(lang)) {
      axios.defaults.headers.common['Content-Language'] = lang

      return import(`../assets/lang/${lang}.json`).then((msgs) => {
        i18n.global.setLocaleMessage(lang, msgs.default)
        loadedLanguages.push(lang)
        return setI18n(lang)
      })
    }
    return Promise.resolve(setI18n(lang))
  }
  return Promise.resolve(lang)
}
