declare module 'virtual:generated-layouts' {
    import type { RouteRecordRaw } from 'vue-router'
    export function setupLayouts(
        routes: RouteRecordRaw[]
    ): RouteRecordRaw[]
}

declare module 'vue-router/auto-routes' {
    import type { RouteRecordRaw } from 'vue-router'
    const routes: RouteRecordRaw[]
    export { routes }
}
