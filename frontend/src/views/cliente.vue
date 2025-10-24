<template>
    <q-page class="cliente-page">
        <div class="dashboard-container">
            <!-- Header -->
            <header class="dashboard-header">
                <div class="header-left">
                    <div class="logo-badge">
                        <i class="material-icons">pets</i>
                    </div>
                    <div>
                        <h1>VetTime</h1>
                        <p>Panel del Cliente</p>
                    </div>
                </div>
                <div class="header-right">
                    <span class="user-name">{{ userName }}</span>
                    <button class="btn-logout" @click="logout">
                        <i class="material-icons">logout</i>
                        Cerrar sesión
                    </button>
                </div>
            </header>

            <div class="dashboard-grid">
                <!-- Sidebar -->
                <nav class="sidebar">
                    <button class="nav-item" :class="{ active: activeSection === 'mis-mascotas' }"
                        @click="activeSection = 'mis-mascotas'">
                        <i class="material-icons">pets</i>
                        <span>Mis Mascotas</span>
                    </button>
                    <button class="nav-item" :class="{ active: activeSection === 'agendar-cita' }"
                        @click="activeSection = 'agendar-cita'">
                        <i class="material-icons">event</i>
                        <span>Agendar Cita</span>
                    </button>
                    <button class="nav-item" :class="{ active: activeSection === 'mis-citas' }"
                        @click="activeSection = 'mis-citas'">
                        <i class="material-icons">calendar_today</i>
                        <span>Mis Citas</span>
                    </button>
                    <button class="nav-item" :class="{ active: activeSection === 'historial' }"
                        @click="activeSection = 'historial'">
                        <i class="material-icons">history</i>
                        <span>Historial</span>
                    </button>
                </nav>

                <!-- Main Content -->
                <main class="main-content">
                    <transition name="fade" mode="out-in">
                        <!-- Mis Mascotas -->
                        <section v-if="activeSection === 'mis-mascotas'" key="mascotas" class="content-section">
                            <div class="section-header">
                                <h2>Mis Mascotas</h2>
                                <button class="btn-primary" @click="openAddPetModal">
                                    <i class="material-icons">add</i>
                                    Agregar Mascota
                                </button>
                            </div>

                            <div v-if="pets.length" class="pets-grid">
                                <div v-for="pet in pets" :key="resolvePetId(pet)" class="pet-card">
                                    <div class="pet-icon-circle" :style="{ background: getPetColor(pet.type) }">
                                        <i class="material-icons">{{ getPetIcon(pet.type) }}</i>
                                    </div>
                                    <div class="pet-info">
                                        <h3>{{ pet.name }}</h3>
                                        <p><strong>Tipo:</strong> {{ pet.type }}</p>
                                        <p><strong>Edad:</strong> {{ pet.age }} años</p>
                                    </div>
                                    <div class="pet-actions">
                                        <button class="btn-icon" @click="editPet(pet)" title="Editar">
                                            <i class="material-icons">edit</i>
                                        </button>
                                        <button class="btn-icon btn-delete" @click="deletePet(resolvePetId(pet))"
                                            title="Eliminar">
                                            <i class="material-icons">delete</i>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div v-else class="empty-state">
                                <i class="material-icons">pets</i>
                                <h3>No tienes mascotas registradas</h3>
                                <p>Agrega tu primera mascota usando el botón de arriba</p>
                            </div>
                        </section>

                        <section v-else-if="activeSection === 'agendar-cita'" key="agendar" class="content-section">
                            <div class="section-header">
                                <div>
                                    <h2>Agendar Nueva Cita</h2>
                                    <p class="section-subtitle">Completa los datos para registrar una nueva cita</p>
                                </div>
                            </div>

                            <q-form @submit.prevent="agendarCita" class="appointment-form">
                                <div class="form-grid">
                                    <div class="form-group">
                                        <label class="form-label">
                                            <i class="material-icons">pets</i>
                                            Selecciona tu mascota
                                        </label>
                                        <q-select v-model="appointment.pet_id" :options="petOptions" outlined emit-value
                                            map-options :rules="[val => !!val || 'Selecciona una mascota']"
                                            class="custom-select" placeholder="Elige una mascota">
                                            <template v-slot:prepend>
                                                <q-icon name="pets" color="primary" />
                                            </template>
                                        </q-select>
                                    </div>

                                    <div class="form-group">
                                        <label class="form-label">
                                            <i class="material-icons">medical_services</i>
                                            Tipo de servicio
                                        </label>
                                        <q-select
                                            v-model="appointment.service_ids"
                                            :options="serviceOptions"
                                            outlined
                                            emit-value
                                            map-options
                                            multiple
                                            use-chips
                                            :rules="[val => Array.isArray(val) && val.length > 0 || 'Selecciona al menos un servicio']"
                                            class="custom-select"
                                            placeholder="Elige uno o más servicios"
                                        >
                                            <template v-slot:prepend>
                                                <q-icon name="medical_services" color="primary" />
                                            </template>
                                        </q-select>
                                    </div>
                                </div>

                                <div class="form-grid">
                                    <div class="form-group">
                                        <label class="form-label">
                                            <i class="material-icons">calendar_today</i>
                                            Fecha de la cita
                                        </label>
                                        <q-input v-model="appointment.appointmentDate" type="date" outlined
                                            :min="minDate" :rules="[val => !!val || 'Selecciona la fecha']"
                                            class="custom-input">
                                            <template v-slot:prepend>
                                                <q-icon name="calendar_today" color="primary" />
                                            </template>
                                        </q-input>
                                    </div>

                                    <div class="form-group">
                                        <label class="form-label">
                                            <i class="material-icons">schedule</i>
                                            Hora de la cita
                                        </label>
                                        <q-input v-model="appointment.appointmentTime" type="time" outlined
                                            :rules="[val => !!val || 'Selecciona la hora']" class="custom-input">
                                            <template v-slot:prepend>
                                                <q-icon name="schedule" color="primary" />
                                            </template>
                                        </q-input>
                                    </div>
                                </div>

                                <div v-if="selectedServices.length" class="service-summary">
                                    <div class="summary-icon">
                                        <i class="material-icons">receipt</i>
                                    </div>
                                    <div class="summary-content">
                                        <div class="summary-title">Resumen de la cita</div>
                                        <div class="summary-services">
                                            <div
                                                v-for="service in selectedServices"
                                                :key="`sel-${resolveServiceId(service)}`"
                                                class="summary-service-row"
                                            >
                                                <span class="summary-service-name">{{ service.name }}</span>
                                                <span class="summary-service-price">${{ formatPrice(service.price) }}</span>
                                            </div>
                                        </div>
                                        <div class="summary-price">Total: ${{ formatPrice(selectedServicesTotal) }}</div>
                                    </div>
                                </div>

                                <div class="form-actions">
                                    <button type="button" class="btn-secondary" @click="resetAppointmentForm">
                                        <i class="material-icons">close</i>
                                        Limpiar
                                    </button>
                                    <button type="submit" class="btn-primary" :disabled="loadingAppointment">
                                        <i class="material-icons">{{ loadingAppointment ? 'hourglass_empty' : 'event'
                                            }}</i>
                                        {{ loadingAppointment ? 'Agendando...' : 'Agendar cita' }}
                                    </button>
                                </div>
                            </q-form>
                        </section>

                        <section v-else-if="activeSection === 'mis-citas'" key="citas" class="content-section">
                            <div class="section-header">
                                <div>
                                    <h2>Mis Citas Programadas</h2>
                                    <p class="section-subtitle">Consulta el estado de tus próximas citas</p>
                                </div>
                            </div>

                            <div v-if="upcomingAppointments.length" class="appointments-list">
                                <div v-for="apt in upcomingAppointments" :key="resolveAppointmentId(apt)"
                                    class="appointment-item">
                                    <div class="appointment-header">
                                        <div class="appointment-date">
                                            <i class="material-icons">event</i>
                                            <span>{{ formatDateTime(apt.date) }}</span>
                                        </div>
                                        <span :class="['status-badge', `status-${normalizeStatus(apt.status)}`]">
                                            {{ getStatusText(apt.status) }}
                                        </span>
                                    </div>

                                    <div class="appointment-body">
                                        <div class="appointment-details">
                                            <div class="detail-item">
                                                <i class="material-icons">pets</i>
                                                <span class="detail-label">Mascota:</span>
                                                <span class="detail-value">{{ getPetName(apt.pet_id) }}</span>
                                            </div>
                                            <div class="detail-item">
                                                <i class="material-icons">medical_services</i>
                                                <span class="detail-label">Servicio:</span>
                                                <span class="detail-value">{{ getServiceName(apt.service_id) }}</span>
                                            </div>
                                            <div class="detail-item">
                                                <i class="material-icons">attach_money</i>
                                                <span class="detail-label">Monto:</span>
                                                <span class="detail-value">${{ formatPrice(apt.total_amount) }}</span>
                                            </div>
                                        </div>

                                        <div class="appointment-actions">
                                            <button class="btn-icon-action" @click="viewAppointment(apt)"
                                                title="Ver detalles">
                                                <i class="material-icons">visibility</i>
                                            </button>
                                            <button v-if="canCancelAppointment(apt.status)"
                                                class="btn-icon-action btn-danger"
                                                @click="cancelAppointment(resolveAppointmentId(apt))"
                                                title="Cancelar cita">
                                                <i class="material-icons">cancel</i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div v-else class="empty-state">
                                <i class="material-icons">event_busy</i>
                                <h3>No tienes citas programadas</h3>
                                <p>Agenda tu primera cita usando la sección "Agendar Cita"</p>
                            </div>
                        </section>

                        <section v-else key="historial" class="content-section">
                            <div class="section-header">
                                <div>
                                    <h2>Historial de Citas</h2>
                                    <p class="section-subtitle">Consulta todas tus citas anteriores</p>
                                </div>
                            </div>

                            <div v-if="historyAppointments.length" class="appointments-list">
                                <div v-for="apt in historyAppointments" :key="resolveAppointmentId(apt)"
                                    class="appointment-item">
                                    <div class="appointment-header">
                                        <div class="appointment-date">
                                            <i class="material-icons">event</i>
                                            <span>{{ formatDateTime(apt.date) }}</span>
                                        </div>
                                        <span :class="['status-badge', `status-${normalizeStatus(apt.status)}`]">
                                            {{ getStatusText(apt.status) }}
                                        </span>
                                    </div>

                                    <div class="appointment-body">
                                        <div class="appointment-details">
                                            <div class="detail-item">
                                                <i class="material-icons">pets</i>
                                                <span class="detail-label">Mascota:</span>
                                                <span class="detail-value">{{ getPetName(apt.pet_id) }}</span>
                                            </div>
                                            <div class="detail-item">
                                                <i class="material-icons">medical_services</i>
                                                <span class="detail-label">Servicio:</span>
                                                <span class="detail-value">{{ getServiceName(apt.service_id) }}</span>
                                            </div>
                                            <div class="detail-item">
                                                <i class="material-icons">attach_money</i>
                                                <span class="detail-label">Monto:</span>
                                                <span class="detail-value">${{ formatPrice(apt.total_amount) }}</span>
                                            </div>
                                        </div>

                                        <div class="appointment-actions">
                                            <button class="btn-icon-action" @click="viewAppointment(apt)"
                                                title="Ver detalles">
                                                <i class="material-icons">visibility</i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div v-else class="empty-state">
                                <i class="material-icons">history</i>
                                <h3>Historial vacío</h3>
                                <p>Aquí aparecerán tus citas completadas o canceladas</p>
                            </div>
                        </section>
                    </transition>
                </main>
            </div>
        </div>

        <q-dialog v-model="showAddPetModal" persistent transition-show="slide-up" transition-hide="slide-down">
            <q-card class="modal-card-pet">
                <q-card-section class="modal-header-pet">
                    <div class="row items-center q-gutter-sm">
                        <q-icon :name="editingPet ? 'edit' : 'pets'" size="32px" />
                        <div class="text-h5 text-weight-bold">{{ editingPet ? 'Editar Mascota' : 'Nueva Mascota' }}
                        </div>
                    </div>
                    <q-btn icon="close" flat round dense color="white" v-close-popup @click="closeAddPetModal" />
                </q-card-section>

                <q-card-section class="modal-body-pet">
                    <q-form @submit.prevent="savePet" class="column q-gutter-lg">
                        <div class="form-field">
                            <q-input v-model="newPet.name" label="Nombre de la Mascota" placeholder="Ej: Firulais"
                                outlined :rules="[val => !!val || 'El nombre es obligatorio']" stack-label
                                class="custom-input">
                                <template v-slot:prepend>
                                    <q-icon name="label" color="primary" />
                                </template>
                            </q-input>
                        </div>

                        <div class="row q-col-gutter-lg">
                            <div class="col-12 col-sm-6">
                                <q-select v-model="newPet.type" :options="petTypeOptions" label="Tipo de Mascota"
                                    outlined emit-value map-options :rules="[val => !!val || 'Selecciona el tipo']"
                                    stack-label class="custom-input">
                                    <template v-slot:prepend>
                                        <q-icon name="category" color="primary" />
                                    </template>
                                </q-select>
                            </div>
                            <div class="col-12 col-sm-6">
                                <q-input v-model="newPet.age" type="number" label="Edad (años)" outlined
                                    :rules="[val => val !== '' || 'Ingresa la edad']" min="0" max="30" stack-label
                                    class="custom-input">
                                    <template v-slot:prepend>
                                        <q-icon name="cake" color="primary" />
                                    </template>
                                </q-input>
                            </div>
                        </div>

                        <div class="row justify-end q-gutter-md q-mt-md">
                            <q-btn outline label="Cancelar" color="grey-7" v-close-popup @click="closeAddPetModal"
                                padding="10px 28px" no-caps />
                            <q-btn type="submit" color="primary" unelevated :loading="loadingPet"
                                :label="editingPet ? 'Guardar cambios' : 'Agregar mascota'"
                                :icon="editingPet ? 'save' : 'add'" padding="10px 28px" no-caps />
                        </div>
                    </q-form>
                </q-card-section>
            </q-card>
        </q-dialog>
    </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { getData, postData, putData, deleteData } from '../services/peticionesUser.js';

