<template>
    <div class="min-h-screen">
        <AppMenu />

        <main class="flex-grow">
            <slot />
        </main>

        <footer class="text-center text-sm text-gray-400 py-4">
            © {{ new Date().getFullYear() }} Forecast Viewer
        </footer>
    </div>
</template>

<script setup>
import AppMenu from '~/components/AppMenu.vue'
</script>