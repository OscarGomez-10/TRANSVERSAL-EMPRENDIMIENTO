<template>
    <q-page class="register-page">
        <div class="register-container">
            <div class="register-card">
                <div class="register-header">
                    <div class="logo-icon">
                        <i class="material-icons">how_to_reg</i>
                    </div>
                    <h1>Crea tu cuenta</h1>
                    <p>Regístrate para gestionar tus citas en VetTime</p>
                </div>

                <form @submit.prevent="handleRegister" class="register-form">
                    <div class="form-group">
                        <label for="name">Nombre completo</label>
                        <div class="input-wrapper">
                            <i class="material-icons">person</i>
                            <input
                                type="text"
                                id="name"
                                v-model="formData.name"
                                placeholder="Nombre y apellido"
                                required
                            />
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="email">Correo electrónico</label>
                        <div class="input-wrapper">
                            <i class="material-icons">email</i>
                            <input
                                type="email"
                                id="email"
                                v-model="formData.email"
                                placeholder="ejemplo@correo.com"
                                required
                            />
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="phone">Teléfono</label>
                        <div class="input-wrapper">
                            <i class="material-icons">call</i>
                            <input
                                type="tel"
                                id="phone"
                                v-model="formData.phone"
                                placeholder="Número de contacto"
                                required
                            />
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="address">Dirección</label>
                        <div class="input-wrapper">
                            <i class="material-icons">location_on</i>
                            <input
                                type="text"
                                id="address"
                                v-model="formData.address"
                                placeholder="Dirección completa"
                                required
                            />
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="password">Contraseña</label>
                        <div class="input-wrapper">
                            <i class="material-icons">lock</i>
                            <input
                                :type="showPassword ? 'text' : 'password'"
                                id="password"
                                v-model="formData.password"
                                placeholder="Crea una contraseña"
                                required
                            />
                            <i class="material-icons toggle-password" @click="showPassword = !showPassword">
                                {{ showPassword ? 'visibility' : 'visibility_off' }}
                            </i>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="confirmPassword">Confirmar contraseña</label>
                        <div class="input-wrapper">
                            <i class="material-icons">lock</i>
                            <input
                                :type="showPassword ? 'text' : 'password'"
                                id="confirmPassword"
                                v-model="formData.confirmPassword"
                                placeholder="Repite la contraseña"
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" class="btn-register" :disabled="loading">
                        <span v-if="!loading">Crear cuenta</span>
                        <span v-else class="loading">
                            <i class="material-icons spinner">refresh</i>
                            Guardando...
                        </span>
                    </button>

                    <div class="login-link">
                        ¿Ya tienes una cuenta?
                        <router-link to="/login-cliente">Inicia sesión</router-link>
                    </div>
                </form>

                <div v-if="error" class="error-message">
                    <i class="material-icons">error</i>
                    {{ error }}
                </div>

                <div v-if="success" class="success-message">
                    <i class="material-icons">check_circle</i>
                    {{ success }}
                </div>
            </div>
        </div>
    </q-page>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { postData } from '../services/peticionesUser.js';

const router = useRouter();

const formData = ref({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: ''
});

const showPassword = ref(false);
const loading = ref(false);
const error = ref('');
const success = ref('');
let redirectTimer = null;

const handleRegister = async () => {
    if (loading.value) {
        return;
    }

    error.value = '';
    success.value = '';

    if (formData.value.password !== formData.value.confirmPassword) {
        error.value = 'Las contraseñas no coinciden.';
        return;
    }

    try {
        loading.value = true;
        const payload = {
            name: formData.value.name,
            email: formData.value.email,
            phone: formData.value.phone,
            address: formData.value.address,
            password: formData.value.password
        };

        await postData('Client/register', payload);
        success.value = 'Cuenta creada con éxito. Redirigiendo al inicio de sesión...';
        redirectTimer = setTimeout(() => {
            router.push('/login-cliente');
        }, 1500);
    } catch (err) {
        error.value = err.response?.data?.msg || err.message || 'No se pudo crear la cuenta. Inténtalo nuevamente.';
    } finally {
        loading.value = false;
    }
};