const router = useRouter();
const $q = useQuasar();
const CLIENT_SESSION_KEY = 'clientSession';

const formatPrice = (price = 0) => new Intl.NumberFormat('es-CO').format(price || 0);
const resolvePetId = (pet) => pet?._id || pet?.id;
const resolveAppointmentId = (apt) => apt?._id || apt?.id;
const resolveServiceId = (service) => service?._id || service?.id;
const normalizeStatus = (status) => String(status || '').toLowerCase();
const HISTORY_STATUSES = new Set([
    'completed',
    'completada',
    'terminada',
    'terminado',
    'cancelled',
    'cancelada',
    'cancelado',
    'anulada',
    'anulado'
]);

const petAvatarColor = (type = '') => {
    const map = {
        Perro: 'primary',
        Gato: 'deep-orange-6',
        Ave: 'teal-6',
        Conejo: 'purple-6',
        Hamster: 'amber-7',
        Otro: 'cyan-7'
    };
    return map[type] || 'primary';
};

const statusColor = (status = '') => {
    const key = normalizeStatus(status);
    const map = {
        pending: 'warning',
        pendiente: 'warning',
        confirmed: 'positive',
        confirmada: 'positive',
        completed: 'primary',
        completada: 'primary',
    'terminado': 'primary',
        cancelled: 'negative',
        cancelada: 'negative',
    'cancelado': 'negative',
    'terminada': 'primary',
    'anulada': 'negative',
    'anulado': 'negative'
    };
    return map[key] || 'primary';
};

