<template>
    <q-page class="pets-page">
        <div class="page-header">
            <div class="header-text">
                <div class="badge">
                    <q-icon name="pets" size="24px" />
                </div>
                <div>
                    <h1>Mascotas registradas</h1>
                    <p>Consulta y gestiona la información de las mascotas de tus clientes.</p>
                </div>
            </div>
            <div class="header-stats">
                <div class="stat-card">
                    <span>Total</span>
                    <strong>{{ stats.total }}</strong>
                </div>
                <div class="stat-card">
                    <span>Tipos</span>
                    <strong>{{ stats.types }}</strong>
                </div>
                <div class="stat-card">
                    <span>Actualizado</span>
                    <strong>{{ lastUpdatedLabel }}</strong>
                </div>
            </div>
        </div>

        <section class="filters-card">
            <div class="filters-grid">
                <q-input
                    v-model="searchTerm"
                    filled
                    dense
                    debounce="200"
                    placeholder="Buscar por nombre, propietario o tipo"
                    class="filter-input"
                >
                    <template #prepend>
                        <q-icon name="search" color="grey-6" />
                    </template>
                    <template #append>
                        <q-btn flat dense round icon="close" @click="searchTerm = ''" v-if="searchTerm" />
                    </template>
                </q-input>

                <q-select
                    v-model="selectedType"
                    :options="typeOptions"
                    filled
                    dense
                    emit-value
                    map-options
                    class="filter-input"
                    label="Filtrar por tipo"
                >
                    <template #prepend>
                        <q-icon name="category" color="grey-6" />
                    </template>
                </q-select>

                <div class="filters-actions">
                    <q-btn color="primary" unelevated icon="refresh" label="Actualizar" @click="fetchPets" :loading="loading" />
                    <q-btn flat color="primary" icon="clear_all" label="Limpiar" @click="resetFilters" :disable="!hasFilters" />
                </div>
            </div>
        </section>

        <div v-if="loading" class="loading-state">
            <q-spinner color="primary" size="42px" class="q-mb-md" />
            <span>Cargando mascotas...</span>
        </div>

        <div v-else-if="!filteredPets.length" class="empty-state">
            <q-icon name="sentiment_dissatisfied" size="64px" color="grey-5" class="q-mb-sm" />
            <h3>No hay registros</h3>
            <p>No se encontraron mascotas que coincidan con los filtros.</p>
        </div>

        <div v-else class="pet-grid">
            <div v-for="pet in filteredPets" :key="pet._id" class="pet-card">
                <div class="pet-card-header">
                    <div class="avatar">
                        <q-icon name="pets" size="28px" />
                    </div>
                    <div class="pet-meta">
                        <h3>{{ pet.name || 'Sin nombre' }}</h3>
                        <q-chip size="sm" color="primary" text-color="white" class="q-mt-xs" dense>
                            {{ formatType(pet.type) }}
                        </q-chip>
                    </div>
                    <q-badge v-if="pet.age !== undefined && pet.age !== null" color="secondary" :label="pet.age + ' años'" />
                </div>

                <div class="pet-card-body">
                    <div class="info-row">
                        <q-icon name="person" size="18px" />
                        <span>
                            Propietario:
                            <strong>{{ pet.owner?.name || 'No asignado' }}</strong>
                        </span>
                    </div>
                    <div class="info-row" v-if="pet.owner?.phone">
                        <q-icon name="call" size="18px" />
                        <span>{{ pet.owner.phone }}</span>
                    </div>
                    <div class="info-row" v-if="pet.owner?.email">
                        <q-icon name="email" size="18px" />
                        <span>{{ pet.owner.email }}</span>
                    </div>
                    <div class="info-row" v-if="pet.owner?.address">
                        <q-icon name="place" size="18px" />
                        <span>{{ pet.owner.address }}</span>
                    </div>
                </div>

                <div class="pet-card-footer">
                    <q-chip icon="event" size="sm" class="date-chip">
                        Registrado {{ formatDate(pet.createdAt) }}
                    </q-chip>
                    <q-btn flat round icon="content_copy" size="sm" @click="copyPetInfo(pet)" :loading="copyingId === pet._id" />
                </div>
            </div>
        </div>
    </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { getData } from '../services/peticionesUser'

const $q = useQuasar()
const pets = ref([])
const clients = ref([])
const loading = ref(false)
const copyingId = ref(null)
const searchTerm = ref('')
const selectedType = ref('Todos')
const lastUpdated = ref(null)

const typeOptions = computed(() => {
    const types = Array.from(new Set(pets.value
        .map(item => (item.type || '').trim())
        .filter(Boolean)))
    return [
        { label: 'Todos', value: 'Todos' },
        ...types.map(label => ({ label, value: label }))
    ]
})

const petsWithOwner = computed(() => {
    if (!clients.value.length) {
        return pets.value
    }
    const map = new Map(clients.value.map(client => [client._id, client]))
    return pets.value.map(pet => {
        const ownerRef = pet.owner
        if (ownerRef && typeof ownerRef === 'object' && ownerRef.name) {
            return pet
        }
        if (typeof ownerRef === 'string') {
            const resolved = map.get(ownerRef)
            if (resolved) {
                return { ...pet, owner: resolved }
            }
        }
        return pet
    })
})

