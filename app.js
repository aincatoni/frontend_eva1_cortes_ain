const appState = {
    theme: localStorage.getItem('theme') || null,
    formData: {
        fullname: '',
        service: '',
        message: ''
    }
};

function initApp() {
    initTheme();
    setupNavigation();
    setupForm();
}

function initTheme() {
    const html = document.documentElement;
    
    if (appState.theme) {
        html.classList.add(appState.theme);
    }
    
    updateThemeIcon();
}

function getCurrentTheme() {
    const html = document.documentElement;
    
    if (html.classList.contains('dark')) {
        return 'dark';
    }
    if (html.classList.contains('light')) {
        return 'light';
    }
    
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
}

function updateThemeIcon() {
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = getCurrentTheme();
    
    if (themeToggle) {
        if (currentTheme === 'dark') {
            themeToggle.innerHTML = '<span class="material-symbols-outlined">dark_mode</span>';
            themeToggle.setAttribute('aria-label', 'Cambiar a modo claro');
            themeToggle.setAttribute('title', 'Cambiar a modo claro');
        } else {
            themeToggle.innerHTML = '<span class="material-symbols-outlined">light_mode</span>';
            themeToggle.setAttribute('aria-label', 'Cambiar a modo oscuro');
            themeToggle.setAttribute('title', 'Cambiar a modo oscuro');
        }
    }
}

function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = getCurrentTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.classList.remove('light', 'dark');
    html.classList.add(newTheme);
    
    appState.theme = newTheme;
    localStorage.setItem('theme', newTheme);
    
    updateThemeIcon();
}

function setupThemeListener() {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (!appState.theme) {
            updateThemeIcon();
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    setupThemeListener();
});

function setupNavigation() {
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            const isActive = navMenu.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isActive);
        });
        
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }
}

function validateFullname(value) {
    const trimmedValue = value.trim();
    
    if (trimmedValue === '') {
        return {
            isValid: false,
            message: 'El nombre completo es requerido'
        };
    }
    
    if (trimmedValue.length < 3) {
        return {
            isValid: false,
            message: 'El nombre debe tener al menos 3 caracteres'
        };
    }
    
    const regex = /^[a-záéíóúñüA-ZÁÉÍÓÚÑÜ\s\-]+$/;
    if (!regex.test(trimmedValue)) {
        return {
            isValid: false,
            message: 'El nombre solo debe contener letras, espacios o guiones'
        };
    }
    
    return {
        isValid: true,
        message: ''
    };
}

function validateService(value) {
    if (value === '' || value === null) {
        return {
            isValid: false,
            message: 'Debe seleccionar un servicio'
        };
    }
    
    return {
        isValid: true,
        message: ''
    };
}

function validateMessage(value) {
    const trimmedValue = value.trim();
    
    if (trimmedValue === '') {
        return {
            isValid: false,
            message: 'El mensaje es requerido'
        };
    }
    
    if (trimmedValue.length < 10) {
        return {
            isValid: false,
            message: 'El mensaje debe tener al menos 10 caracteres'
        };
    }
    
    if (trimmedValue.length > 500) {
        return {
            isValid: false,
            message: 'El mensaje no puede exceder 500 caracteres'
        };
    }
    
    return {
        isValid: true,
        message: ''
    };
}

function showFieldError(fieldId, errorMessage) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}-error`);
    const formGroup = field.closest('.form-group');
    
    if (field && errorElement) {
        formGroup.classList.add('error');
        errorElement.textContent = errorMessage;
    }
}

function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}-error`);
    const formGroup = field.closest('.form-group');
    
    if (field && errorElement) {
        formGroup.classList.remove('error');
        errorElement.textContent = '';
    }
}

function setupForm() {
    const form = document.getElementById('contact-form');
    const fullnameInput = document.getElementById('fullname');
    const serviceSelect = document.getElementById('service');
    const messageInput = document.getElementById('message');
    
    if (!form) return;
    
    if (fullnameInput) {
        fullnameInput.addEventListener('blur', () => {
            const validation = validateFullname(fullnameInput.value);
            if (!validation.isValid) {
                showFieldError('fullname', validation.message);
            } else {
                clearFieldError('fullname');
            }
            appState.formData.fullname = fullnameInput.value;
        });
        
        fullnameInput.addEventListener('input', () => {
            if (fullnameInput.closest('.form-group').classList.contains('error')) {
                const validation = validateFullname(fullnameInput.value);
                if (validation.isValid) {
                    clearFieldError('fullname');
                }
            }
        });
    }
    
    if (serviceSelect) {
        serviceSelect.addEventListener('change', () => {
            const validation = validateService(serviceSelect.value);
            if (!validation.isValid) {
                showFieldError('service', validation.message);
            } else {
                clearFieldError('service');
            }
            appState.formData.service = serviceSelect.value;
        });
    }
    
    if (messageInput) {
        messageInput.addEventListener('blur', () => {
            const validation = validateMessage(messageInput.value);
            if (!validation.isValid) {
                showFieldError('message', validation.message);
            } else {
                clearFieldError('message');
            }
            appState.formData.message = messageInput.value;
        });
        
        messageInput.addEventListener('input', () => {
            if (messageInput.closest('.form-group').classList.contains('error')) {
                const validation = validateMessage(messageInput.value);
                if (validation.isValid) {
                    clearFieldError('message');
                }
            }
        });
    }
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const fullnameValidation = validateFullname(fullnameInput.value);
        const serviceValidation = validateService(serviceSelect.value);
        const messageValidation = validateMessage(messageInput.value);
        
        let isFormValid = true;
        
        if (!fullnameValidation.isValid) {
            showFieldError('fullname', fullnameValidation.message);
            isFormValid = false;
        } else {
            clearFieldError('fullname');
        }
        
        if (!serviceValidation.isValid) {
            showFieldError('service', serviceValidation.message);
            isFormValid = false;
        } else {
            clearFieldError('service');
        }
        
        if (!messageValidation.isValid) {
            showFieldError('message', messageValidation.message);
            isFormValid = false;
        } else {
            clearFieldError('message');
        }
        
        if (isFormValid) {
            appState.formData.fullname = fullnameInput.value.trim();
            appState.formData.service = serviceSelect.value;
            appState.formData.message = messageInput.value.trim();
            
            console.log('Nombre:', appState.formData.fullname);
            console.log('Servicio:', appState.formData.service);
            console.log('Mensaje:', appState.formData.message);
            console.log('Fecha de envío:', new Date().toLocaleString('es-CL'));
            
            alert('Mensaje enviado correctamente. Revisa la consola (F12) para ver los detalles.');
            
            form.reset();
            appState.formData = {
                fullname: '',
                service: '',
                message: ''
            };
        } else {
            alert('Por favor, completa correctamente todos los campos.');
        }
    });
}

document.addEventListener('DOMContentLoaded', initApp);

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