const petTypeOptions = [
    { label: 'Perro', value: 'Perro' },
    { label: 'Gato', value: 'Gato' },
    { label: 'Ave', value: 'Ave' },
    { label: 'Conejo', value: 'Conejo' },
    { label: 'Hamster', value: 'Hamster' },
    { label: 'Otro', value: 'Otro' }
];

// Estado
const activeSection = ref('mis-mascotas');
const userName = ref('');
const showAddPetModal = ref(false);
const editingPet = ref(null);
const loadingPet = ref(false);
const loadingAppointment = ref(false);

// Mascotas
const pets = ref([]);
const ownerId = ref('');
const newPet = ref({
    name: '',
    type: '',
    age: '',
    owner: ''
});

// Citas
const appointments = ref([]);
const clientId = ref('');
const appointment = ref({
    pet_id: '',
    service_ids: [],
    appointmentDate: '',
    appointmentTime: ''
});

// Servicios disponibles
const services = ref([]);

const petOptions = computed(() =>
    pets.value.map(pet => ({
        label: pet.name,
        value: resolvePetId(pet)
    }))
);

const serviceOptions = computed(() =>
    services.value.map(service => ({
        label: `${service.name} - $${formatPrice(service.price)}`,
        value: resolveServiceId(service)
    }))
);

const upcomingAppointments = computed(() =>
    appointments.value.filter(apt => !HISTORY_STATUSES.has(normalizeStatus(apt.status)))
);

const historyAppointments = computed(() =>
    appointments.value.filter(apt => HISTORY_STATUSES.has(normalizeStatus(apt.status)))
);

// Notificaciones
const showNotification = (message, type = 'success') => {
    const typeMap = {
        success: 'positive',
        error: 'negative',
        warning: 'warning',
        info: 'info'
    };

    $q.notify({
        message,
        type: typeMap[type] || 'info',
        position: 'top-right',
        timeout: 3500
    });
};

// Fecha mínima para citas
const minDate = computed(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
});

