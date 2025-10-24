<template>
	<q-page class="services-page">
		<div class="page-header">
			<div class="header-text">
				<div class="badge">
					<q-icon name="miscellaneous_services" size="24px" />
				</div>
				<div>
					<h1>Servicios veterinarios</h1>
					<p>Administra los servicios disponibles para agendar en la plataforma.</p>
				</div>
			</div>
			<div class="header-actions">
				<q-btn color="primary" unelevated icon="add" label="Nuevo servicio" @click="openCreate" />
				<q-btn color="primary" flat icon="refresh" :loading="loading" @click="fetchServices" />
			</div>
		</div>

		<section class="filters-card">
			<div class="filters-grid">
				<q-input
					v-model="searchTerm"
					filled
					dense
					debounce="200"
					placeholder="Buscar por nombre o descripción"
					class="filter-input"
				>
					<template #prepend>
						<q-icon name="search" color="grey-6" />
					</template>
					<template #append>
						<q-btn flat dense round icon="close" @click="searchTerm = ''" v-if="searchTerm" />
					</template>
				</q-input>

				<div class="stats-box">
					<div>
						<span>Total de servicios</span>
						<strong>{{ stats.total }}</strong>
					</div>
					<div>
						<span>Monto promedio</span>
						<strong>{{ stats.average }}</strong>
					</div>
					<div>
						<span>Actualizado</span>
						<strong>{{ lastUpdatedLabel }}</strong>
					</div>
				</div>
			</div>
		</section>

		<div v-if="loading" class="loading-state">
			<q-spinner color="primary" size="42px" class="q-mb-md" />
			<span>Cargando servicios...</span>
		</div>

		<div v-else-if="!servicesSorted.length" class="empty-state">
			<q-icon name="inventory_2" size="64px" color="grey-5" class="q-mb-sm" />
			<h3>No hay registros</h3>
			<p>Comienza registrando tu primer servicio veterinario.</p>
		</div>

		<div v-else class="service-grid">
			<div v-for="service in servicesSorted" :key="service._id" class="service-card">
				<div class="service-card-header">
					<div>
						<h3>{{ service.name }}</h3>
						<p>{{ service.description }}</p>
					</div>
					<q-chip color="primary" text-color="white" dense>{{ formatPrice(service.price) }}</q-chip>
				</div>

				<div class="service-card-footer">
					<div class="footer-meta">
						<q-icon name="event" size="18px" />
						<span>Disponible para todas las citas</span>
					</div>
					<div class="footer-actions">
						<q-btn flat round dense icon="edit" color="primary" @click="openEdit(service)" />
						<q-btn flat round dense icon="delete" color="negative" @click="confirmDelete(service)" />
					</div>
				</div>
			</div>
		</div>

		<q-dialog v-model="modalOpen" persistent>
			<q-card class="service-modal">
				<div class="modal-header">
					<div>
						<h2>{{ editing ? 'Editar servicio' : 'Nuevo servicio' }}</h2>
						<p>{{ editing ? 'Actualiza la información del servicio' : 'Define un servicio para ofrecer a los clientes' }}</p>
					</div>
					<q-btn flat round icon="close" color="white" v-close-popup />
				</div>

				<q-card-section>
					<q-form @submit.prevent="saveService" class="q-gutter-md">
						<q-input
							v-model="form.name"
							filled
							label="Nombre del servicio"
							:disable="submitting"
							:rules="[val => !!val || 'Ingresa el nombre']"
						/>

						<q-input
							v-model="form.description"
							type="textarea"
							autogrow
							filled
							label="Descripción"
							:disable="submitting"
							:rules="[val => !!val || 'Describe el servicio']"
						/>

						<q-input
							v-model="form.price"
							filled
							label="Precio en COP"
							type="number"
							min="0"
							step="1000"
							:disable="submitting"
							:rules="[val => Number(val) > 0 || 'Ingresa un precio válido']"
						>
							<template #prepend>
								<q-icon name="paid" color="grey-6" />
							</template>
						</q-input>

						<div class="modal-actions">
							<q-btn flat label="Cancelar" color="grey-7" @click="modalOpen = false" :disable="submitting" />
							<q-btn color="primary" label="Guardar" type="submit" :loading="submitting" />
						</div>
					</q-form>
				</q-card-section>
			</q-card>
		</q-dialog>
	</q-page>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { deleteData, getData, postData, putData } from '../services/peticionesUser'

