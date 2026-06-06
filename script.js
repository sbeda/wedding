// === Логика конверта ===
const envelopeBlock = document.getElementById('envelope');
const envelopeButton = document.querySelector('.envelope-stamp-wrapper');

if (envelopeButton && envelopeBlock) {
    envelopeButton.addEventListener('click', function () {
        envelopeBlock.classList.add('opened');

        // Через 1.5 секунды скроллим к следующему блоку
        setTimeout(() => {
            const photoBlock = document.getElementById('photo-block');
            if (photoBlock) {
                photoBlock.scrollIntoView({ behavior: 'smooth' });
            }
        }, 2500);
    });
}

// === Таймер обратного отсчета до 5 сентября 2026 ===
function updateTimer() {
    const weddingDate = new Date('2026-09-05T12:00:00').getTime();
    const now = new Date().getTime();
    const distance = weddingDate - now;

    const daysEl = document.getElementById('timerDays');
    const hoursEl = document.getElementById('timerHours');
    const minutesEl = document.getElementById('timerMinutes');
    const secondsEl = document.getElementById('timerSeconds');

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    if (distance < 0) {
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
}

updateTimer();
setInterval(updateTimer, 1000);

// === Обработка отправки формы ===
const surveyForm = document.getElementById('surveyForm');
if (surveyForm) {
    surveyForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(surveyForm);
        const data = {};
        formData.forEach((value, key) => {
            if (key === 'drinks') {
                if (!data[key]) data[key] = [];
                data[key].push(value);
            } else {
                data[key] = value;
            }
        });

        console.log('Данные анкеты:', data);

        // ✅ ДОБАВЬ ЭТУ СТРОКУ:
        sendToTelegram(data);

        // Анимация отправки
        const submitBtn = surveyForm.querySelector('.survey-submit');
        const originalHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="submit-text">Отправлено</span><span class="submit-icon">♡</span>';
        surveyForm.classList.add('submitted');

        showNotification('Спасибо! Ваша анкета получена. Ждём вас на празднике!');

        setTimeout(() => {
            submitBtn.innerHTML = originalHTML;
            surveyForm.classList.remove('submitted');
            surveyForm.reset();
        }, 2500);
    });
}