// Servicio seleccionado
const selectedServices = computed(() => {
    const ids = Array.isArray(appointment.value.service_ids) ? appointment.value.service_ids : [];
    return ids
        .map(id => services.value.find(service => resolveServiceId(service) === id))
        .filter(Boolean);
});

const selectedServicesTotal = computed(() =>
    selectedServices.value.reduce((acc, service) => acc + Number(service?.price || 0), 0)
);

// Funciones

const savePet = async () => {
    loadingPet.value = true;

    try {
        if (!ownerId.value) {
            showNotification('No se encontró la sesión del cliente. Inicia sesión nuevamente.', 'error');
            return;
        }

        // Asignar el owner ID antes de enviar
        const petData = {
            name: newPet.value.name,
            type: newPet.value.type,
            age: Number(newPet.value.age),
            owner: ownerId.value
        };

        if (editingPet.value) {
            // Actualizar mascota existente
            const petId = resolvePetId(editingPet.value);
            await putData(`Pet/update/${petId}`, petData);
            await loadPets();
            showNotification('Mascota actualizada exitosamente');
        } else {
            // Registrar nueva mascota
            await postData('Pet/register', petData);
            await loadPets();
            showNotification('Mascota agregada exitosamente');
        }

        closeAddPetModal();
    } catch (error) {
        console.error('Error al guardar mascota:', error);
        const errorMessage = error.response?.data?.message || 'Error al guardar la mascota';
        showNotification(errorMessage, 'error');
    } finally {
        loadingPet.value = false;
    }
};

const editPet = (pet) => {
    editingPet.value = pet;
    newPet.value = {
        name: pet.name || '',
        type: pet.type || '',
        age: pet.age ?? '',
        owner: ownerId.value
    };
    showAddPetModal.value = true;
};

const deletePet = (petId) => {
    $q.dialog({
        title: 'Eliminar mascota',
        message: '¿Estás seguro de eliminar esta mascota?',
        cancel: { label: 'Cancelar', flat: true, color: 'grey-7' },
        ok: { label: 'Eliminar', color: 'negative' },
        persistent: true,
        focus: 'cancel'
    }).onOk(async () => {
        try {
            await deleteData(`Pet/delete/${petId}`);
            await loadPets();
            showNotification('Mascota eliminada exitosamente', 'warning');
        } catch (error) {
            console.error('Error al eliminar mascota:', error);
            const errorMessage = error.response?.data?.message || 'Error al eliminar la mascota';
            showNotification(errorMessage, 'error');
        }
    });
};

const closeAddPetModal = () => {
    showAddPetModal.value = false;
    editingPet.value = null;
    newPet.value = {
        name: '',
        type: '',
        age: '',
        owner: ''
    };
};

const openAddPetModal = () => {
    closeAddPetModal();
    showAddPetModal.value = true;
};

const agendarCita = async () => {
    if (!clientId.value) {
        showNotification('No se encontró la sesión del cliente. Inicia sesión nuevamente.', 'error');
        return;
    }

    if (!appointment.value.pet_id || !Array.isArray(appointment.value.service_ids) || appointment.value.service_ids.length === 0 || !appointment.value.appointmentDate || !appointment.value.appointmentTime) {
        showNotification('Completa todos los campos antes de agendar la cita.', 'warning');
        return;
    }

    loadingAppointment.value = true;

    try {
        // Combinar fecha y hora
        const dateTimeString = `${appointment.value.appointmentDate}T${appointment.value.appointmentTime}:00`;
        const appointmentDateTime = new Date(dateTimeString);
        if (Number.isNaN(appointmentDateTime.getTime())) {
            showNotification('La fecha o la hora seleccionadas no son válidas.', 'warning');
            loadingAppointment.value = false;
            return;
        }
        const isoDate = appointmentDateTime.toISOString();

        // Preparar datos para enviar al backend
        const chosenServices = selectedServices.value;
        if (!chosenServices.length) {
            showNotification('Selecciona al menos un servicio válido.', 'warning');
            loadingAppointment.value = false;
            return;
        }

        const totalAmount = chosenServices.reduce((acc, svc) => acc + Number(svc?.price || 0), 0);
        if (!Number.isFinite(totalAmount)) {
            showNotification('No se pudo calcular el valor de los servicios seleccionados.', 'warning');
            loadingAppointment.value = false;
            return;
        }

        const appointmentData = {
            client_id: clientId.value,
            pet_id: appointment.value.pet_id,
            service_id: [...appointment.value.service_ids],
            date: isoDate,
            status: 'pending',
            total_amount: totalAmount
        };

        await postData('Quote/register', appointmentData);
        await loadAppointments();

        showNotification('Cita agendada exitosamente');
        resetAppointmentForm();
        activeSection.value = 'mis-citas';
    } catch (error) {
        console.error('Error al agendar cita:', error);
        const errorMessage = error.response?.data?.msg || error.response?.data?.message || 'Error al agendar la cita';
        showNotification(errorMessage, 'error');
    } finally {
        loadingAppointment.value = false;
    }
};

const resetAppointmentForm = () => {
    appointment.value = {
        pet_id: '',
        service_ids: [],
        appointmentDate: '',
        appointmentTime: ''
    };
};

const cancelAppointment = (id) => {
    $q.dialog({
        title: 'Cancelar cita',
        message: '¿Deseas cancelar esta cita?',
        cancel: { label: 'No', flat: true, color: 'grey-7' },
        ok: { label: 'Cancelar cita', color: 'negative' },
        persistent: true
    }).onOk(async () => {
        try {
            await putData(`Quote/update/${id}`, { status: 'cancelled' });
            await loadAppointments();
            showNotification('Cita cancelada exitosamente', 'warning');
        } catch (error) {
            console.error('Error al cancelar cita:', error);
            const errorMessage = error.response?.data?.message || 'Error al cancelar la cita';
            showNotification(errorMessage, 'error');
        }
    });
};

