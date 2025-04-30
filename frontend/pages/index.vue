<template>
    <div class="p-6">
        <!-- <Button label="Dark Mode" @click="toggleDarkMode" /> -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card v-for="feeder in feeders" :key="feeder.id" class="shadow border text-left">
                <template #title>Feeder {{ feeder.id }}</template>
                <template #subtitle>Last forecast run: {{ feeder.lastDate }}</template>
                <template #content>
                    <ul class="text-sm text-gray-600">
                        <li><strong>Peak:</strong> {{ feeder.peak.toFixed(2) }}</li>
                        <li><strong>MAE:</strong> {{ feeder.mae.toFixed(2) }}</li>
                        <li><strong>SMAPE:</strong> {{ feeder.smape.toFixed(2) }}%</li>
                    </ul>
                </template>
                <template #footer>
                    <Button label="View Forecast" class="p-button-sm p-button-outlined"
                        @click="goToFeeder(feeder.id)" />
                </template>
            </Card>
        </div>
    </div>
</template>


<script setup lang="ts">
import { fetchFeeders, fetchForecasts } from '~/utils/api'
import { useForecastStore } from '~/store/forecastStore'
import { useRouter } from 'vue-router'
// import axios from "axios";
// const config = useRuntimeConfig();

function toggleDarkMode() {
    document.documentElement.classList.toggle('my-app-dark');
}

const router = useRouter()
const forecastStore = useForecastStore()

interface FeederCard {
    id: number
    lastDate: string
    peak: number
    mae: number
    smape: number
}

const feeders = ref<FeederCard[]>([])

const data = await fetchFeeders()
console.log('Fetched feeders:', data)

onMounted(async () => {
    // const data = await fetchFeeders()
    // const { data } = await axios.get(`${config.public.apiBase}/feeders`);

    console.log('Fetched feeders:', data.feeders)
    // data.feeders.map((f) => console.log(f)) // extract only the IDs


    feeders.value = await Promise.all(
        data.map(async (id: number) => {
            // Check if already cached
            let forecasts = forecastStore.forecastsByFeeder[id]

            if (!forecasts) {
                forecasts = await fetchForecasts(id)
                forecastStore.setForecasts(id, forecasts)
            }

            if (!forecasts.length) {
                return {
                    id,
                    lastDate: 'N/A',
                    peak: 0,
                    mae: 0,
                    smape: 0
                }
            }

            // new: only metrics for the *last* run date
            const last = forecasts.at(-1)
            const lastDate = last?.target_timestamp.slice(0, 10) ?? 'N/A'
            // grab only those entries on that same YYYY-MM-DD
            const todays = forecasts.filter(f =>
                f.target_timestamp.startsWith(lastDate)
            )
            // peak of forecast_value on that day
            const peak = todays.length
                ? Math.max(...todays.map(f => f.forecast_value))
                : 0
            // only where actual is present
            const actuals = todays.filter(f => f.actual_value != null)
            const mae = actuals.length
                ? actuals.reduce((a, f) => a + Math.abs(f.forecast_value - f.actual_value!), 0)
                / actuals.length
                : 0
            const smape = actuals.length
                ? actuals.reduce((a, f) => {
                    const num = Math.abs(f.forecast_value - f.actual_value!)
                    const den = (Math.abs(f.forecast_value) + Math.abs(f.actual_value!)) || 1
                    return a + num / den
                }, 0)
                / actuals.length * 200
                : 0

            return {
                id,
                lastDate,
                peak,
                mae,
                smape
            }
        })
    )
})

function goToFeeder(id: number) {
    router.push(`/feeder/${id}`)
}
</script>