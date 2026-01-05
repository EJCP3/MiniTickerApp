<script setup lang="ts">
import { icons } from "@/utils/icons";
import NavMenu from "./NavMenu.vue";
import NavUserDropdown from "./NavUserDropdown.vue";
import type { User } from '@/types';

defineProps<{
  user: User | null
}>();

defineEmits(['open-profile', 'open-commands']);
</script>

<template>
  <header class="navbar bg-base-100 shadow-sm sticky top-0 z-40">
    <nav class="navbar-start">
      <NavMenu />
    </nav>

    <section class="navbar-center">
      <router-link to="/" class="btn btn-ghost text-xl flex items-center gap-2">
        <span v-if="icons?.logo" v-html="icons.logo" class="text-primary w-6 h-6"></span>
        <span class="font-bold tracking-tight">MiniTicker</span>
      </router-link>
    </section>

    <aside class="navbar-end">
      <NavUserDropdown 
        :user="user" 
        @open-profile="$emit('open-profile')" 
        @open-commands="$emit('open-commands')" 
      />
    </aside>
  </header>
</template>