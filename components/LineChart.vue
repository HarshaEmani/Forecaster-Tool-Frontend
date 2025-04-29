<template>
    <div style="height: 500px;">
        <div class="flex items-center mb-2">
            <div class="text-sm text-gray-600">
                <span v-if="visibleStart" class="font-semibold">Visible Range:&nbsp;</span>
                <span v-if="visibleStart">{{ formatted(visibleStart) }}</span>
                &rarr;
                <span v-if="visibleEnd">{{ formatted(visibleEnd) }}</span>
            </div>
            <Button label="Reset Zoom" icon="pi pi-refresh" class="p-button-sm ml-auto" @click="resetZoom" />
        </div>

        <Line :data="chartData" :options="chartOptions" ref="lineChartRef" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits, defineExpose } from 'vue'
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Filler
} from 'chart.js'
import zoomPlugin from 'chartjs-plugin-zoom'
import { Line } from 'vue-chartjs'
import { useDebounceFn } from '@vueuse/core'
import Button from 'primevue/button'

ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Filler,
    zoomPlugin
)

const props = defineProps<{
    labels: string[]
    forecast: number[]
    actual?: number[]
}>()

const emit = defineEmits<{
    (e: 'visible-change', labels: string[]): void
}>()

const lineChartRef = ref<any>(null)
const visibleStart = ref('')
const visibleEnd = ref('')

/** format "2024-07-02T15:00:00+00:00" → "2024-07-02 15:00:00" */
function formatted(iso: string) {
    return iso.replace(/\+.*$/, '').replace('T', ' ')
}

// update visibleStart/visibleEnd + emit labels
const updateVisibleRange = useDebounceFn(() => {
    const chart = lineChartRef.value?.chart
    if (!chart) return

    const xScale = chart.scales.x

    // category axis: min/max = fractional index
    const minIdx = Math.ceil(xScale.min)
    const maxIdx = Math.floor(xScale.max)

    const sliceEnd = maxIdx + 1
    const vis = props.labels.slice(minIdx, sliceEnd)

    visibleStart.value = vis[0] || ''
    visibleEnd.value = vis.at(-1) || ''

    emit('visible-change', vis)
}, 100)

/** fully reset both plugin state + any manual min/max we set */
function resetZoom() {
    const chart = lineChartRef.value?.chart
    if (!chart) return

    chart.resetZoom()

    // clear out our manual overrides so plugin reset truly shows all data
    const xScale = chart.scales.x
    delete xScale.options.min
    delete xScale.options.max

    chart.update()
    updateVisibleRange()
}

/** allow parent to programmatically set an index‐based window */
function setZoomRange(startIso: string, endIso: string) {
    const chart = lineChartRef.value?.chart
    if (!chart) return

    // convert all labels once to epoch‐ms
    const times = props.labels.map(l => new Date(l).getTime())
    const from = new Date(startIso).getTime()
    const to = new Date(endIso).getTime()

    const startIdx = times.findIndex(t => t >= from)
    // last index where t <= to
    const valid = times.map((t, i) => t <= to ? i : -1).filter(i => i >= 0)
    const endIdx = valid.pop()

    if (startIdx < 0 || endIdx == null) return

    const xScale = chart.scales.x
    xScale.options.min = startIdx
    xScale.options.max = endIdx

    chart.update()
    updateVisibleRange()
}

defineExpose({ setZoomRange })

const chartData = computed(() => ({
    labels: props.labels,
    datasets: [
        {
            label: 'Forecast',
            data: props.forecast,
            borderColor: '#2563EB',
            backgroundColor: 'rgba(37, 99, 235, 0.2)',
            tension: 0.4,
            pointRadius: 2,
            fill: true
        },
        props.actual
            ? {
                label: 'Actual',
                data: props.actual,
                borderColor: '#22c55e',
                backgroundColor: 'transparent',
                borderDash: [5, 5],
                tension: 0.3,
                pointRadius: 3,
                borderWidth: 2
            }
            : null
    ].filter(Boolean)
}))

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 400 },
    scales: {
        x: {
            type: 'category',
            ticks: {
                maxTicksLimit: 10,
                callback: (_: any, index: number) => {
                    let lbl = props.labels[index] || ''
                    lbl = lbl.replace(/\+.*$/, '')  // drop +00:00
                    return lbl.replace('T', ' ')
                }
            },
            title: {
                display: true,
                text: 'Date',
                font: { size: 14 }
            }
        },
        y: {
            title: {
                display: true,
                text: 'Load (kW)',
                font: { size: 14 }
            },
            beginAtZero: false
        }
    },
    plugins: {
        legend: { display: true },
        zoom: {
            pan: { enabled: true, mode: 'x', modifierKey: 'ctrl' },
            zoom: {
                drag: true,
                wheel: { enabled: true },
                mode: 'x',
                onZoom: updateVisibleRange,
                onZoomComplete: updateVisibleRange
            }
        }
    }
}
</script>