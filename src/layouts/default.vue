<template>
  <v-main class="h-screen d-flex flex-column overflow-scroll">
    <v-container class="flex-grow-1 d-flex flex-column justify-center">
      <router-view v-slot="{ Component, route }">
        <transition name="slide-x" mode="out-in">
          <component :is="Component" :key="route.path"/>
        </transition>
      </router-view>
    </v-container>
  </v-main>
</template>

<script lang="ts" setup>
</script>

<style>
/* v-slide-x-transition look a like */
.slide-x-enter-active,
.slide-x-leave-active {
  transition: transform .2s cubic-bezier(0.25, 0.8, 0.5, 1), opacity .15s;
  opacity: 1;
}

.slide-x-enter-from,
.slide-x-leave-to {
  opacity: 0;
}

.slide-x-enter-from {
  transform: translateX(100px);
}

.slide-x-leave-to {
  transform: translateX(-100px);
}
</style>