const $q = useQuasar()
const services = ref([])
const loading = ref(false)
const submitting = ref(false)
const modalOpen = ref(false)
const editing = ref(null)
const searchTerm = ref('')
const lastUpdated = ref(null)

const form = ref({
	name: '',
	description: '',
	price: ''
})

const stats = computed(() => {
	if (!services.value.length) {
		return {
			total: 0,
			average: '—'
		}
	}
	const total = services.value.length
	const sum = services.value.reduce((acc, item) => acc + (Number(item.price) || 0), 0)
	const average = sum / total
	return {
		total,
		average: formatPrice(average)
	}
})

const lastUpdatedLabel = computed(() => {
	if (!lastUpdated.value) {
		return '—'
	}
	return lastUpdated.value.toLocaleTimeString('es-ES', {
		hour: '2-digit',
		minute: '2-digit'
	})
})

const filteredServices = computed(() => {
	const term = searchTerm.value.trim().toLowerCase()
	if (!term) {
		return services.value
	}
	return services.value.filter(item => {
		const target = `${item.name || ''} ${item.description || ''}`.toLowerCase()
		return target.includes(term)
	})
})

const servicesSorted = computed(() => {
	return [...filteredServices.value].sort((a, b) => {
		return (a.name || '').localeCompare(b.name || '')
	})
})

watch(modalOpen, (val) => {
	if (!val) {
		resetForm()
	}
})

function resetForm() {
	form.value = {
		name: '',
		description: '',
		price: ''
	}
	editing.value = null
}

function openCreate() {
	resetForm()
	modalOpen.value = true
}

function openEdit(service) {
	editing.value = service
	form.value = {
		name: service.name || '',
		description: service.description || '',
		price: service.price != null ? String(service.price) : ''
	}
	modalOpen.value = true
}

async function saveService() {
	const payload = {
		name: form.value.name.trim(),
		description: form.value.description.trim(),
		price: Number(form.value.price)
	}

	if (!payload.name || !payload.description || Number.isNaN(payload.price) || payload.price <= 0) {
		$q.notify({ type: 'negative', message: 'Completa la información del servicio con datos válidos' })
		return
	}

	try {
		submitting.value = true
		if (editing.value?._id) {
			await putData(`/Service/update/${editing.value._id}`, payload)
			$q.notify({ type: 'positive', message: 'Servicio actualizado' })
		} else {
			await postData('/Service/register', payload)
			$q.notify({ type: 'positive', message: 'Servicio creado' })
		}
		modalOpen.value = false
		await fetchServices()
	} catch (err) {
		const message = err.response?.data?.msg || err.message || 'No se pudo guardar el servicio'
		$q.notify({ type: 'negative', message })
	} finally {
		submitting.value = false
	}
}

async function confirmDelete(service) {
	$q.dialog({
		title: 'Eliminar servicio',
		message: `¿Eliminar "${service.name}"?`,
		cancel: true,
		ok: { label: 'Eliminar', color: 'negative' }
	}).onOk(async () => {
		try {
			await deleteData(`/Service/delete/${service._id}`)
			$q.notify({ type: 'positive', message: 'Servicio eliminado' })
			await fetchServices()
		} catch (err) {
			const message = err.response?.data?.msg || err.message || 'No se pudo eliminar el servicio'
			$q.notify({ type: 'negative', message })
		}
	})
}

async function fetchServices() {
	try {
		loading.value = true
		const response = await getData('/Service/list')
		services.value = response.data || []
		lastUpdated.value = new Date()
	} catch (err) {
		const message = err.response?.data?.msg || err.message || 'No se pudieron cargar los servicios'
		$q.notify({ type: 'negative', message })
	} finally {
		loading.value = false
	}
}

