import { createApp } from 'vue'
import { createPinia } from 'pinia'

import { useTranslationRequestStore } from '@/store/translationRequest'
import { useInstanceStore } from '@/store/instance'
import { useSettingStore } from '@/store/setting'
import { useScheduleStore } from '@/store/schedule'
import { createI18nPlugin } from '@/plugins/i18n'

import router from '@/router'
import App from './App.vue'

const { plugin: i18nPlugin, i18n } = createI18nPlugin({
    defaultLocale: 'en'
})
import { highlight, showTitle } from '@/directives'
import '@/assets/style.css'
import './utils'

const pinia = createPinia()
const app = createApp(App)

new Promise((resolve) => resolve(true))
    .then(async () => {
        await i18n.loadTranslations()
        app.use(i18nPlugin)
    })
    .then(() => {
        app.directive('highlight', highlight)
        app.directive('show-title', showTitle)
    })
    .then(() => {
        app.use(pinia)
        app.use(router)
    })
    .then(async () => {
        await useSettingStore().applySettingsOnLoad()
        await useInstanceStore().applyVersionOnLoad()
        await useInstanceStore().applyThemeOnLoad()
        useScheduleStore().loadRunningJobs()
        await useTranslationRequestStore().getActiveCount()
    })
    .finally(() => {
        app.mount('#app')
    })