const stats = computed(() => {
    const total = pets.value.length
    const types = new Set()
    pets.value.forEach(p => {
        if (p.type) {
            types.add(p.type)
        }
    })
    return {
        total,
        types: types.size
    }
})

const hasFilters = computed(() => {
    return Boolean(searchTerm.value || selectedType.value !== 'Todos')
})

const filteredPets = computed(() => {
    const term = searchTerm.value.trim().toLowerCase()
    return petsWithOwner.value.filter(pet => {
        const matchesType = selectedType.value === 'Todos' || (pet.type || '') === selectedType.value
        if (!matchesType) {
            return false
        }

        if (!term) {
            return true
        }

        const haystack = [
            pet.name,
            pet.type,
            pet.owner?.name,
            pet.owner?.email,
            pet.owner?.phone,
            pet.owner?.address
        ]
            .map(value => (value || '').toLowerCase())
            .join(' ')

        return haystack.includes(term)
    })
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

async function fetchPets() {
    try {
        loading.value = true
        if (!clients.value.length) {
            await fetchClients()
        }
        const response = await getData('/Pet/list')
        pets.value = response.data || []
        lastUpdated.value = new Date()
    } catch (err) {
        const message = err.response?.data?.msg || err.message || 'No se pudieron cargar las mascotas'
        $q.notify({ type: 'negative', message })
    } finally {
        loading.value = false
    }
}

async function fetchClients() {
    try {
        const response = await getData('/Client/list')
        clients.value = response.data || []
    } catch (err) {
        const message = err.response?.data?.msg || err.message || 'No se pudieron cargar los clientes'
        $q.notify({ type: 'warning', message })
    }
}

function resetFilters() {
    searchTerm.value = ''
    selectedType.value = 'Todos'
}

function formatDate(value) {
    if (!value) {
        return 'sin fecha'
    }
    try {
        return new Date(value).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        })
    } catch {
        return 'sin fecha'
    }
}

function formatType(type) {
    if (!type) {
        return 'Sin tipo'
    }
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()
}

async function copyPetInfo(pet) {
    try {
        copyingId.value = pet._id
        const ownerName = pet.owner?.name || 'Sin propietario'
        const text = `Mascota: ${pet.name}\nTipo: ${pet.type}\nEdad: ${pet.age ?? 'N/A'}\nPropietario: ${ownerName}`
        await navigator.clipboard.writeText(text)
        $q.notify({ type: 'positive', message: 'Información copiada' })
    } catch (err) {
        const message = err.message || 'No se pudo copiar la información'
        $q.notify({ type: 'negative', message })
    } finally {
        copyingId.value = null
    }
}

onMounted(async () => {
    await fetchClients()
    await fetchPets()
})
</script>

<style scoped>
.pets-page {
    min-height: 100vh;
    background: #f6f8fb;
    padding: 24px;
}

.page-header {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
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

.header-stats {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
}

.stat-card {
    min-width: 120px;
    background: white;
    border-radius: 16px;
    padding: 12px 20px;
    box-shadow: 0 12px 35px rgba(15, 23, 42, 0.08);
}

.stat-card span {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #7b8794;
}

.stat-card strong {
    display: block;
    font-size: 22px;
    margin-top: 6px;
    color: #1f2933;
}

.filters-card {
    background: white;
    border-radius: 18px;
    padding: 20px;
    box-shadow: 0 8px 25px rgba(15, 23, 42, 0.06);
    margin-bottom: 24px;
}

.filters-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
    gap: 16px;
    align-items: center;
}

.filters-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
}

.filter-input :deep(.q-field__control) {
    border-radius: 12px;
    background-color: #f9fafb;
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

.pet-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
}

.pet-card {
    background: white;
    border-radius: 18px;
    padding: 20px;
    box-shadow: 0 12px 35px rgba(15, 23, 42, 0.08);
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.pet-card-header {
    display: flex;
    align-items: center;
    gap: 16px;
}

.avatar {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: linear-gradient(135deg, #2AB7A9, #1a8f85);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    box-shadow: 0 10px 25px rgba(42, 183, 169, 0.3);
}

.pet-meta h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #1f2933;
}

.pet-card-body {
    display: flex;
    flex-direction: column;
    gap: 10px;
    color: #52606d;
}

.info-row {
    display: flex;
    align-items: center;
    gap: 10px;
}

.info-row q-icon {
    color: #2AB7A9;
}

.pet-card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
}

.date-chip {
    background: rgba(42, 183, 169, 0.12);
    color: #1a8f85;
}

@media (max-width: 768px) {
    .pets-page {
        padding: 16px;
    }

    .page-header {
        flex-direction: column;
        align-items: flex-start;
    }

    .header-stats {
        width: 100%;
        justify-content: space-between;
    }

    .filters-actions {
        justify-content: stretch;
    }

    .filters-actions .q-btn {
        flex: 1;
    }
}
</style>
