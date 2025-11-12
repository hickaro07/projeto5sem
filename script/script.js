// Carrossel
document.addEventListener('DOMContentLoaded', function() {

    initCarousel();
    
    initBooking();
});

// Funções do carrossel
function initCarousel() {
    const carousel = document.querySelector('.carousel');
    if (!carousel) return;
    
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    // Função para mostrar slide específico
    function showSlide(index) {
    
        if (index < 0) {
            currentSlide = totalSlides - 1;
        } else if (index >= totalSlides) {
            currentSlide = 0;
        } else {
            currentSlide = index;
        }
        
        // Mover slides
        const slideWidth = slides[0].clientWidth;
        document.querySelector('.carousel-slides').style.transform = `translateX(-${currentSlide * slideWidth}px)`;
        
        indicators.forEach((indicator, i) => {
            if (i === currentSlide) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            showSlide(currentSlide - 1);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            showSlide(currentSlide + 1);
        });
    }
    
    indicators.forEach((indicator, i) => {
        indicator.addEventListener('click', () => {
            showSlide(i);
        });
    });
    
    setInterval(() => {
        showSlide(currentSlide + 1);
    }, 5000);
}

// Funções de agendamento
function initBooking() {
    const bookingForm = document.getElementById('appointment-form');
    if (!bookingForm) return;
    
    populateTimeSlots();
    
    // Configurar data mínima (hoje)
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    
    dateInput.addEventListener('change', populateTimeSlots);
    
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        submitAppointment();
    });
}

function populateTimeSlots() {
    const timeSelect = document.getElementById('time');
    const dateInput = document.getElementById('date');
    
    timeSelect.innerHTML = '<option value="">Selecione um horário</option>';
    
    if (!dateInput.value) return;
    
    // Horários de funcionamento (9h às 19h em dias de semana, 9h às 18h aos sábados)
    const selectedDate = new Date(dateInput.value);
    const dayOfWeek = selectedDate.getDay(); // 0 = Domingo, 6 = Sábado
    
    let startHour, endHour;
    
    if (dayOfWeek === 0) { 
        timeSelect.innerHTML = '<option value="">Fechado aos domingos</option>';
        timeSelect.disabled = true;
        return;
    } else if (dayOfWeek === 6) { 
        startHour = 9;
        endHour = 18;
    } else { 
        startHour = 9;
        endHour = 19;
    }
    
    timeSelect.disabled = false;
    
    // Gerar horários disponíveis 
    for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            const option = document.createElement('option');
            option.value = timeString;
            option.textContent = timeString;
            timeSelect.appendChild(option);
        }
    }
}

function submitAppointment() {
    const form = document.getElementById('appointment-form');
    const formData = new FormData(form);
    
    // Coletar dados do formulário
    const name = formData.get('name');
    const phone = formData.get('phone');
    const service = formData.get('service');
    const date = formData.get('date');
    const time = formData.get('time');
    const notes = formData.get('notes');
    
    // Validar dados
    if (!name || !phone || !service || !date || !time) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    
    // Formatar mensagem para WhatsApp
    const serviceNames = {
        'corte': 'Corte de Cabelo',
        'barba': 'Aparar Barba',
        'combo': 'Corte + Barba',
        'sobrancelha': 'Sobrancelha',
        'pigmentacao': 'Pigmentação'
    };
    
    const serviceName = serviceNames[service] || service;
    
    const message = `Olá, gostaria de agendar um horário na Barbearia Da-Sul:\n\n` +
                   `*Nome:* ${name}\n` +
                   `*Telefone:* ${phone}\n` +
                   `*Serviço:* ${serviceName}\n` +
                   `*Data:* ${formatDate(date)}\n` +
                   `*Horário:* ${time}\n` +
                   `${notes ? `*Observações:* ${notes}\n` : ''}`;
    
    const encodedMessage = encodeURIComponent(message);
    
    // Número do WhatsApp 
    const whatsappNumber = '5511947423922';
    
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});