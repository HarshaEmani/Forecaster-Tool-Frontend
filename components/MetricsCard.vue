<template>
    <Card class="text-center p-4">
        <template #title>{{ label }}</template>
        <template #content>
            <p class="text-xl font-bold">{{ value }}</p>
        </template>
    </Card>
</template>

<script setup lang="ts">
defineProps<{
    label: string
    value: string
}>()
</script>