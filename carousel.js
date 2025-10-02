// ------------------------------------------------------------------------------- Карусель 
class CustomCarousel {
    constructor() {
        this.carousel = document.querySelector('.custom-carousel');
        this.container = document.querySelector('.carousel-container');
        this.slides = document.querySelectorAll('.carousel-slide');
        this.prevBtn = document.querySelector('.carousel-prev');
        this.nextBtn = document.querySelector('.carousel-next');
        
        this.currentIndex = 0;
        this.isAnimating = false;
        
        this.init();
    }
    
    init() {
        this.setSlideWidth();
        this.goToSlide(0);
        this.addEventListeners();
        this.startAutoPlay();
        
        // адаптация при изменении размера окна
        window.addEventListener('resize', () => {
            this.setSlideWidth();
            this.goToSlide(this.currentIndex);
        });
    }
    
    setSlideWidth() {
        const slideWidth = 340; 
        this.slideWidth = slideWidth;
        this.slides.forEach(slide => {
            slide.style.width = `${slideWidth}px`;
        });
        this.container.style.transform = `translateX(0px)`;
    }

    goToSlide(index, instant = false) {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        
        this.container.style.transition = instant ? 'none' : 'transform 0.5s ease';
        
        this.slides.forEach(slide => {
            slide.classList.remove('active', 'prev', 'next');
        });
        
        this.currentIndex = index;
        
        if (this.slides[this.currentIndex]) {
            this.slides[this.currentIndex].classList.add('active');
        }
        
        // соседние слайдов
        const prevIndex = this.currentIndex - 1 >= 0 ? this.currentIndex - 1 : this.slides.length - 1;
        const nextIndex = this.currentIndex + 1 < this.slides.length ? this.currentIndex + 1 : 0;
        
        if (this.slides[prevIndex]) this.slides[prevIndex].classList.add('prev');
        if (this.slides[nextIndex]) this.slides[nextIndex].classList.add('next');
        
        // центрование
        const containerWidth = this.carousel.offsetWidth;
        const slideWidth = 340;
        
        // смещение для центрирования активного слайда
        const activeSlideOffset = (containerWidth - slideWidth) / 2;
        const totalOffset = -this.currentIndex * slideWidth + activeSlideOffset;
        
        this.container.style.transform = `translateX(${totalOffset}px)`;
        
        setTimeout(() => {
            this.isAnimating = false;
            this.container.style.transition = 'transform 0.5s ease';
        }, instant ? 0 : 500);
    }
        
    nextSlide() {
        let nextIndex = this.currentIndex + 1;
        if (nextIndex >= this.slides.length) {
            nextIndex = 0; // зацикливание
        }
        this.goToSlide(nextIndex);
    }
    
    prevSlide() {
        let prevIndex = this.currentIndex - 1;
        if (prevIndex < 0) {
            prevIndex = this.slides.length - 1; // зацикливание
        }
        this.goToSlide(prevIndex);
    }
    
    addEventListeners() {
        // клик по слайду для перехода
        this.slides.forEach((slide, index) => {
            slide.addEventListener('click', () => this.goToSlide(index));
        });
        
        // клавиатура
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
        
        // свайпы для мобильных устройств
        this.addSwipeSupport();
    }
    
    addSwipeSupport() {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        
        this.carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        });
        
        this.carousel.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
        });
        
        this.carousel.addEventListener('touchend', () => {
            if (!isDragging) return;
            
            const diff = startX - currentX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
            isDragging = false;
        });
        
        // Для desktop с mouse events
        this.carousel.addEventListener('mousedown', (e) => {
            startX = e.clientX;
            isDragging = true;
        });
        
        this.carousel.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            currentX = e.clientX;
        });
        
        this.carousel.addEventListener('mouseup', () => {
            if (!isDragging) return;
            
            const diff = startX - currentX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
            isDragging = false;
        });
        
        this.carousel.addEventListener('mouseleave', () => {
            isDragging = false;
        });
    }
    
    startAutoPlay() {
        setInterval(() => {
            this.nextSlide();
        }, 5000); // автопрокрутка каждые 5 секунд
    }
}




// ------------------------------------------------------------------------------- Функции для шторки меню
function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    
    // блокировка прокрутки body при открытом меню
    document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
}

function closeMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = ''; // разблокировка прокрутки
}

// инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // инициализация карусели
    new CustomCarousel();
    
    // инициализация меню
    console.log('Меню и карусель инициализированы');
    
    // закрытие меню при нажатии на Escape
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeMenu();
        }
    });
    
    // закрытие меню при ресайзе окна
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });
});