onBeforeUnmount(() => {
    if (redirectTimer) {
        clearTimeout(redirectTimer);
    }
});
</script>

<style scoped>
.register-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #2AB7A9 0%, #1a8f85 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
}

.register-container {
    width: 100%;
    max-width: 520px;
}

.register-card {
    background: white;
    border-radius: 24px;
    box-shadow: 0 25px 70px rgba(0, 0, 0, 0.3);
    padding: 45px 40px;
    animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.register-header {
    text-align: center;
    margin-bottom: 35px;
}

.logo-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 20px;
    background: linear-gradient(135deg, #2AB7A9, #1a8f85);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 10px 30px rgba(42, 183, 169, 0.3);
}

.logo-icon .material-icons {
    font-size: 40px;
    color: white;
}

.register-header h1 {
    color: #2AB7A9;
    font-size: 32px;
    font-weight: 700;
    margin: 0 0 10px 0;
}

.register-header p {
    color: #666;
    font-size: 16px;
    margin: 0;
}

.register-form {
    display: flex;
    flex-direction: column;
    gap: 22px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-group label {
    color: #333;
    font-weight: 600;
    font-size: 14px;
}

.input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    background: #f8f9fa;
    border: 2px solid #e0e0e0;
    border-radius: 14px;
    transition: all 0.3s ease;
}

.input-wrapper:focus-within {
    background: white;
    border-color: #2AB7A9;
    box-shadow: 0 0 0 4px rgba(42, 183, 169, 0.1);
}

.input-wrapper .material-icons {
    position: absolute;
    left: 16px;
    color: #999;
    font-size: 22px;
    transition: color 0.3s ease;
}

.input-wrapper:focus-within .material-icons {
    color: #2AB7A9;
}

.input-wrapper input {
    flex: 1;
    padding: 16px 16px 16px 52px;
    border: none;
    background: transparent;
    font-size: 15px;
    color: #333;
    outline: none;
}

.input-wrapper input::placeholder {
    color: #aaa;
}

.toggle-password {
    position: absolute !important;
    left: auto !important;
    right: 16px;
    cursor: pointer;
    user-select: none;
}

.toggle-password:hover {
    color: #2AB7A9 !important;
}

.btn-register {
    background: linear-gradient(135deg, #2AB7A9, #1a8f85);
    color: white;
    border: none;
    padding: 16px;
    border-radius: 14px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    box-shadow: 0 4px 15px rgba(42, 183, 169, 0.3);
}

.btn-register:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(42, 183, 169, 0.4);
}

.btn-register:active:not(:disabled) {
    transform: translateY(0);
}

.btn-register:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.loading {
    display: flex;
    align-items: center;
    gap: 8px;
}

.spinner {
    animation: spin 1s linear infinite;
    font-size: 20px;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.login-link {
    text-align: center;
    color: #666;
    font-size: 14px;
    margin-top: 10px;
}

.login-link a {
    color: #2AB7A9;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.3s ease;
}

.login-link a:hover {
    color: #1a8f85;
    text-decoration: underline;
}

.error-message,
.success-message {
    margin-top: 20px;
    padding: 14px 18px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
}

.error-message {
    background: #ffebee;
    color: #c62828;
    border-left: 4px solid #c62828;
}

.success-message {
    background: #e8f5e9;
    color: #2e7d32;
    border-left: 4px solid #2e7d32;
}

.error-message .material-icons,
.success-message .material-icons {
    font-size: 22px;
}

@media (max-width: 500px) {
    .register-card {
        padding: 35px 30px;
    }

    .register-header h1 {
        font-size: 28px;
    }

    .register-form {
        gap: 18px;
    }
}
</style>
