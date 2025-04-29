<template>
    <Menubar :model="items" class="shadow-md">
        <template #item="{ item, props, hasSubmenu }">
            <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                <a v-ripple :href="href" v-bind="props.action" @click="navigate">
                    <span :class="item.icon" />
                    <span>{{ item.label }}</span>
                </a>
            </router-link>
        </template>
    </Menubar>
    <Toast />
</template>

<script setup lang="ts">



const items = [
    {
        label: 'Home',
        icon: 'pi pi-home',
        route: '/'
    },
    // {
    //     label: 'Light',
    //     icon: 'pi pi-sun',
    //     route: '/'
    //     // command: () => {
    //     //     toast.add({ mode: "Light" })
    //     // }
    // }
]
</script>

<style scoped>
/* .p-menubar {
    background-color: #2563eb;
    color: white;
    border: none;
}

.p-menuitem-text,
.p-menuitem-icon {
    color: white !important;
} */
</style>