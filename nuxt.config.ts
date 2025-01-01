// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    runtimeConfig: {
        public: {
            NUXT_GATEWAY_TOKEN: process.env.NUXT_GATEWAY_TOKEN,
            NUXT_GATEWAY_IP: process.env.NUXT_GATEWAY_IP,
        }
    },
    modules: ['@pinia/nuxt', '@nuxt/icon'],
    compatibilityDate: '2024-11-01',
    devtools: {enabled: true},
    css: ['~/assets/css/main.css'],
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
    pinia: {
        storesDirs: ['./stores/**'],
    },
    ssr: true,
    nitro: {
        routeRules: {
            '/miio/**': {cors: true},
        }
    }
})