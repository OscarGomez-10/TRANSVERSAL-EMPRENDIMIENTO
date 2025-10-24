<template>
    <q-page class="vettime-page">
        <div class="dashboard-container">
            <!-- Header -->
            <header class="dashboard-header">
                <div class="header-left">
                    <div class="logo-badge">
                        <i class="material-icons">pets</i>
                    </div>
                    <div>
                        <h1>VetTime</h1>
                        <p>Agenda Veterinaria</p>
                    </div>
                </div>
                <div class="header-right">
                    <button class="btn-admin" @click="abrirModalAdmin">
                        <i class="material-icons">admin_panel_settings</i>
                        Nuevo Administrador
                    </button>
                    <button class="btn-new" @click="abrirModal">
                        <i class="material-icons">add</i>
                        Nueva Cita
                    </button>
                </div>
            </header>

            <!-- Main Content -->
            <main class="main-content">
                <!-- Filtros y búsqueda -->
                <div class="filters-section">
                    <div class="form-grid">
                        <div class="form-group">
                            <label class="form-label">
                                <i class="material-icons">filter_list</i>
                                Filtrar por estado
                            </label>
                            <q-select 
                                v-model="filtroEstado" 
                                :options="opcionesFiltro" 
                                outlined 
                                dense
                                class="custom-select"
                            />
                        </div>

                        <div class="form-group">
                            <label class="form-label">
                                <i class="material-icons">search</i>
                                Buscar
                            </label>
                            <q-input 
                                v-model="busqueda" 
                                outlined 
                                dense 
                                placeholder="Mascota o propietario..." 
                                clearable
                                class="custom-input"
                            />
                        </div>

                        <div class="form-group">
                            <label class="form-label">
                                <i class="material-icons">sort</i>
                                Ordenar por
                            </label>
                            <q-select 
                                v-model="sortBy" 
                                :options="sortOptions" 
                                emit-value 
                                map-options 
                                outlined 
                                dense
                                class="custom-select"
                            />
                        </div>

                        <div class="form-group">
                            <label class="form-label" style="opacity: 0;">.</label>
                            <button class="btn-secondary full-width" @click="filtroEstado = 'Todas'; busqueda = ''; sortBy = 'fechaAsc'">
                                <i class="material-icons">refresh</i>
                                Limpiar
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Lista de Citas -->
                <div v-if="!visibleQuotes.length" class="empty-state">
                    <i class="material-icons">event_busy</i>
                    <h3>No hay citas registradas</h3>
                    <p>Comienza creando tu primera cita</p>
                </div>

                <div v-else class="appointments-grid">
                    <div v-for="q in visibleQuotesSorted" :key="q._id" class="appointment-card">
                        <div class="card-status-indicator" :class="'status-' + getStatus(q)"></div>
                        
                        <div class="card-header">
                            <div class="pet-avatar">
                                <i class="material-icons">pets</i>
                            </div>
                            <div class="card-title">
                                <h3>{{ q.pet_id?.name || 'Mascota' }}</h3>
                                <p><i class="material-icons">person</i> {{ q.client_id?.name || 'N/A' }}</p>
                            </div>
                            <button class="btn-icon btn-delete" @click="confirmDelete(q)" title="Eliminar">
                                <i class="material-icons">delete</i>
                            </button>
                        </div>

                        <div class="card-body">
                            <div class="info-row">
                                <i class="material-icons">event</i>
                                <span>{{ formatDateTime(q.date) }}</span>
                            </div>
                            <div class="info-row">
                                <i class="material-icons">paid</i>
                                <span>{{ Number(q.total_amount || 0).toLocaleString('es-ES', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }) }}</span>
                            </div>
                            <div class="info-row">
                                <i class="material-icons">medical_services</i>
                                <span>{{ (q.service_id || []).map(s => s.name).join(', ') || 'N/A' }}</span>
                            </div>
                        </div>

                        <div class="card-footer">
                            <q-select
                                :model-value="getStatus(q)"
                                @update:model-value="val => onChangeStatus(q, val)"
                                :options="estadoOptions"
                                dense 
                                outlined 
                                emit-value 
                                map-options
                                class="status-select"
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>

        <!-- MODAL REGISTRO ADMINISTRADOR -->
        <q-dialog v-model="modalAdminAbierto" persistent @hide="resetAdminForm">
            <q-card class="admin-modal" style="width: 420px; max-width: 95vw;">
                <div class="modal-header q-pa-md admin-header">
                    <div class="row items-center no-wrap">
                        <div class="col">
                            <div class="text-h6 text-weight-bold text-white row items-center">
                                <q-icon name="admin_panel_settings" size="26px" class="q-mr-sm" color="white" />
                                Registrar Administrador
                            </div>
                            <div class="text-caption text-white q-mt-xs">
                                Crea credenciales para un nuevo administrador
                            </div>
                        </div>
                        <div>
                            <q-btn dense round flat icon="close" color="white" class="modal-close-btn" @click="cerrarModalAdmin" />
                        </div>
                    </div>
                </div>

                <q-separator />

                <q-card-section class="q-pa-lg">
                    <q-form @submit.prevent="registrarAdministrador" class="q-gutter-md">
                        <q-input
                            v-model="formAdmin.username"
                            label="Nombre de usuario"
                            filled
                            dense
                            :disable="registrandoAdmin"
                            :rules="[val => !!val || 'Ingresa un usuario']"
                        >
                            <template v-slot:prepend>
                                <q-icon name="person" color="grey-6" />
                            </template>
                        </q-input>

                        <q-input
                            v-model="formAdmin.email"
                            label="Correo electrónico"
                            type="email"
                            filled
                            dense
                            :disable="registrandoAdmin"
                            :rules="[val => !!val || 'Ingresa el correo']"
                        >
                            <template v-slot:prepend>
                                <q-icon name="email" color="grey-6" />
                            </template>
                        </q-input>

                        <q-input
                            v-model="formAdmin.password"
                            :type="mostrarPassAdmin ? 'text' : 'password'"
                            label="Contraseña"
                            filled
                            dense
                            :disable="registrandoAdmin"
                            :rules="[val => !!val || 'Ingresa la contraseña']"
                        >
                            <template v-slot:prepend>
                                <q-icon name="lock" color="grey-6" />
                            </template>
                            <template v-slot:append>
                                <q-icon
                                    :name="mostrarPassAdmin ? 'visibility' : 'visibility_off'"
                                    class="cursor-pointer"
                                    @click="mostrarPassAdmin = !mostrarPassAdmin"
                                />
                            </template>
                        </q-input>

                        <q-input
                            v-model="formAdmin.confirmPassword"
                            :type="mostrarPassAdmin ? 'text' : 'password'"
                            label="Confirmar contraseña"
                            filled
                            dense
                            :disable="registrandoAdmin"
                            :rules="[val => !!val || 'Confirma la contraseña']"
                        >
                            <template v-slot:prepend>
                                <q-icon name="lock" color="grey-6" />
                            </template>
                        </q-input>

                        <q-card-actions align="right" class="q-pt-md">
                            <q-btn flat label="Cancelar" color="grey-6" @click="cerrarModalAdmin" :disable="registrandoAdmin" />
                            <q-btn
                                type="submit"
                                label="Registrar"
                                color="primary"
                                unelevated
                                :loading="registrandoAdmin"
                            />
                        </q-card-actions>
                    </q-form>
                </q-card-section>
            </q-card>
        </q-dialog>

        <!-- MODAL FORMULARIO CITA -->
        <q-dialog v-model="modalAbierto" persistent>
            <q-card class="modern-modal" style="width: 590px; max-width: 90vw; max-height: 85vh; display: flex; flex-direction: column;">
                <div class="modal-header q-pa-md">
                    <div class="row items-center no-wrap">
                        <div class="col">
                            <div class="text-h6 text-weight-bold text-white row items-center">
                                <q-icon name="add_circle" size="26px" class="q-mr-sm" color="white" />
                                Nueva Cita Veterinaria
                            </div>
                            <div class="text-caption text-white q-mt-xs">Completa los campos para agendar una cita
                            </div>
                        </div>

                        <div>
                            <q-btn dense round flat icon="close" color="white" class="modal-close-btn" v-close-popup />
                        </div>
                    </div>
                </div>

                <q-separator />

                <q-card-section class="q-pt-lg q-pb-lg modal-body">
                    <q-form @submit="guardarCita" class="q-gutter-md">
                        <q-stepper v-model="step" vertical color="primary" animated flat active-color="primary">
                            <q-step :name="1" title="Información de la Mascota" icon="pets" :done="step > 1">
                                <div class="input-group q-mt-sm">
                                    <q-input filled v-model="formCita.nombreMascota" label="Nombre Mascota*" lazy-rules
                                        :rules="[val => !!val || 'Escribe el nombre de la mascota']">
                                        <template v-slot:prepend>
                                            <q-icon name="pets" color="grey-6" />
                                        </template>
                                    </q-input>
                                </div>

                                <div class="input-group q-mt-sm">
                                    <q-select filled v-model="formCita.tipoMascota" :options="opcionesMascotas"
                                        label="Tipo De Mascota*" lazy-rules
                                        :rules="[val => !!val || 'Selecciona el tipo de mascota']">
                                        <template v-slot:prepend>
                                            <q-icon name="category" color="grey-6" />
                                        </template>
                                    </q-select>
                                </div>

                                <div class="input-group q-mt-sm">
                                    <q-input filled v-model="formCita.sintomas" label="Síntomas*" lazy-rules
                                        :rules="[val => !!val || 'Describe los síntomas']" autogrow>
                                        <template v-slot:prepend>
                                            <q-icon name="description" color="grey-6" />
                                        </template>
                                    </q-input>
                                </div>
                            </q-step>

                            <q-step :name="2" title="Información del Propietario" icon="person" :done="step > 2">
                                <div class="q-mb-md">
                                    <q-option-group
                                        v-model="creatingMode"
                                        type="radio"
                                        :options="[
                                            { label: 'Cliente existente', value: 'existing' },
                                            { label: 'Nuevo cliente', value: 'new' }
                                        ]"
                                    />
                                </div>

                                <div v-if="creatingMode === 'existing'" class="q-gutter-md">
                                    <q-select filled v-model="selectedClientId" :options="clients" option-label="name" option-value="_id" emit-value map-options label="Seleccionar Cliente">
                                        <template v-slot:prepend>
                                            <q-icon name="person_search" color="grey-6" />
                                        </template>
                                    </q-select>

                                    <q-select v-if="selectedClientId" filled v-model="selectedPetId" :options="pets" option-label="name" option-value="_id" emit-value map-options label="Seleccionar Mascota">
                                        <template v-slot:prepend>
                                            <q-icon name="pets" color="grey-6" />
                                        </template>
                                    </q-select>

                                    <div v-if="selectedClientId && pets.length === 0" class="text-grey-7 q-pt-xs">
                                        No hay mascotas registradas para este cliente.
                                    </div>

                                    <q-expansion-item v-if="selectedClientId" icon="add" label="Agregar nueva mascota" expand-separator>
                                        <div class="q-gutter-md q-pa-sm">
                                            <q-input filled v-model="newPet.name" label="Nombre Mascota" />
                                            <q-select filled v-model="newPet.type" :options="opcionesMascotas" label="Tipo de Mascota" />
                                            <q-input filled v-model="newPet.age" label="Edad" type="number" />
                                            <q-btn color="primary" label="Crear Mascota" @click="createPetForExistingClient" />
                                        </div>
                                    </q-expansion-item>
                                </div>

                                <div v-else class="q-gutter-md">
                                <div class="input-group q-mt-sm">
                                        <q-input filled v-model="formCita.propietario" label="Propietario*" lazy-rules
                                            :rules="[val => !!val || 'Escribe el nombre del propietario']">
                                            <template v-slot:prepend>
                                                <q-icon name="person" color="grey-6" />
                                            </template>
                                        </q-input>
                                </div>

                                <div class="input-group q-mt-sm">
                                        <q-input filled v-model="formCita.telefono" label="Teléfono*" type="tel"
                                            mask="##########" lazy-rules :rules="[val => !!val || 'Escribe el teléfono']">
                                            <template v-slot:prepend>
                                                <q-icon name="phone" color="grey-6" />
                                            </template>
                                        </q-input>
                                </div>

                                    <!-- Datos nuevo cliente requeridos por backend -->
                                    <q-input filled v-model="newClient.name" label="Nombre (cliente)" />
                                    <q-input filled v-model="newClient.email" label="Email (cliente)" type="email" />
                                    <q-input filled v-model="newClient.phone" label="Teléfono (cliente)" />
                                    <q-input filled v-model="newClient.address" label="Dirección (cliente)" />
                                    <q-input filled v-model="newClient.password" label="Contraseña (cliente)" type="password" />

                                    <!-- Opcional: nueva mascota -->
                                    <q-separator />
                                    <div class="text-subtitle2 text-grey-7">Nueva Mascota (opcional)</div>
                                    <q-input filled v-model="newPet.name" label="Nombre Mascota" />
                                    <q-select filled v-model="newPet.type" :options="opcionesMascotas" label="Tipo de Mascota" />
                                    <q-input filled v-model="newPet.age" label="Edad" type="number" />
                                </div>
                            </q-step>

                            <q-step :name="3" title="Fecha y Hora" icon="event" :done="step > 3">
                                <div class="input-group q-mt-sm">
                                    <q-select filled v-model="selectedServiceIds" :options="services" option-label="name" option-value="_id" emit-value map-options multiple use-chips label="Servicios"/>
                                </div>
                                <div class="q-mt-sm text-weight-medium">
                                    Total: {{ totalAmount.toLocaleString('es-ES') }}
                                </div>
                                <div class="input-group q-mt-sm">
                                    <q-input filled v-model="formCita.fecha" label="Fecha Cita*" type="date" lazy-rules
                                        :rules="[val => !!val || 'Selecciona la fecha']">
                                        <template v-slot:prepend>
                                            <q-icon name="calendar_today" color="grey-6" />
                                        </template>
                                    </q-input>
                                </div>

                                <div class="input-group q-mt-sm">
                                    <q-input filled v-model="formCita.hora" label="Hora Cita*" type="time" lazy-rules
                                        :rules="[val => !!val || 'Selecciona la hora']">
                                        <template v-slot:prepend>
                                            <q-icon name="schedule" color="grey-6" />
                                        </template>
                                    </q-input>
                                </div>
                            </q-step>
                        </q-stepper>

                        <div class="row items-center q-mt-lg modal-actions">
                            <div class="col-auto">
                                <q-btn flat label="Cancelar" @click="modalAbierto = false" />
                            </div>
                            <div class="col text-right">
                                <q-btn v-if="step > 1" outline label="Volver" @click="step = step - 1"
                                    class="q-mr-sm btn-outline-primary" />
                                <q-btn v-if="step === 1"
                                    label="Siguiente" @click="step = 2" class="btn-primary" />
                                <q-btn v-if="step === 2"
                                    label="Siguiente" @click="step = 3" class="btn-primary" />
                                <q-btn v-if="step === 3" label="Guardar" type="submit" class="btn-primary-save" />
                            </div>
                        </div>
                    </q-form>
                </q-card-section>
            </q-card>
        </q-dialog>
    </q-page>