const viewAppointment = (apt) => {
    const petName = getPetName(apt.pet_id);
    const serviceName = getServiceName(apt.service_id);
    const formattedDate = formatDateTime(apt.date);
    const amount = formatPrice(apt.total_amount);
    const statusText = getStatusText(apt.status);

    $q.notify({
        message: `<strong>Detalles de la cita</strong><br>Mascota: ${petName}<br>Servicio: ${serviceName}<br>Fecha: ${formattedDate}<br>Monto: $${amount}<br>Estado: ${statusText}`,
        type: 'info',
        position: 'top-right',
        timeout: 6000,
        html: true
    });
};

const getPetName = (petRef) => {
    if (typeof petRef === 'object' && petRef !== null) {
        if (petRef.name) {
            return petRef.name;
        }
        return getPetName(resolvePetId(petRef));
    }

    const pet = pets.value.find(p => resolvePetId(p) === petRef);
    return pet ? pet.name : 'Desconocida';
};

const resolveServiceName = (serviceRef) => {
    if (!serviceRef) {
        return null;
    }
    if (typeof serviceRef === 'object') {
        if (serviceRef.name) {
            return serviceRef.name;
        }
        return resolveServiceName(resolveServiceId(serviceRef));
    }

    const service = services.value.find(s => resolveServiceId(s) === serviceRef);
    return service ? service.name : null;
};

const getServiceName = (serviceRef) => {
    if (Array.isArray(serviceRef)) {
        const names = serviceRef
            .map(item => resolveServiceName(item))
            .filter(Boolean);
        return names.length ? names.join(', ') : 'Desconocido';
    }

    return resolveServiceName(serviceRef) || 'Desconocido';
};

const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const canCancelAppointment = (status) => {
    const key = normalizeStatus(status);
    return key === 'pending' || key === 'pendiente' || key === 'confirmed' || key === 'confirmada';
};

const getStatusText = (status) => {
    const key = normalizeStatus(status);
    const statusMap = {
        'pending': 'Pendiente',
        'pendiente': 'Pendiente',
        'confirmed': 'Confirmada',
        'confirmada': 'Confirmada',
        'completed': 'Completada',
        'completada': 'Completada',
        'terminado': 'Completada',
        'cancelled': 'Cancelada',
        'cancelada': 'Cancelada',
        'terminada': 'Completada',
        'anulada': 'Cancelada',
        'cancelado': 'Cancelada',
        'anulado': 'Cancelada'
    };
    return statusMap[key] || status;
};

const getPetIcon = (type) => {
    const icons = {
        'Perro': 'pets',
        'Gato': 'favorite',
        'Ave': 'flutter_dash',
        'Conejo': 'cruelty_free',
        'Hamster': 'cruelty_free',
        'Otro': 'pets'
    };
    return icons[type] || 'pets';
};

const getPetColor = (type) => {
    const colors = {
        'Perro': 'linear-gradient(135deg, #2AB7A9, #1a8f85)',
        'Gato': 'linear-gradient(135deg, #FF6B6B, #e74c3c)',
        'Ave': 'linear-gradient(135deg, #4ECDC4, #44A08D)',
        'Conejo': 'linear-gradient(135deg, #9b59b6, #8e44ad)',
        'Hamster': 'linear-gradient(135deg, #f39c12, #e67e22)',
        'Otro': 'linear-gradient(135deg, #3498db, #2980b9)'
    };
    return colors[type] || 'linear-gradient(135deg, #2AB7A9, #1a8f85)';
};

const logout = () => {
    $q.dialog({
        title: 'Cerrar sesión',
        message: '¿Deseas cerrar sesión?',
        cancel: { label: 'Cancelar', flat: true },
        ok: { label: 'Aceptar', color: 'primary' },
        persistent: true
    }).onOk(() => {
        localStorage.removeItem(CLIENT_SESSION_KEY);
        router.push('/login-cliente');
    });
};

// Cargar servicios disponibles
const loadServices = async () => {
    try {
        const response = await getData('Service/list');
        const payload = response.data?.data ?? response.data;
        services.value = Array.isArray(payload) ? payload : [];
    } catch (error) {
        console.error('Error al cargar servicios:', error);
        if (error.response?.status !== 404) {
            showNotification('Error al cargar los servicios', 'error');
        }
    }
};

// Cargar mascotas del cliente
const loadPets = async () => {
    if (!ownerId.value) {
        pets.value = [];
        return;
    }

    try {
        const response = await getData(`Pet/list?idOwner=${encodeURIComponent(ownerId.value)}`);
        const payload = response.data?.data ?? response.data;
        const serverPets = Array.isArray(payload) ? payload : [];
        pets.value = serverPets;
    } catch (error) {
        console.error('Error al cargar mascotas:', error);
        if (error.response?.status !== 404) {
            showNotification('Error al cargar las mascotas', 'error');
        }
    }
};

// Cargar citas del cliente
const loadAppointments = async () => {
    if (!clientId.value) {
        appointments.value = [];
        return;
    }

    try {
        const response = await getData(`Quote/list?client_id=${encodeURIComponent(clientId.value)}`);
        const payload = response.data?.data ?? response.data;
        const rawQuotes = Array.isArray(payload?.msg) ? payload.msg : (Array.isArray(payload) ? payload : []);
        appointments.value = rawQuotes;
    } catch (error) {
        console.error('Error al cargar citas:', error);
        if (error.response?.status !== 404) {
            showNotification('Error al cargar las citas', 'error');
        }
    }
};

// Cargar datos al montar
onMounted(async () => {
    const storedSession = localStorage.getItem(CLIENT_SESSION_KEY);

    if (!storedSession) {
        router.push('/login-cliente');
        return;
    }

    try {
        const parsedSession = JSON.parse(storedSession);
        ownerId.value = parsedSession?.id || '';
        clientId.value = parsedSession?.id || '';
        userName.value = parsedSession?.name || 'Cliente';
    } catch (sessionError) {
        console.error('Error al leer la sesión del cliente:', sessionError);
        localStorage.removeItem(CLIENT_SESSION_KEY);
        router.push('/login-cliente');
        return;
    }

    if (!ownerId.value) {
        router.push('/login-cliente');
        return;
    }

    await loadServices();
    await loadPets();
    await loadAppointments();
});
</script>

