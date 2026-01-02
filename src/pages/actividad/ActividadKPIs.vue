<script setup lang="ts">
import { computed } from 'vue'
import BaseIcon from '@/components/BaseIcon.vue'

// Interfaces
interface Activity {
  fecha: string | Date
  [key: string]: any
}

interface Props {
  activities: Activity[]
}

const props = defineProps<Props>()

// Cálculos (Computed)
const totalCount = computed(() => props.activities.length)

const todayCount = computed(() => {
  const now = new Date()
  return props.activities.filter(a => 
    new Date(a.fecha).toDateString() === now.toDateString()
  ).length
})

const weekCount = computed(() => {
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  return props.activities.filter(a => new Date(a.fecha) >= oneWeekAgo).length
})
</script>

<template>
  <section aria-label="Métricas de actividad" class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
    
    <article class="card bg-base-100 shadow-sm border border-base-200">
      <div class="card-body p-5 flex-row items-center gap-4">
        
        <div class="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center" aria-hidden="true">
          <BaseIcon name="trendingUp" class="size-10" />
        </div>
        
        <dl>
          <dt class="text-xs text-base-content/50 font-bold uppercase tracking-wider">
            Total Actividades
          </dt>
          <dd class="text-2xl font-black text-base-content m-0">
            {{ totalCount }}
          </dd>
        </dl>

      </div>
    </article>

    <article class="card bg-base-100 shadow-sm border border-base-200">
      <div class="card-body p-5 flex-row items-center gap-4">
        
        <div class="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center" aria-hidden="true">
          <BaseIcon name="clock" class="size-10" />
        </div>
        
        <dl>
          <dt class="text-xs text-base-content/50 font-bold uppercase tracking-wider">
            Hoy
          </dt>
          <dd class="text-2xl font-black text-base-content m-0">
            {{ todayCount }}
          </dd>
        </dl>

      </div>
    </article>

    <article class="card bg-base-100 shadow-sm border border-base-200">
      <div class="card-body p-5 flex-row items-center gap-4">
        
        <div class="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center" aria-hidden="true">
          <BaseIcon name="barChart" class="size-10" />
        </div>
        
        <dl>
          <dt class="text-xs text-base-content/50 font-bold uppercase tracking-wider">
            Esta Semana
          </dt>
          <dd class="text-2xl font-black text-base-content m-0">
            {{ weekCount }}
          </dd>
        </dl>

      </div>
    </article>

  </section>
</template>