</template>

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
.vettime-page {
    min-height: 100vh;
    background: #f5f5f5;
    padding: 24px;
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
    0%, 100% {
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

.btn-admin {
    padding: 12px 24px;
    background: linear-gradient(135deg, #2AB7A9, #1a8f85);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(42, 183, 169, 0.35);
}

.btn-admin:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 25px rgba(42, 183, 169, 0.45);
    background: linear-gradient(135deg, #35c9ba, #2AB7A9);
}

.btn-admin .material-icons {
    font-size: 20px;
}

.btn-new {
    padding: 12px 24px;
    background: linear-gradient(135deg, #2AB7A9, #1a8f85);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(42, 183, 169, 0.35);
}

.btn-new:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 25px rgba(42, 183, 169, 0.5);
    background: linear-gradient(135deg, #35c9ba, #2AB7A9);
}

.btn-new .material-icons {
    font-size: 20px;
}

.admin-modal {
    border-radius: 18px;
    overflow: hidden;
    box-shadow: 0 18px 40px rgba(42, 183, 169, 0.25);
}

.admin-header {
    background: linear-gradient(135deg, #2AB7A9, #1a8f85);
}

/* ========== Main Content ========== */
.main-content {
    background: white;
    border-radius: 20px;
    padding: 30px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

/* ========== Filters Section ========== */
.filters-section {
    margin-bottom: 30px;
    padding-bottom: 30px;
    border-bottom: 2px solid var(--gray-100);
}

.form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-label {
    font-size: 13px;
    font-weight: 600;
    color: var(--gray-700);
    display: flex;
    align-items: center;
    gap: 6px;
}

.form-label .material-icons {
    font-size: 18px;
    color: var(--primary);
}

.custom-select,
.custom-input {
    border-radius: 10px;
}

.btn-secondary {
    padding: 10px 20px;
    background: var(--gray-100);
    color: var(--gray-700);
    border: none;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    transition: all 0.3s ease;
}

.btn-secondary:hover {
    background: var(--gray-200);
    transform: translateY(-1px);
}

.btn-secondary .material-icons {
    font-size: 18px;
}

.full-width {
    width: 100%;
}

/* ========== Empty State ========== */
.empty-state {
    text-align: center;
    padding: 60px 20px;
    color: var(--gray-600);
}

.empty-state .material-icons {
    font-size: 80px;
    color: var(--gray-300);
    margin-bottom: 20px;
}

.empty-state h3 {
    font-size: 20px;
    font-weight: 600;
    color: var(--gray-700);
    margin: 0 0 10px 0;
}

.empty-state p {
    font-size: 14px;
    color: var(--gray-600);
    margin: 0;
}

/* ========== Appointments Grid ========== */
.appointments-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 20px;
}

.appointment-card {
    background: white;
    border: 2px solid var(--gray-200);
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.3s ease;
    position: relative;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.appointment-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
    border-color: var(--primary);
}

.card-status-indicator {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
}

.card-status-indicator.status-abierta {
    background: var(--warning);
}

.card-status-indicator.status-terminada {
    background: var(--success);
}

.card-status-indicator.status-anulada {
    background: var(--danger);
}

.card-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 20px;
    padding-top: 24px;
}

.pet-avatar {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #2AB7A9, #1a8f85);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.pet-avatar .material-icons {
    font-size: 28px;
    color: white;
}

.card-title {
    flex: 1;
}

.card-title h3 {
    font-size: 16px;
    font-weight: 700;
    color: var(--gray-900);
    margin: 0 0 4px 0;
}

.card-title p {
    font-size: 13px;
    color: var(--gray-600);
    margin: 0;
    display: flex;
    align-items: center;
    gap: 4px;
}

.card-title p .material-icons {
    font-size: 16px;
}

.btn-icon {
    width: 36px;
    height: 36px;
    border: none;
    background: var(--gray-100);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-icon:hover {
    background: var(--gray-200);
    transform: scale(1.05);
}

.btn-icon.btn-delete {
    background: rgba(231, 76, 60, 0.1);
    color: var(--danger);
}

.btn-icon.btn-delete:hover {
    background: rgba(231, 76, 60, 0.2);
}

.btn-icon .material-icons {
    font-size: 20px;
}

.card-body {
    padding: 0 20px 20px 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.info-row {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    color: var(--gray-700);
}

.info-row .material-icons {
    font-size: 20px;
    color: var(--primary);
}

.card-footer {
    padding: 15px 20px;
    background: var(--gray-50);
    border-top: 1px solid var(--gray-100);
}

.status-select {
    border-radius: 8px;
}

/* ========== Modal Styles ========== */
.rounded-borders {
    border-radius: 12px;
}

.modern-modal {
    border-radius: 14px;
    overflow: hidden;
    background: #ffffff;
    box-shadow: none;
}

.modal-header {
    background-color: #2AB7A9;
    color: #ffffff;
}

.modal-close-btn {
    border: 1px solid #ffffff;
}

q-separator {
    background-color: #e0e0e0;
}

.input-group {
    margin-bottom: 8px;
}

.modern-modal .q-field--filled {
    border-radius: 8px;
    background-color: #fafafa;
}

.btn-primary,
.btn-primary-save {
    background-color: #2AB7A9 !important;
    color: #ffffff !important;
    border-radius: 6px;
    text-transform: none;
}

.btn-outline-primary {
    border: 1px solid #2AB7A9 !important;
    color: #2AB7A9 !important;
    background: transparent;
}

.modern-modal .q-icon {
    opacity: 0.85;
}

@media (max-width: 600px) {
    .modal-header .text-h6 {
        font-size: 16px;
    }
}

.modal-body {
    overflow: auto;
    flex: 1;
    max-height: 85vh;
}

/* ========== Responsive ========== */
@media (max-width: 768px) {
    .vettime-page {
        padding: 16px;
    }

    .dashboard-header {
        padding: 16px 20px;
        flex-direction: column;
        gap: 16px;
    }

    .header-left {
        width: 100%;
    }

    .header-right {
        width: 100%;
        flex-direction: column;
        justify-content: stretch;
    }

    .btn-admin,
    .btn-new {
        width: 100%;
        justify-content: center;
    }

    .main-content {
        padding: 20px;
    }

    .form-grid {
        grid-template-columns: 1fr;
    }

    .appointments-grid {
        grid-template-columns: 1fr;
    }
}
</style>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { getData, postData } from '../services/peticionesUser'
import api from '../plugins/axios.js'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const filtroEstado = ref('Todas')
const busqueda = ref('')
const modalAbierto = ref(false)
const modalAdminAbierto = ref(false)

const step = ref(1)
const formAdmin = ref({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
})
const registrandoAdmin = ref(false)
const mostrarPassAdmin = ref(false)

const opcionesFiltro = ['Todas', 'Abierta', 'Terminada', 'Anulada']

const opcionesMascotas = [
    'Perro',
    'Gato',
    'Elefante',
    'Tigre',
    'León',
    'Jirafa',
    'Oso',
    'Canguro',
    'Lobo',
    'Águila'
]

// Datos cargados desde backend
const clients = ref([])
const pets = ref([])
const services = ref([])
const quotes = ref([])
const statusOverrides = ref({}) // { [quoteId]: 'abierta' | 'terminada' | 'anulada' }
const sortBy = ref('fechaAsc')
const sortOptions = [
    { label: 'Fecha (próximas primero)', value: 'fechaAsc' },
    { label: 'Fecha (recientes primero)', value: 'fechaDesc' },
    { label: 'Estado', value: 'estado' },
    { label: 'Nombre mascota', value: 'nombre' }
]

// Formulario y control de selección
const formCita = ref({
    nombreMascota: '',
    propietario: '', // nombre o id según modo
    telefono: '',
    fecha: '',
    hora: '',
    tipoMascota: null,
    sintomas: ''
})

const creatingMode = ref('existing') // 'existing' | 'new'
const selectedClientId = ref(null)
const selectedPetId = ref(null)
const selectedServiceIds = ref([])

// Campos necesarios si creamos cliente nuevo
const newClient = ref({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: ''
})

// Campos opcionales para nueva mascota
const newPet = ref({
    name: '',
    type: null,
    age: ''
})

// Computed total amount (sum of selected services prices)
const totalAmount = ref(0)

function resetAdminForm() {
    formAdmin.value = {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    }
    mostrarPassAdmin.value = false
}

function abrirModalAdmin() {
    resetAdminForm()
    modalAdminAbierto.value = true
}

function cerrarModalAdmin() {
    modalAdminAbierto.value = false
}

async function registrarAdministrador() {
    if (registrandoAdmin.value) {
        return
    }

    const username = formAdmin.value.username.trim()
    const email = formAdmin.value.email.trim().toUpperCase()
    const password = formAdmin.value.password
    const confirmPassword = formAdmin.value.confirmPassword

    if (!username || !email || !password) {
        $q.notify({ type: 'negative', message: 'Completa toda la información del administrador' })
        return
    }

    if (password !== confirmPassword) {
        $q.notify({ type: 'negative', message: 'Las contraseñas no coinciden' })
        return
    }

    try {
        registrandoAdmin.value = true
        await postData('/User/register', {
            username,
            email,
            password
        })
        $q.notify({ type: 'positive', message: 'Administrador registrado con éxito' })
        cerrarModalAdmin()
    } catch (err) {
        const msg = err.response?.data?.msg || err.message || 'No se pudo registrar al administrador'
        $q.notify({ type: 'negative', message: msg })
    } finally {
        registrandoAdmin.value = false
    }
}

watch(selectedServiceIds, () => calculateTotal())

function calculateTotal() {
    let sum = 0
    if (services.value && services.value.length) {
        selectedServiceIds.value.forEach(id => {
            const s = services.value.find(x => x._id === id)
            if (s && s.price) sum += Number(s.price)
        })
    }
    totalAmount.value = sum
}

const abrirModal = async () => {
    modalAbierto.value = true
    step.value = 1
    // cargar listas necesarias
    await fetchClients()
    await fetchServices()
}

async function fetchClients() {
    try {
        const res = await getData('/Client/list')
        clients.value = res.data
    } catch (err) {
        console.error('Error fetching clients', err)
    }
}

async function fetchPets(ownerId = null) {
    try {
        const url = ownerId ? `/Pet/list?idOwner=${ownerId}` : '/Pet/list'
        const res = await getData(url)
        pets.value = res.data
    } catch (err) {
        console.error('Error fetching pets', err)
    }
}

async function fetchServices() {
    try {
        const res = await getData('/Service/list')
        services.value = res.data
    } catch (err) {
        console.error('Error fetching services', err)
    }
}

async function fetchQuotes() {
    try {
        const res = await getData('/Quote/list')
        // backend devuelve { msg: quotes }
        quotes.value = res.data?.msg || []
    } catch (err) {
        console.error('Error fetching quotes', err)
    }
}

// cuando cambia el cliente seleccionado, cargar sus mascotas
watch(selectedClientId, async (newId) => {
    if (newId) {
        await fetchPets(newId)
    } else {
        pets.value = []
    }
})

async function guardarCita() {
    try {
        // validar servicios seleccionados y fecha/hora
        if (!selectedServiceIds.value.length) {
            $q.notify({ type: 'negative', message: 'Selecciona al menos un servicio' })
            return
        }
        if (!formCita.value.fecha || !formCita.value.hora) {
            $q.notify({ type: 'negative', message: 'Selecciona fecha y hora' })
            return
        }

        let clientId = selectedClientId.value
        let petId = selectedPetId.value

        // Si se crea cliente nuevo
        if (creatingMode.value === 'new') {
            // completar newClient con los campos básicos
            newClient.value.name = newClient.value.name || formCita.value.propietario || newClient.value.name
            newClient.value.phone = newClient.value.phone || formCita.value.telefono || newClient.value.phone

            // Crear cliente
            await postData('/Client/register', {
                name: newClient.value.name,
                email: newClient.value.email,
                phone: newClient.value.phone,
                address: newClient.value.address,
                password: newClient.value.password
            })

            // buscar el cliente creado por email (email es único)
            await fetchClients()
            const found = clients.value.find(c => c.email === newClient.value.email)
            if (!found) throw new Error('No se pudo obtener el cliente recién creado')
            clientId = found._id

            // Crear mascota si no seleccionó una mascota existente
            if (!newPet.value.name && !selectedPetId.value) {
                // si no hay nombre, usar nombre de formulario
                newPet.value.name = formCita.value.nombreMascota
                newPet.value.type = formCita.value.tipoMascota
            }

            if (newPet.value.name) {
                await postData('/Pet/register', {
                    name: newPet.value.name,
                    type: newPet.value.type,
                    age: newPet.value.age,
                    owner: clientId
                })

                // obtener mascotas del cliente y encontrar la creada por nombre
                await fetchPets(clientId)
                const foundPet = pets.value.find(p => p.name === newPet.value.name)
                if (!foundPet) throw new Error('No se pudo obtener la mascota recién creada')
                petId = foundPet._id
            }
        }

        // Si el usuario seleccionó cliente existente pero no seleccionó mascota, intentar usar nombre de mascota
        if (creatingMode.value === 'existing' && selectedClientId.value && !petId) {
            // buscar mascota por nombre entre las mascotas cargadas
            const foundPet = pets.value.find(p => p.name === formCita.value.nombreMascota)
            if (foundPet) petId = foundPet._id
        }

        if (!clientId || !petId) {
            $q.notify({ type: 'negative', message: 'Falta seleccionar/crear cliente o mascota' })
            return
        }

        // construir fecha ISO combinando fecha y hora
        const isoDate = new Date(`${formCita.value.fecha}T${formCita.value.hora}`)

        // Crear la cita (quote)
        await postData('/Quote/register', {
            client_id: clientId,
            pet_id: petId,
            service_id: selectedServiceIds.value,
            date: isoDate,
            total_amount: totalAmount.value
        })

        $q.notify({ type: 'positive', message: 'Cita creada correctamente' })
        modalAbierto.value = false
        // limpiar formulario
        resetForm()
    // refrescar listado de citas
    await fetchQuotes()

    } catch (err) {
        console.error('Error guardarCita', err)
        const msg = err.response?.data?.msg || err.message || 'Error creando la cita'
        $q.notify({ type: 'negative', message: msg })
    }
}

async function createPetForExistingClient() {
    try {
        if (!selectedClientId.value) {
            $q.notify({ type: 'negative', message: 'Selecciona un cliente primero' })
            return
        }
        if (!newPet.value.name || !newPet.value.type) {
            $q.notify({ type: 'negative', message: 'Nombre y tipo de mascota son requeridos' })
            return
        }
        await postData('/Pet/register', {
            name: newPet.value.name,
            type: newPet.value.type,
            age: newPet.value.age,
            owner: selectedClientId.value
        })
        await fetchPets(selectedClientId.value)
        const created = pets.value.find(p => p.name === newPet.value.name)
        if (created) {
            selectedPetId.value = created._id
        }
        $q.notify({ type: 'positive', message: 'Mascota creada' })
        newPet.value = { name: '', type: null, age: '' }
    } catch (err) {
        console.error('Error createPetForExistingClient', err)
        const msg = err.response?.data?.msg || err.message || 'Error creando la mascota'
        $q.notify({ type: 'negative', message: msg })
    }
}

function resetForm() {
    formCita.value = {
        nombreMascota: '', propietario: '', telefono: '', fecha: '', hora: '', tipoMascota: null, sintomas: ''
    }
    creatingMode.value = 'existing'
    selectedClientId.value = null
    selectedPetId.value = null
    newClient.value = { name: '', email: '', phone: '', address: '', password: '' }
    newPet.value = { name: '', type: null, age: '' }
    selectedServiceIds.value = []
    totalAmount.value = 0
}

// cargar servicios al montar (fuera del modal)
onMounted(() => {
    fetchServices()
    fetchQuotes()
    // cargar overrides locales si existen
    try {
        const raw = localStorage.getItem('quoteStatusOverrides')
        if (raw) statusOverrides.value = JSON.parse(raw)
    } catch {}
})

// Mapeos y derivados para tarjetas
const statusMap = {
    'Todas': undefined,
    'Abierta': 'abierta',
    'Terminada': 'terminada',
    'Anulada': 'anulada'
}

function statusLabel(status) {
    if (status === 'abierta') return 'Abierta'
    if (status === 'terminada') return 'Terminada'
    if (status === 'anulada') return 'Anulada'
    return 'Abierta'
}

function statusColor(status) {
    if (status === 'terminada') return 'positive'
    if (status === 'anulada') return 'negative'
    return 'warning'
}

function formatDateTime(d) {
    try {
        const dt = new Date(d)
        return dt.toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' })
    } catch { return '' }
}

function getStatus(item) {
    return statusOverrides.value[item._id] || item.status || 'abierta'
}

function setStatusLocal(item, status) {
    statusOverrides.value = { ...statusOverrides.value, [item._id]: status }
}

const estadoOptions = [
    { label: 'Abierta', value: 'abierta' },
    { label: 'Terminada', value: 'terminada' },
    { label: 'Anulada', value: 'anulada' }
]

async function onChangeStatus(item, val) {
    const previous = getStatus(item)
    // Actualiza de inmediato en UI
    setStatusLocal(item, val)
    try {
        await api.put(`/Quote/update/${item._id}`, { status: val })
        // Refresca desde el backend y elimina el override para esta cita
        await fetchQuotes()
        const { [item._id]: _removed, ...rest } = statusOverrides.value
        statusOverrides.value = rest
        $q.notify({ type: 'positive', message: 'Estado actualizado' })
    } catch (err) {
        // Revertir cambio local si falla
        setStatusLocal(item, previous)
        const msg = err.response?.data?.msg || err.message || 'No se pudo actualizar el estado'
        $q.notify({ type: 'negative', message: msg })
    }
}

// diseño natural: sin bordes de color ni hover destacados

function confirmDelete(item) {
    $q.dialog({
        title: 'Eliminar cita',
        message: '¿Seguro que deseas eliminar esta cita? Esta acción no se puede deshacer.',
        cancel: true,
        persistent: true,
        ok: { label: 'Eliminar', color: 'negative' }
    }).onOk(async () => {
        try {
            await api.delete(`/Quote/delete/${item._id}`)
            await fetchQuotes()
            $q.notify({ type: 'positive', message: 'Cita eliminada' })
        } catch (err) {
            const msg = err.response?.data?.msg || err.message || 'Error eliminando la cita'
            $q.notify({ type: 'negative', message: msg })
        }
    })
}

// persistir overrides en localStorage
watch(statusOverrides, (v) => {
    try { localStorage.setItem('quoteStatusOverrides', JSON.stringify(v)) } catch {}
}, { deep: true })

const visibleQuotes = computed(() => {
    const q = quotes.value || []
    const term = (busqueda.value || '').toLowerCase().trim()
    const mapStatus = statusMap[filtroEstado.value] // puede ser undefined -> no filtrar

    return q.filter(item => {
        let ok = true
        const st = getStatus(item)
        if (mapStatus) ok = ok && (st === mapStatus)
        if (term) {
            const pet = item.pet_id?.name?.toLowerCase() || ''
            const owner = item.client_id?.name?.toLowerCase() || ''
            ok = ok && (pet.includes(term) || owner.includes(term))
        }
        return ok
    })
})

const visibleQuotesSorted = computed(() => {
    const arr = [...visibleQuotes.value]
    const s = sortBy.value
    if (s === 'fechaAsc') {
        arr.sort((a,b) => new Date(a.date) - new Date(b.date))
    } else if (s === 'fechaDesc') {
        arr.sort((a,b) => new Date(b.date) - new Date(a.date))
    } else if (s === 'estado') {
        const order = { abierta: 0, terminada: 1, anulada: 2 }
        arr.sort((a,b) => (order[getStatus(a)] ?? 99) - (order[getStatus(b)] ?? 99))
    } else if (s === 'nombre') {
        arr.sort((a,b) => (a.pet_id?.name || '').localeCompare(b.pet_id?.name || ''))
    }
    return arr
})

const counts = computed(() => {
    const all = quotes.value.length
    let pending = 0, approved = 0, rejected = 0
    for (const q of quotes.value) {
        const st = getStatus(q)
        if (st === 'terminada') approved++
        else if (st === 'anulada') rejected++
        else pending++
    }
    return { all, pending, approved, rejected }
})
</script>