<style scoped>
/* ========== Variables ========== */
:root {
    --primary: #2AB7A9;
    --primary-dark: #1a8f85;
    --primary-light: #35c9ba;
    --danger: #e74c3c;
    --success: #27ae60;
    --warning: #f39c12;
    --white: #ffffff;
    --gray-50: #f9fafb;
    --gray-100: #f3f4f6;
    --gray-200: #e5e7eb;
    --gray-300: #d1d5db;
    --gray-600: #6b7280;
    --gray-700: #374151;
    --gray-900: #111827;
}

/* ========== Base ========== */
.cliente-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #2AB7A9 0%, #1a8f85 100%);
    padding: 24px;
    position: relative;
    overflow-x: hidden;
}

.cliente-page::before {
    content: '';
    position: absolute;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
    top: -150px;
    right: -150px;
    animation: float 10s ease-in-out infinite;
}

@keyframes float {

    0%,
    100% {
        transform: translateY(0) scale(1);
    }

    50% {
        transform: translateY(-20px) scale(1.05);
    }
}

.dashboard-container {
    max-width: 1400px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
}

/* ========== Header ========== */
.dashboard-header {
    background: white;
    border-radius: 20px;
    padding: 20px 30px;
    margin-bottom: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(10px);
}

.header-left {
    display: flex;
    align-items: center;
    gap: 16px;
}

