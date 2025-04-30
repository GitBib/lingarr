﻿import { ref } from 'vue'
import { LabelValue, SelectComponentExpose, TranslateModelsResponse } from '@/ts'
import { delay } from '@/utils/delay'
import services from '@/services'
import { useI18n } from '@/plugins/i18n'

export function useModelOptions() {
    const { translate } = useI18n()
    const options = ref<LabelValue[]>([])
    const errorMessage = ref<string | null>(null)
    const selectRef = ref<SelectComponentExpose | null>(null)

    const loadOptions = async () => {
        try {
            errorMessage.value = null
            await delay(500)
            const response = await services.translate.getModels<TranslateModelsResponse>()
            options.value = response.options || []

            if (options.value.length === 0) {
                errorMessage.value =
                    response.message || translate('settings.services.noModelsAvailable')
            }
        } catch (error) {
            console.error('Failed to load options:', error)
            errorMessage.value = 'Error loading models. Please try again.'
        } finally {
            if (selectRef.value) {
                selectRef.value.setLoadingState(false)
            }
        }
    }

    return {
        options,
        errorMessage,
        selectRef,
        loadOptions
    }
}
