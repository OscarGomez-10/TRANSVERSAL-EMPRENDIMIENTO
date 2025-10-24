<template>
    <div class="login-container">
        <q-card class="login-card">
            <q-card-section class="login-header">
                <div class="text-h4 text-primary text-weight-bold">Bienvenido Administrador</div>
                <div class="text-subtitle1 text-grey-7">Acceso al panel de administración</div>
            </q-card-section>

            <q-card-section>
                <q-form @submit="handleLogin" class="login-form">
                    <q-input v-model="formData.email" type="email" label="Correo Electrónico"
                        placeholder="ejemplo@correo.com" outlined :rules="[val => !!val || 'El correo es requerido']">
                        <template v-slot:prepend>
                            <q-icon name="email" />
                        </template>
                    </q-input>

                    <q-input v-model="formData.password" :type="showPassword ? 'text' : 'password'" label="Contraseña"
                        placeholder="Ingresa tu contraseña" outlined
                        :rules="[val => !!val || 'La contraseña es requerida']">
                        <template v-slot:prepend>
                            <q-icon name="lock" />
                        </template>
                        <template v-slot:append>
                            <q-icon :name="showPassword ? 'visibility' : 'visibility_off'" class="cursor-pointer"
                                @click="showPassword = !showPassword" />
                        </template>
                    </q-input>

                 
                    <q-btn type="submit" label="Iniciar Sesión" color="primary" size="lg" :loading="loading"
                        class="full-width q-mt-md" unelevated rounded>
                        <template v-slot:loading>
                            <q-spinner-hourglass class="on-left" />
                            Cargando...
                        </template>
                    </q-btn>
                </q-form>
            </q-card-section>

            <q-card-section v-if="error">
                <q-banner class="bg-negative text-white" rounded>
                    <template v-slot:avatar>
                        <q-icon name="error" />
                    </template>
                    {{ error }}
                </q-banner>
            </q-card-section>
        </q-card>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { postData } from '../services/peticionesUser';
import { useQuasar } from 'quasar';

const router = useRouter();

const formData = ref({
    email: '',
    password: ''
});

const showPassword = ref(false);
const rememberMe = ref(false);
const loading = ref(false);
const error = ref('');
const $q = useQuasar();

const handleLogin = async () => {
    try {
        loading.value = true;
        error.value = '';
        const response = await postData("/user/login", {
            email: formData.value.email,
            password: formData.value.password
        })
        console.log(response);
        $q.notify({
            type: 'positive',
            message: response.data.msg || 'Inicio de sesión exitoso',
            position: 'top',
            timeout: 3000
        });

        router.push('/admin/veterinaria');

    } catch (err) {
        error.value = err.response.data.msg || 'Error al iniciar sesión. Por favor, verifica tus credenciales.';
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
.login-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #2AB7A9 0%, #1a8f85 100%);
    padding: 20px;
}

.login-card {
    background: white;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    padding: 40px;
    width: 100%;
    max-width: 450px;
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
    margin-bottom: 30px;
}

.login-header h1 {
    color: #2AB7A9;
    font-size: 32px;
    font-weight: 700;
    margin: 0 0 5px 0;
    line-height: 1.5;
}

.login-header p {
    color: #666;
    font-size: 16px;
    margin: 0;
    line-height: 1.3;
}

.login-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
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
    background: #f5f5f5;
    border: 2px solid transparent;
    border-radius: 12px;
    transition: all 0.3s ease;
}

.input-wrapper:focus-within {
    background: white;
    border-color: #2AB7A9;
    box-shadow: 0 0 0 3px rgba(42, 183, 169, 0.1);
}

.input-wrapper i.material-icons {
    position: absolute;
    left: 15px;
    color: #999;
    font-size: 20px;
    transition: color 0.3s ease;
}

.input-wrapper:focus-within i.material-icons {
    color: #2AB7A9;
}

.input-wrapper input {
    flex: 1;
    padding: 15px 15px 15px 50px;
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
    right: 15px;
    cursor: pointer;
    user-select: none;
}

.toggle-password:hover {
    color: #2AB7A9 !important;
}

.form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: -5px;
}

.remember-me {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 14px;
    color: #666;
}

.remember-me input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: #2AB7A9;
}

.forgot-password {
    color: #2AB7A9;
    text-decoration: none;
    font-size: 14px;
    font-weight: 600;
    transition: color 0.3s ease;
}

.forgot-password:hover {
    color: #1a8f85;
}

.btn-login {
    background: #2AB7A9;
    color: white;
    border: none;
    padding: 16px;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.btn-login:hover:not(:disabled) {
    background: #1a8f85;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(42, 183, 169, 0.3);
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
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
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
    padding: 12px 16px;
    background: #ffe5e5;
    color: #d32f2f;
    border-radius: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    animation: shake 0.5s ease;
}

.error-message i {
    font-size: 20px;
}

@keyframes shake {

    0%,
    100% {
        transform: translateX(0);
    }

    25% {
        transform: translateX(-10px);
    }

    75% {
        transform: translateX(10px);
    }
}

/* Responsive */
@media (max-width: 500px) {
    .login-card {
        padding: 30px 25px;
    }

    .login-header h1 {
        font-size: 26px;
    }

    .form-options {
        flex-direction: column;
        gap: 10px;
        align-items: flex-start;
    }
}
</style>
