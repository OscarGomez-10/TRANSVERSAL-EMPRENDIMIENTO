<template>
    <q-page class="home-page">
        <div class="home-container">
            <div class="hero-section">
                <div class="logo-circle">
                    <i class="material-icons">pets</i>
                </div>
                <h1 class="hero-title">VetTime</h1>
                <p class="hero-subtitle">Sistema de Gestión Veterinaria</p>
            </div>

            <div class="cards-container">
                <div class="role-card" @click="goToClientLogin">
                    <div class="card-icon client-icon">
                        <i class="material-icons">person</i>
                    </div>
                    <h2>Soy Cliente</h2>
                    <p>Accede para agendar citas y ver el historial de tus mascotas</p>
                    <button class="btn-primary">
                        Ingresar
                        <i class="material-icons">arrow_forward</i>
                    </button>
                </div>

                <div class="role-card" @click="goToAdminLogin">
                    <div class="card-icon admin-icon">
                        <i class="material-icons">admin_panel_settings</i>
                    </div>
                    <h2>Soy Administrador</h2>
                    <p>Gestiona clientes, citas y servicios veterinarios</p>
                    <button class="btn-secondary">
                        Ingresar
                        <i class="material-icons">arrow_forward</i>
                    </button>
                </div>
            </div>

            <footer class="home-footer">© 2025 VetTime - Cuidando de tus mascotas</footer>
        </div>
    </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goToClientLogin = () => {
    router.push('/login-cliente');
};

const goToAdminLogin = () => {
    router.push('/login-administrador');
};
</script>

<style scoped>
.home-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #2AB7A9 0%, #1a8f85 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    position: relative;
    overflow: hidden;
}

.home-page::before,
.home-page::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
    animation: float 10s ease-in-out infinite;
}

.home-page::before {
    width: 400px;
    height: 400px;
    top: -150px;
    right: -150px;
}

.home-page::after {
    width: 300px;
    height: 300px;
    bottom: -100px;
    left: -100px;
    animation-delay: -5s;
}

@keyframes float {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-20px) scale(1.05); }
}

.home-container {
    width: 100%;
    max-width: 1000px;
    z-index: 1;
}

.hero-section {
    text-align: center;
    margin-bottom: 60px;
}

.logo-circle {
    width: 120px;
    height: 120px;
    margin: 0 auto 30px;
    background: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
    animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}

.logo-circle .material-icons {
    font-size: 64px;
    color: #2AB7A9;
}

.hero-title {
    font-size: 56px;
    font-weight: 700;
    color: white;
    margin: 0 0 10px;
    letter-spacing: -1px;
}

.hero-subtitle {
    font-size: 20px;
    color: rgba(255, 255, 255, 0.9);
    margin: 0;
}

.cards-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 30px;
    margin-bottom: 40px;
}

.role-card {
    background: white;
    border-radius: 20px;
    padding: 40px 30px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    position: relative;
    overflow: hidden;
}

.role-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background: linear-gradient(90deg, #2AB7A9, #1a8f85);
    transform: scaleX(0);
    transition: transform 0.3s ease;
}

.role-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
}

.role-card:hover::before {
    transform: scaleX(1);
}

.card-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s ease;
}

.role-card:hover .card-icon {
    transform: scale(1.1) rotate(5deg);
}

.client-icon {
    background: linear-gradient(135deg, #2AB7A9, rgb(26, 143, 133));
}

.admin-icon {
    background: linear-gradient(135deg, #FF6B6B, #E55353);
}

.card-icon .material-icons {
    font-size: 40px;
    color: white;
}

.role-card h2 {
    font-size: 26px;
    font-weight: 700;
    color: #333;
    margin: 0 0 15px;
}

.role-card p {
    font-size: 15px;
    color: #666;
    line-height: 1.6;
    margin: 0 0 25px;
}

.btn-primary,
.btn-secondary {
    width: 100%;
    padding: 14px 24px;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.3s ease;
    color: white;
}

.btn-primary {
    background: linear-gradient(135deg, #2AB7A9, #1a8f85);
    box-shadow: 0 4px 15px rgba(42, 183, 169, 0.4);
}

.btn-primary:hover {
    box-shadow: 0 6px 20px rgba(42, 183, 169, 0.5);
    transform: translateY(-2px);
}

.btn-secondary {
    background: linear-gradient(135deg, #FF6B6B, #E55353);
    box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
}

.btn-secondary:hover {
    box-shadow: 0 6px 20px rgba(255, 107, 107, 0.5);
    transform: translateY(-2px);
}

.home-footer {
    text-align: center;
    color: rgba(255, 255, 255, 0.8);
    font-size: 14px;
}

@media (max-width: 768px) {
    .hero-title {
        font-size: 42px;
    }

    .cards-container {
        grid-template-columns: 1fr;
        gap: 20px;
    }

    .role-card {
        padding: 30px 25px;
    }
}
</style>
