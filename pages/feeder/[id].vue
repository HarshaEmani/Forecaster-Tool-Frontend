<template>
    <div class="p-4">
        <h1 class="text-3xl font-bold mb-4">Feeder {{ feederId }}</h1>

        <Card class="mb-5">
            <template #title>Select Date Range</template>
            <template #content>
                <div class="flex flex-wrap gap-3 items-center">
                    <Calendar v-model="start" placeholder="Start" dateFormat="yy-mm-dd" :minDate="minDate"
                        :maxDate="maxDate" />
                    <Calendar v-model="end" placeholder="End" dateFormat="yy-mm-dd" :minDate="minDate"
                        :maxDate="maxDate" />
                    <Button label="Apply" icon="pi pi-check" @click="applyDates" />
                </div>
            </template>
        </Card>

        <!-- metrics grid -->
        <Card class="mb-6">
            <template #content>
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
                    <div v-for="metric in metricList" :key="metric.label" class="bg-blue-50 border rounded p-3 shadow">
                        <div class="text-xs text-gray-500 uppercase tracking-wide">
                            {{ metric.label }}
                        </div>
                        <div class="text-xl font-bold text-blue-700 mt-1">
                            {{ metric.value }}
                        </div>
                    </div>
                </div>
            </template>
        </Card>

        <Card>
            <template #title>Forecast Chart</template>
            <template #content>
                <LineChart ref="chartRef" :labels="labels" :forecast="values" :actual="actuals"
                    @visible-change="updateVisibleMetrics" />
            </template>
        </Card>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useForecastStore } from '~/store/forecastStore'
import { fetchForecasts } from '~/utils/api'
import { calculateMetrics } from '~/utils/metrics'
import LineChart from '~/components/LineChart.vue'

import Card from 'primevue/card'
import Calendar from 'primevue/calendar'
import Button from 'primevue/button'

const route = useRoute()
const feederId = Number(route.params.id)
const forecastStore = useForecastStore()

const start = ref<string>('')
const end = ref<string>('')

const chartRef = ref<any>(null)
const visibleForecasts = ref<any[]>([])

// the store's filtered forecasts
const selected = computed(() => forecastStore.filteredForecasts)

// date-picker min/max
const allDates = computed(() =>
    forecastStore.forecastsByFeeder[feederId]?.map(f => f.target_timestamp.slice(0, 10)) || []
)
const minDate = computed(() =>
    allDates.value.length ? new Date(allDates.value[0]) : undefined
)
const maxDate = computed(() =>
    allDates.value.length ? new Date(allDates.value.at(-1)!) : undefined
)

onMounted(async () => {
    if (!forecastStore.forecastsByFeeder[feederId]) {
        const data = await fetchForecasts(feederId)
        forecastStore.setForecasts(feederId, data)
    }
    forecastStore.setSelectedFeederId(feederId)

    // initial visible + zoom full
    visibleForecasts.value = forecastStore.filteredForecasts
    await nextTick()
    const first = visibleForecasts.value[0]?.target_timestamp
    const last = visibleForecasts.value.at(-1)?.target_timestamp
    if (first && last) chartRef.value.setZoomRange(first, last)
})

function applyDates() {
    if (!start.value || !end.value) return

    const s = new Date(start.value)
    const e = new Date(end.value)
    const days: string[] = []
    const d = new Date(s)
    while (d <= e) {
        days.push(d.toISOString().slice(0, 10))
        d.setDate(d.getDate() + 1)
    }
    forecastStore.setSelectedDates(days)

    // update local + zoom to new
    visibleForecasts.value = forecastStore.filteredForecasts
    const first = visibleForecasts.value[0]?.target_timestamp
    const last = visibleForecasts.value.at(-1)?.target_timestamp
    if (first && last) chartRef.value.setZoomRange(first, last)
}

function updateVisibleMetrics(visibleLabels: string[]) {
    visibleForecasts.value = selected.value.filter(f =>
        visibleLabels.includes(f.target_timestamp)
    )
}

const labels = computed(() =>
    selected.value.map(f => f.target_timestamp)
)
const values = computed(() =>
    selected.value.map(f => f.forecast_value)
)
const actuals = computed(() =>
    selected.value.map(f => f.actual_value ?? null)
)

const metrics = computed(() =>
    calculateMetrics(visibleForecasts.value)
)

const metricList = computed(() => [
    { label: 'Top Load', value: metrics.value.peakLoad.toFixed(2) },
    { label: 'Average Load', value: metrics.value.averageLoad.toFixed(2) },
    { label: 'Bottom Load', value: metrics.value.minLoad.toFixed(2) },
    { label: 'MAE', value: metrics.value.mae.toFixed(2) },
    { label: 'RMSE', value: metrics.value.rmse.toFixed(2) },
    { label: 'SMAPE (%)', value: metrics.value.smape.toFixed(2) }
])
</script>