.logo-badge {
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, #2AB7A9, #1a8f85);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 20px rgba(42, 183, 169, 0.4);
    animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {

    0%,
    100% {
        transform: scale(1);
        box-shadow: 0 4px 20px rgba(42, 183, 169, 0.4);
    }

    50% {
        transform: scale(1.05);
        box-shadow: 0 6px 25px rgba(42, 183, 169, 0.6);
    }
}

.logo-badge .material-icons {
    font-size: 28px;
    color: white;
}

.header-left h1 {
    font-size: 24px;
    font-weight: 700;
    color: #2AB7A9;
    margin: 0;
    letter-spacing: -0.5px;
}

.header-left p {
    font-size: 14px;
    color: #6b7280;
    margin: 0;
}

.header-right {
    display: flex;
    align-items: center;
    gap: 16px;
}

.user-name {
    font-size: 15px;
    font-weight: 600;
    color: var(--gray-900);
}

.btn-logout {
    padding: 10px 20px;
    background: linear-gradient(135deg, #2AB7A9, #1a8f85);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(42, 183, 169, 0.35);
}

.btn-logout:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 25px rgba(42, 183, 169, 0.5);
    background: linear-gradient(135deg, #35c9ba, #2AB7A9);
}

.btn-logout .material-icons {
    font-size: 18px;
}

/* ========== Grid Layout ========== */
.dashboard-grid {
    display: grid;
    grid-template-columns: 260px 1fr;
    gap: 30px;
}

/* ========== Sidebar ========== */
.sidebar {
    background: white;
    border-radius: 20px;
    padding: 20px;
    height: fit-content;
    position: sticky;
    top: 24px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
}

.nav-item {
    width: 100%;
    padding: 14px 18px;
    background: transparent;
    border: none;
    border-radius: 12px;
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-bottom: 8px;
    font-size: 15px;
    font-weight: 500;
    color: var(--gray-700);
}

.nav-item .material-icons {
    font-size: 22px;
}

.nav-item:hover {
    background: rgba(42, 183, 169, 0.1);
    transform: translateX(4px);
}

.nav-item.active {
    background: linear-gradient(135deg, #2AB7A9, #1a8f85);
    color: white;
    box-shadow: 0 4px 15px rgba(42, 183, 169, 0.4);
}

/* ========== Main Content ========== */
.main-content {
    min-height: 500px;
}

.content-section {
    background: white;
    border-radius: 20px;
    padding: 30px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
    animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
}

.section-header h2 {
    font-size: 28px;
    font-weight: 700;
    color: var(--gray-900);
    margin: 0;
}

.section-subtitle {
    font-size: 15px;
    color: #6b7280;
    margin: 8px 0 0;
}

/* ========== Formularios ========== */
.appointment-form {
    max-width: 800px;
}

.form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin-bottom: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.form-label {
    font-size: 14px;
    font-weight: 600;
    color: var(--gray-700);
    display: flex;
    align-items: center;
    gap: 8px;
}

.form-label .material-icons {
    font-size: 18px;
    color: #2AB7A9;
}

.custom-select,
.custom-input {
    width: 100%;
}

.custom-select :deep(.q-field__control),
.custom-input :deep(.q-field__control) {
    border-radius: 12px;
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    transition: all 0.3s ease;
    min-height: 48px;
}

.custom-select :deep(.q-field__control):hover,
.custom-input :deep(.q-field__control):hover {
    box-shadow: 0 4px 12px rgba(42, 183, 169, 0.15);
}

.custom-select :deep(.q-field--focused) .q-field__control,
.custom-input :deep(.q-field--focused) .q-field__control {
    box-shadow: 0 4px 16px rgba(42, 183, 169, 0.3);
    border-color: #2AB7A9 !important;
}

/* Resumen del servicio */
.service-summary {
    background: linear-gradient(135deg, #2AB7A9, #1a8f85);
    border-radius: 16px;
    padding: 24px;
    display: flex;
    align-items: center;
    gap: 20px;
    margin: 24px 0;
    color: white;
    box-shadow: 0 4px 15px rgba(42, 183, 169, 0.3);
}

.summary-icon {
    width: 60px;
    height: 60px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.summary-icon .material-icons {
    font-size: 32px;
}

.summary-content {
    flex: 1;
}

.summary-title {
    font-size: 14px;
    opacity: 0.9;
    margin-bottom: 4px;
}

.summary-services {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 10px;
}

.summary-service-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 15px;
    color: rgba(255, 255, 255, 0.92);
}

.summary-service-name {
    font-weight: 600;
}

.summary-service-price {
    font-weight: 600;
}

.summary-service {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 6px;
}

.summary-price {
    font-size: 28px;
    font-weight: 800;
    letter-spacing: -0.5px;
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 24px;
}

.btn-secondary {
    padding: 12px 24px;
    background: white;
    color: var(--gray-700);
    border: 2px solid var(--gray-300);
    border-radius: 12px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;
}

.btn-secondary:hover {
    background: var(--gray-100);
    border-color: var(--gray-400);
    transform: translateY(-1px);
}

.btn-secondary .material-icons {
    font-size: 18px;
}

/* ========== Lista de Citas ========== */
.appointments-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.appointment-item {
    background: white;
    border: 2px solid var(--gray-200);
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.3s ease;
}

.appointment-item:hover {
    border-color: #2AB7A9;
    box-shadow: 0 6px 20px rgba(42, 183, 169, 0.15);
    transform: translateY(-2px);
}

.appointment-header {
    background: linear-gradient(135deg, #f8fafc, #f1f5f9);
    padding: 16px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid var(--gray-200);
}

.appointment-date {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 16px;
    font-weight: 600;
    color: var(--gray-900);
}

.appointment-date .material-icons {
    color: #2AB7A9;
    font-size: 22px;
}

.status-badge {
    padding: 6px 16px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.status-pending,
.status-pendiente {
    background: #fef3c7;
    color: #92400e;
}

.status-confirmed,
.status-confirmada {
    background: #d1fae5;
    color: #065f46;
}

.status-completed,
.status-completada,
.status-terminada,
.status-terminado {
    background: #dbeafe;
    color: #1e40af;
}

.status-cancelled,
.status-cancelada,
.status-cancelado,
.status-anulada,
.status-anulado {
    background: #fee2e2;
    color: #991b1b;
}

.appointment-body {
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
}

.appointment-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.detail-item {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
}

.detail-item .material-icons {
    font-size: 18px;
    color: #2AB7A9;
}

.detail-label {
    color: var(--gray-600);
    font-weight: 500;
}

.detail-value {
    color: var(--gray-900);
    font-weight: 600;
}

.appointment-actions {
    display: flex;
    gap: 8px;
}

.btn-icon-action {
    width: 42px;
    height: 42px;
    padding: 0;
    background: var(--gray-100);
    border: none;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn-icon-action:hover {
    background: #2AB7A9;
    color: white;
    transform: scale(1.08);
}

.btn-icon-action.btn-danger:hover {
    background: #e74c3c;
}

.btn-icon-action .material-icons {
    font-size: 20px;
}

/* ========== Botones ========== */
.btn-primary {
    padding: 12px 24px;
    background: linear-gradient(135deg, #2AB7A9, #1a8f85);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(42, 183, 169, 0.35);
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 25px rgba(42, 183, 169, 0.5);
    background: linear-gradient(135deg, #35c9ba, #2AB7A9);
}

.btn-primary .material-icons {
    font-size: 20px;
}

.btn-icon {
    width: 36px;
    height: 36px;
    padding: 0;
    background: var(--gray-100);
    border: none;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn-icon:hover {
    background: #2AB7A9;
    color: white;
    transform: scale(1.1);
}

.btn-icon.btn-delete:hover {
    background: #e74c3c;
}

.btn-icon .material-icons {
    font-size: 18px;
}

/* ========== Tarjetas de Mascotas ========== */
.pets-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
}

.pet-card {
    background: white;
    border: 2px solid var(--gray-200);
    border-radius: 16px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    transition: all 0.3s ease;
}

.pet-card:hover {
    border-color: #2AB7A9;
    box-shadow: 0 10px 35px rgba(42, 183, 169, 0.25);
    transform: translateY(-6px);
}

.pet-icon-circle {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
}

.pet-icon-circle .material-icons {
    font-size: 32px;
    color: white;
}

.pet-info {
    text-align: center;
}

.pet-info h3 {
    font-size: 20px;
    font-weight: 700;
    color: var(--gray-900);
    margin: 0 0 8px;
}

.pet-info p {
    font-size: 14px;
    color: var(--gray-700);
    margin: 4px 0;
}

.pet-actions {
    display: flex;
    justify-content: center;
    gap: 10px;
    padding-top: 12px;
    border-top: 1px solid var(--gray-200);
}

/* ========== Estado Vacío ========== */
.empty-state {
    text-align: center;
    padding: 80px 20px;
}

.empty-state .material-icons {
    font-size: 80px;
    color: #d1d5db;
    margin-bottom: 20px;
    opacity: 0.5;
}

.empty-state h3 {
    font-size: 22px;
    font-weight: 600;
    color: var(--gray-700);
    margin: 0 0 10px;
}

.empty-state p {
    font-size: 15px;
    color: #999;
    margin: 0 0 24px;
}

/* ========== Transiciones ========== */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
    opacity: 0;
    transform: translateY(20px);
}

.fade-leave-to {
    opacity: 0;
    transform: translateY(-20px);
}

/* ========== Responsive ========== */
@media (max-width: 1024px) {
    .dashboard-grid {
        grid-template-columns: 1fr;
    }

    .sidebar {
        position: static;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: 10px;
    }

    .nav-item span {
        display: none;
    }

    .nav-item {
        justify-content: center;
    }
}

@media (max-width: 768px) {
    .cliente-page {
        padding: 16px;
    }

    .cliente-page::before {
        width: 250px;
        height: 250px;
        top: -100px;
        right: -100px;
    }

    .dashboard-header {
        flex-direction: column;
        gap: 16px;
        align-items: flex-start;
    }

    .header-right {
        width: 100%;
        justify-content: space-between;
    }

    .section-header {
        flex-direction: column;
        gap: 16px;
        align-items: flex-start;
    }

    .section-header h2 {
        font-size: 24px;
    }

    .pets-grid {
        grid-template-columns: 1fr;
    }

    /* Formularios responsive */
    .form-grid {
        grid-template-columns: 1fr;
        gap: 16px;
    }

    .form-actions {
        flex-direction: column-reverse;
        gap: 12px;
    }

    .btn-primary,
    .btn-secondary {
        width: 100%;
        justify-content: center;
    }

    .service-summary {
        flex-direction: column;
        text-align: center;
        padding: 20px;
    }

    /* Citas responsive */
    .appointment-body {
        flex-direction: column;
        align-items: flex-start;
    }

    .appointment-actions {
        width: 100%;
        justify-content: flex-end;
    }

    /* Modal responsive */
    .modal-card-pet {
        max-width: 95vw;
        margin: 0 10px;
    }

    .modal-header-pet,
    .modal-body-pet {
        padding: 24px 20px;
    }

    .modal-header-pet .text-h5 {
        font-size: 22px;
    }
}

/* ========== Estilos Quasar Override ========== */
.cliente-container {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 24px;
}

.header-card {
    border-radius: 16px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    margin-bottom: 24px;
}

.nav-card {
    border-radius: 16px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    position: sticky;
    top: 24px;
}

.nav-card .q-item {
    border-radius: 12px;
    margin-bottom: 8px;
    transition: all 0.2s ease;
}

.nav-card .q-item:hover {
    transform: translateX(4px);
    background: rgba(42, 183, 169, 0.08);
}

.nav-active {
    background: linear-gradient(135deg, #2AB7A9, #1a8f85) !important;
    color: #ffffff !important;
}

.nav-active .q-icon {
    color: #ffffff !important;
}

.section-card {
    border-radius: 16px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.pet-card {
    border-radius: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    border: 1px solid rgba(42, 183, 169, 0.12);
    transition: all 0.2s ease;
}

.pet-card:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
}

.appointment-card {
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    border: 1px solid rgba(42, 183, 169, 0.12);
}

.modal-card {
    width: 100%;
    max-width: 540px;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    overflow: hidden;
}

.modal-card .q-card-section:first-child {
    background: linear-gradient(135deg, #2AB7A9, #1a8f85);
    color: white;
    padding: 24px 28px;
}

.modal-card .q-card-section:first-child .text-h6 {
    color: white;
    font-weight: 600;
    font-size: 22px;
}

.modal-card .q-card-section:not(:first-child) {
    padding: 28px;
}

.modal-card .q-card-section:last-of-type {
    padding-bottom: 28px;
}

.modal-card .q-input,
.modal-card .q-select {
    margin-bottom: 4px;
}

.modal-card .q-field__label {
    font-weight: 500;
    color: #333;
}

.modal-card .q-btn {
    min-width: 100px;
    font-weight: 600;
    text-transform: none;
    letter-spacing: 0.3px;
}

.modal-card .q-separator {
    background-color: rgba(0, 0, 0, 0.06);
}

/* Modal de mascotas mejorado */
.modal-card-pet {
    width: 100%;
    max-width: 600px;
    border-radius: 28px;
    box-shadow: 0 25px 80px rgba(0, 0, 0, 0.4);
    overflow: hidden;
    animation: modalFadeIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes modalFadeIn {
    from {
        opacity: 0;
        transform: scale(0.85) translateY(-30px);
    }

    to {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}

.modal-header-pet {
    background: linear-gradient(135deg, #2AB7A9 0%, #1a8f85 100%);
    color: white;
    padding: 32px 36px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    overflow: hidden;
}

.modal-header-pet::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -10%;
    width: 200px;
    height: 200px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
}

.modal-header-pet .row {
    position: relative;
    z-index: 1;
}

.modal-header-pet .text-h5 {
    color: white;
    font-weight: 800;
    letter-spacing: -0.5px;
    font-size: 26px;
}

.modal-header-pet .q-icon {
    background: rgba(255, 255, 255, 0.2);
    padding: 8px;
    border-radius: 12px;
}

.modal-header-pet .q-btn {
    background: rgba(255, 255, 255, 0.15);
    transition: all 0.3s ease;
}

.modal-header-pet .q-btn:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: rotate(90deg);
}

.modal-body-pet {
    padding: 40px 36px;
    background: linear-gradient(180deg, #ffffff 0%, #f9fafb 100%);
}

.form-field {
    margin-bottom: 0;
}

.custom-input :deep(.q-field__control) {
    border-radius: 14px;
    background: white;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    min-height: 52px;
    border: 2px solid transparent;
}

.custom-input :deep(.q-field__control):hover {
    box-shadow: 0 4px 16px rgba(42, 183, 169, 0.2);
    border-color: rgba(42, 183, 169, 0.2);
}

.custom-input :deep(.q-field--focused) .q-field__control {
    box-shadow: 0 6px 20px rgba(42, 183, 169, 0.35);
    border-color: #2AB7A9 !important;
    transform: translateY(-1px);
}

.custom-input :deep(.q-field__label) {
    font-weight: 600;
    color: #555;
    font-size: 15px;
}

.custom-input :deep(.q-field__prepend) {
    padding-right: 12px;
}

.custom-input :deep(.q-field__prepend) .q-icon {
    font-size: 22px;
}

.modal-body-pet .q-btn {
    border-radius: 12px;
    font-weight: 700;
    font-size: 15px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    min-height: 48px;
    text-transform: none;
    letter-spacing: 0.3px;
}

.modal-body-pet .q-btn--unelevated {
    box-shadow: 0 4px 16px rgba(42, 183, 169, 0.35);
}

.modal-body-pet .q-btn--unelevated:hover {
    box-shadow: 0 8px 24px rgba(42, 183, 169, 0.5);
    transform: translateY(-3px);
}

.modal-body-pet .q-btn--outline {
    border: 2px solid var(--gray-300);
}

.modal-body-pet .q-btn--outline:hover {
    background: var(--gray-100);
    border-color: var(--gray-400);
    transform: translateY(-2px);
}

.modal-body-pet .q-gutter-lg {
    gap: 24px;
}

.modal-body-pet .q-gutter-md {
    gap: 16px;
}
</style>