// === Функция показа уведомления ===
function showNotification(message) {
    // Удаляем предыдущее уведомление, если есть
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    // Стили для уведомления
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--color-deep-burgundy);
        background: #31010f;
        color: #e7e0cb;
        padding: 16px 30px;
        border-radius: 2px;
        font-family: 'Cormorant Garamond', 'Georgia', serif;
        font-size: 16px;
        letter-spacing: 2px;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.5s ease;
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        text-align: center;
        max-width: 90vw;
    `;

    document.body.appendChild(notification);

    // Плавное появление
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 100);

    // Исчезновение через 3 секунды
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3500);
}

// === Плавное появление блоков при скролле ===
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85
    );
}

function handleScrollReveal() {
    const blocks = document.querySelectorAll('.block');

    blocks.forEach(block => {
        if (isElementInViewport(block) && !block.classList.contains('visible')) {
            block.classList.add('visible');
            block.style.opacity = '1';
            block.style.transform = 'translateY(0)';
        }
    });
}

// Инициализация скролл-эффекта
document.addEventListener('DOMContentLoaded', function () {
    const blocks = document.querySelectorAll('.block');

    blocks.forEach(block => {
        if (block.id !== 'envelope') {
            block.style.opacity = '0';
            block.style.transform = 'translateY(20px)';
            block.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        }
    });

    // Конверт всегда видимый
    if (envelopeBlock) {
        envelopeBlock.style.opacity = '1';
        envelopeBlock.classList.add('visible');
    }

    handleScrollReveal();
    window.addEventListener('scroll', handleScrollReveal);
});

// === Карта (заглушка) ===
const mapLink = document.querySelector('.button-link');
if (mapLink) {
    mapLink.addEventListener('click', function (e) {
        e.preventDefault();
        // Открываем Яндекс.Карты с координатами ресторана
        window.open('https://yandex.ru/maps/?text=Краснодар%2C%20ул.%20Садовая%2C%201%2F1%2C%20Ресторан%20Белладжио', '_blank');
    });
}

// === Прелоадер: ждём загрузки всех изображений ===
window.addEventListener('load', function () {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        // Небольшая задержка для плавности
        setTimeout(() => {
            preloader.classList.add('hidden');
            // Удаляем прелоадер из DOM после анимации
            setTimeout(() => {
                preloader.remove();
            }, 600);
        }, 300);
    }
});

// === Карусель: листается при скролле страницы ===
const carouselTrack = document.getElementById('carouselTrack');
const dots = document.querySelectorAll('#carouselDots .dot');
const cards = document.querySelectorAll('.carousel-card');

if (carouselTrack && cards.length > 0) {
    let currentIndex = 0;
    let isAnimating = false;
    let lastScrollY = window.scrollY;
    let scrollAccumulator = 0;

    function goToSlide(index) {
        if (isAnimating) return;
        if (index < 0) index = cards.length - 1;
        if (index >= cards.length) index = 0;

        isAnimating = true;
        currentIndex = index;

        carouselTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });

        setTimeout(() => {
            isAnimating = false;
        }, 600);
    }

    // Слушаем скролл страницы
    window.addEventListener('scroll', () => {
        const carousel = document.querySelector('.location-carousel');
        if (!carousel) return;

        const rect = carousel.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Проверяем, что карусель в зоне видимости
        if (rect.top < windowHeight && rect.bottom > 0) {
            const currentScrollY = window.scrollY;
            const delta = currentScrollY - lastScrollY;

            scrollAccumulator += delta;

            // Каждые 80px скролла — перелистываем
            if (Math.abs(scrollAccumulator) > 80) {
                if (scrollAccumulator > 0) {
                    goToSlide(currentIndex + 1);
                } else {
                    goToSlide(currentIndex - 1);
                }
                scrollAccumulator = 0;
            }
        }

        lastScrollY = window.scrollY;
    });
}

// === Горизонтальный скролл дресс-кода при скролле страницы ===
const dresscodeScrolls = document.querySelectorAll('.dresscode-scroll');

dresscodeScrolls.forEach(scroll => {
    let scrollAccumulator = 0;
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const rect = scroll.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (rect.top < windowHeight && rect.bottom > 0) {
            const delta = window.scrollY - lastScrollY;
            scrollAccumulator += delta;

            if (Math.abs(scrollAccumulator) > 60) {
                scroll.scrollBy({
                    left: scrollAccumulator > 0 ? 180 : -180,
                    behavior: 'smooth'
                });
                scrollAccumulator = 0;
            }
        }

        lastScrollY = window.scrollY;
    });
});

// === Отправка формы в Telegram ===
async function sendToTelegram(data) {
    const BOT_TOKEN = '8645061112:AAHDOsbRa-pllcY6CKI7U-M1JnZ6l1Hqwt0';
    const CHAT_ID = '-5190035991'; // группа "Приглашения"

    const drinksLabels = {
        'sparkling': 'Игристое',
        'white-wine': 'Вино белое',
        'red-wine': 'Вино красное',
        'whiskey': 'Виски',
        'cognac': 'Коньяк',
        'vodka': 'Водка',
        'non-alcoholic': 'Безалкогольные'
    };

    const drinksList = data.drinks
        ? data.drinks.map(d => drinksLabels[d] || d).join('\n')
        : 'Не выбрано';

    const message = `🕊 <b>Новая анкета гостя</b>\n\n<b>Имя:</b> ${data.name}\n<b>Присутствие:</b> ${data.attendance === 'yes' ? 'Да, с радостью' : 'К сожалению, не смогу'}\n<b>Аллергии/Ограничения:</b> ${data.allergies || 'Не указано'}\n\n<b>Предпочитаемые напитки:</b>\n${drinksList}`;

    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        });

        if (!response.ok) throw new Error('Ошибка отправки');
        console.log('Анкета отправлена в Telegram');
    } catch (error) {
        console.error('Ошибка отправки:', error);
    }
}