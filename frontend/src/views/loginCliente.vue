<template>
    <q-page class="login-page">
        <div class="login-container">
            <div class="login-card">
                <div class="login-header">
                    <div class="logo-icon">
                        <i class="material-icons">pets</i>
                    </div>
                    <h1>Bienvenido Cliente</h1>
                    <p>Ingresa a tu cuenta de VetTime</p>
                </div>

                <form @submit.prevent="handleLogin" class="login-form">
                    <div class="form-group">
                        <label for="email">Correo Electrónico</label>
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
                        <label for="password">Contraseña</label>
                        <div class="input-wrapper">
                            <i class="material-icons">lock</i>
                            <input 
                                :type="showPassword ? 'text' : 'password'" 
                                id="password" 
                                v-model="formData.password"
                                placeholder="Ingresa tu contraseña" 
                                required 
                            />
                            <i class="material-icons toggle-password" @click="showPassword = !showPassword">
                                {{ showPassword ? 'visibility' : 'visibility_off' }}
                            </i>
                        </div>
                    </div>

                    <button type="submit" class="btn-login" :disabled="loading">
                        <span v-if="!loading">Iniciar Sesión</span>
                        <span v-else class="loading">
                            <i class="material-icons spinner">refresh</i>
                            Cargando...
                        </span>
                    </button>

                    <div class="register-link">
                        ¿No tienes una cuenta?
                        <router-link to="/registro-cliente">Regístrate aquí</router-link>
                    </div>
                </form>

                <div v-if="error" class="error-message">
                    <i class="material-icons">error</i>
                    {{ error }}
                </div>
            </div>
        </div>
    </q-page>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { postData } from '../services/peticionesUser.js';

const CLIENT_SESSION_KEY = 'clientSession';

const router = useRouter();

const formData = ref({
    email: '',
    password: ''
});

const showPassword = ref(false);
const loading = ref(false);
const error = ref('');

const handleLogin = async () => {
    try {
        loading.value = true;
        error.value = '';
        const { data } = await postData('Client/login', {
            email: formData.value.email,
            password: formData.value.password
        });

        const clientData = data?.client;
        if (!clientData?._id) {
            throw new Error('No se pudo obtener la información del cliente.');
        }

        const sessionPayload = {
            id: clientData._id,
            name: clientData.name,
            email: clientData.email,
        };

        localStorage.setItem(CLIENT_SESSION_KEY, JSON.stringify(sessionPayload));

        router.push('/cliente');

    } catch (err) {
        error.value = err.response?.data?.msg || err.message || 'Error al iniciar sesión. Por favor, verifica tus credenciales.';
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
.login-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #2AB7A9 0%, #1a8f85 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
}

.login-container {
    width: 100%;
    max-width: 460px;
}

.login-card {
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

.login-header {
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

.login-header h1 {
    color: #2AB7A9;
    font-size: 32px;
    font-weight: 700;
    margin: 0 0 10px 0;
}

.login-header p {
    color: #666;
    font-size: 16px;
    margin: 0;
}

.login-form {
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

.btn-login {
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

.btn-login:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(42, 183, 169, 0.4);
}

.btn-login:active:not(:disabled) {
    transform: translateY(0);
}

.btn-login:disabled {
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

.register-link {
    text-align: center;
    color: #666;
    font-size: 14px;
    margin-top: 10px;
}

.register-link a {
    color: #2AB7A9;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.3s ease;
}

.register-link a:hover {
    color: #1a8f85;
    text-decoration: underline;
}

.error-message {
    margin-top: 20px;
    padding: 14px 18px;
    background: #ffebee;
    color: #c62828;
    border-radius: 12px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    border-left: 4px solid #c62828;
    animation: shake 0.5s ease;
}

.error-message .material-icons {
    font-size: 22px;
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
}

@media (max-width: 500px) {
    .login-card {
        padding: 35px 30px;
    }

    .login-header h1 {
        font-size: 28px;
    }

    .form-options {
        flex-direction: column;
        gap: 12px;
        align-items: flex-start;
    }
}
</style>
