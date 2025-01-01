// stores/token.ts
import { defineStore } from 'pinia'

export const useMiioStore = defineStore('miio', () => {
    const authToken = ref(null)
    const devices = ref([])

    const setAuthToken = (newToken) => {
        authToken.value = newToken
    }
    const getAuthToken = () => authToken.value


    const setDevices = (newDevices) => {
        devices.value = newDevices
    }
    const getDevices = () => devices.value

    return {
        authToken,
        devices,
        setAuthToken,
        getAuthToken,
        setDevices,
        getDevices
    }
})