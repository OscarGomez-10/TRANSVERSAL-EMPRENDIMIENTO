<template>
    <q-layout view="hHh LpR fff" class="vettime-layout">

        <!-- Header con gradiente VetTime -->
        <q-header elevated class="vettime-header">
            <q-toolbar class="q-py-sm">
                <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" class="menu-btn" />
                <q-toolbar-title class="row items-center q-ml-sm">
                    <q-icon name="pets" size="md" class="q-mr-sm" />
                    <span class="text-h5 text-weight-bold">VetTime</span>
                </q-toolbar-title>
            </q-toolbar>
        </q-header>

        <!-- Drawer lateral con diseño moderno y amplio -->
        <q-drawer v-model="leftDrawerOpen" side="left" overlay behavior="desktop" :width="320" class="vettime-drawer">
            <!-- Header del drawer con gradiente -->
            <div class="drawer-header-modern q-pa-lg">
                <div class="row justify-center q-mb-md">
                    <div class="logo-circle">
                        <q-icon name="pets" size="56px" color="white" />
                    </div>
                </div>
                <div class="text-center">
                    <div class="text-h4 text-weight-bold" style="color: white;">VetTime</div>
                    <div class="text-subtitle2 q-mt-xs" style="color: rgba(255,255,255,0.9);">Cuidado Veterinario
                        Profesional</div>
                </div>
            </div>

            <!-- Menú de navegación mejorado -->
            <q-list class="q-px-md q-mt-lg">
                <q-item clickable v-ripple to="/" exact class="menu-item-large q-mb-sm">
                    <q-item-section avatar>
                        <div class="icon-wrapper">
                            <q-icon name="home" size="28px" />
                        </div>
                    </q-item-section>
                    <q-item-section>
                        <q-item-label class="text-weight-bold text-subtitle1">Home</q-item-label>
                        <q-item-label caption class="text-caption">Página Principal</q-item-label>
                    </q-item-section>
                </q-item>

                <q-item clickable v-ripple to="/veterinaria" class="menu-item-large q-mb-sm">
                    <q-item-section avatar>
                        <div class="icon-wrapper">
                            <q-icon name="medical_services" size="28px" />
                        </div>
                    </q-item-section>
                    <q-item-section>
                        <q-item-label class="text-weight-bold text-subtitle1">Veterinaria</q-item-label>
                        <q-item-label caption class="text-caption">Servicios Médicos</q-item-label>
                    </q-item-section>
                </q-item>
            </q-list>

            <!-- Footer del drawer -->
            <div class="drawer-footer">
                <q-separator class="q-mb-md" />
                <div class="text-center q-px-md">
                    <q-icon name="favorite" color="red-5" size="20px" />
                    <div class="text-caption text-grey-7 q-mt-xs">
                        Cuidamos a tus mascotas con amor
                    </div>
                </div>
            </div>
        </q-drawer>

        <!-- Contenedor principal -->
        <q-page-container class="vettime-container">
            <router-view />
        </q-page-container>

        <!-- Footer con gradiente -->
        <q-footer elevated class="vettime-footer">
            <q-toolbar class="justify-center q-py-sm">
                <div class="row items-center q-gutter-x-xs">
                    <q-icon name="pets" size="20px" />
                    <div class="text-caption">&copy; 2025 VetTime - Cuidado Veterinario Profesional</div>
                </div>
            </q-toolbar>
        </q-footer>

    </q-layout>
</template>

<script setup>
import { ref } from 'vue'

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
    leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<style scoped>
/* Paleta de colores VetTime */
:root {
    --vettime-primary: #2AB7A9;
    --vettime-secondary: #50e2ad;
    --vettime-accent: #FFD166;
    --vettime-background: #61a6c8;
    --vettime-text: #2F2F2F;
}

/* Layout principal */
.vettime-layout {
    background-color: #F7F9FA;
}

/* Header con color sólido */
.vettime-header {
    background: #2AB7A9 !important;
    color: white !important;
    height: 60px;
}

.menu-btn {
    transition: all 0.3s ease;
}

.menu-btn:hover {
    background-color: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
}

/* Drawer mejorado */
.vettime-drawer {
    background-color: #F7F9FA;
    box-shadow: 2px 0 12px rgba(0, 0, 0, 0.1);
}

/* Header moderno del drawer */
.drawer-header-modern {
    background: linear-gradient(135deg, #2AB7A9 0%, #1a9c8f 100%);
    padding-top: 32px;
    padding-bottom: 32px;
    position: relative;
    overflow: hidden;
}

.drawer-header-modern::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    animation: pulse 3s ease-in-out infinite;
}

@keyframes pulse {

    0%,
    100% {
        transform: scale(1);
        opacity: 0.5;
    }

    50% {
        transform: scale(1.1);
        opacity: 0.3;
    }
}

.logo-circle {
    width: 100px;
    height: 100px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    border: 3px solid rgba(255, 255, 255, 0.3);
}

/* Items del menú mejorados */
.menu-item-large {
    border-radius: 16px;
    padding: 16px 12px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    color: #2F2F2F;
    background-color: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    min-height: 80px;
}

.menu-item-large:hover {
    background-color: rgba(42, 183, 169, 0.08);
    transform: translateX(8px) scale(1.02);
    box-shadow: 0 4px 16px rgba(42, 183, 169, 0.2);
}

.menu-item-large.q-router-link--exact-active {
    background: #2AB7A9;
    color: white;
    box-shadow: 0 6px 20px rgba(42, 183, 169, 0.4);
    transform: translateX(8px);
}

.menu-item-large.q-router-link--exact-active .q-item-label {
    color: white !important;
}

.menu-item-large.q-router-link--exact-active .icon-wrapper {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
}

.menu-item-large.q-router-link--exact-active .q-icon {
    color: white;
}

/* Wrapper de íconos */
.icon-wrapper {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: rgba(42, 183, 169, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid rgba(42, 183, 169, 0.2);
    transition: all 0.3s ease;
}

.menu-item-large .q-icon {
    color: #2AB7A9;
}

/* Footer del drawer */
.drawer-footer {
    position: absolute;
    bottom: 20px;
    left: 0;
    right: 0;
    padding: 0 16px;
}

/* Contenedor de páginas */
.vettime-container {
    background-color: #F7F9FA;
}

/* Footer con color sólido */
.vettime-footer {
    background: #2AB7A9 !important;
    color: white !important;
}

/* Animaciones suaves */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.vettime-header {
    animation: fadeIn 0.5s ease;
}
</style>