function formatPrice(value) {
	const numeric = Number(value) || 0
	return numeric.toLocaleString('es-ES', {
		style: 'currency',
		currency: 'COP',
		minimumFractionDigits: 0
	})
}

onMounted(fetchServices)
</script>

<style scoped>
.services-page {
	min-height: 100vh;
	background: #f6f8fb;
	padding: 24px;
}

.page-header {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	align-items: center;
	gap: 16px;
	margin-bottom: 24px;
}

.header-text {
	display: flex;
	align-items: center;
	gap: 16px;
}

.header-text h1 {
	margin: 0;
	font-size: 26px;
	font-weight: 700;
	color: #1f2933;
}

.header-text p {
	margin: 4px 0 0;
	color: #617285;
}

.badge {
	width: 56px;
	height: 56px;
	border-radius: 16px;
	background: linear-gradient(135deg, #2AB7A9, #1a8f85);
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
	box-shadow: 0 12px 30px rgba(42, 183, 169, 0.25);
}

.header-actions {
	display: flex;
	gap: 12px;
}

.filters-card {
	background: white;
	border-radius: 18px;
	padding: 20px;
	box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
	margin-bottom: 24px;
}

.filters-grid {
	display: grid;
	grid-template-columns: minmax(0, 320px) minmax(0, 1fr);
	gap: 20px;
	align-items: center;
}

.filter-input :deep(.q-field__control) {
	border-radius: 12px;
	background-color: #f9fafb;
}

.stats-box {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
	gap: 16px;
	background: #f9fafb;
	border-radius: 16px;
	padding: 16px 20px;
}

.stats-box span {
	font-size: 12px;
	text-transform: uppercase;
	letter-spacing: 0.08em;
	color: #7b8794;
}

.stats-box strong {
	display: block;
	font-size: 20px;
	color: #1f2933;
	margin-top: 4px;
}

.loading-state,
.empty-state {
	background: white;
	border-radius: 18px;
	box-shadow: 0 12px 35px rgba(15, 23, 42, 0.08);
	text-align: center;
	padding: 60px 20px;
	color: #617285;
}

.empty-state h3 {
	margin: 12px 0 4px;
	color: #1f2933;
}

.service-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
	gap: 20px;
}

.service-card {
	background: white;
	border-radius: 18px;
	padding: 20px;
	box-shadow: 0 12px 32px rgba(15, 23, 42, 0.08);
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.service-card-header h3 {
	margin: 0;
	font-size: 18px;
	font-weight: 600;
	color: #1f2933;
}

.service-card-header p {
	margin: 6px 0 0;
	color: #52606d;
	line-height: 1.4;
}

.service-card-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 12px;
}

.footer-meta {
	display: flex;
	align-items: center;
	gap: 8px;
	color: #617285;
}

.footer-actions {
	display: flex;
	gap: 8px;
}

.service-modal {
	width: 480px;
	max-width: 90vw;
	border-radius: 18px;
	overflow: hidden;
}

.modal-header {
	background: linear-gradient(135deg, #2AB7A9, #1a8f85);
	color: white;
	padding: 20px 24px;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.modal-header h2 {
	margin: 0;
	font-size: 20px;
	font-weight: 600;
}

.modal-header p {
	margin: 4px 0 0;
	color: rgba(255, 255, 255, 0.85);
}

.modal-actions {
	display: flex;
	justify-content: flex-end;
	gap: 12px;
	margin-top: 12px;
}

@media (max-width: 768px) {
	.services-page {
		padding: 16px;
	}

	.page-header {
		flex-direction: column;
		align-items: flex-start;
	}

	.header-actions {
		width: 100%;
	}

	.header-actions .q-btn:first-child {
		flex: 1;
	}

	.filters-grid {
		grid-template-columns: 1fr;
	}
}
</style>
