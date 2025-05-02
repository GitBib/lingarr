import { acceptHMRUpdate, defineStore } from 'pinia'
import { ILanguage, ISubtitle, IUseTranslateStore, MediaType } from '@/ts'
import services from '@/services'
import { useTranslationRequestStore } from '@/store/translationRequest'

export const useTranslateStore = defineStore({
    id: 'translate',
    state: (): IUseTranslateStore => ({
        languages: [],
        languagesError: false,
        languagesLoading: false
    }),
    getters: {
        getLanguages: (state: IUseTranslateStore): ILanguage[] => state.languages,
        hasLanguagesError: (state: IUseTranslateStore): boolean => state.languagesError,
        isLanguagesLoading: (state: IUseTranslateStore): boolean => state.languagesLoading
    },
    actions: {
        async translateSubtitle(
            mediaId: number,
            subtitle: ISubtitle,
            source: string,
            target: ILanguage,
            mediaType: MediaType
        ) {
            await services.translate.translateSubtitle<{ jobId: string }>(
                mediaId,
                subtitle,
                source,
                target,
                mediaType
            )
            await useTranslationRequestStore().getActiveCount()
        },
        async setLanguages(): Promise<void> {
            try {
                this.languagesLoading = true
                this.languagesError = false
                this.languages = await services.translate.getLanguages<ILanguage[]>()
            } catch (error) {
                console.error('Failed to load languages:', error)
                this.languagesError = true
                this.languages = []
            } finally {
                this.languagesLoading = false
            }
        }
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useTranslateStore, import.meta.hot))
}
