// Favorites Management System
class FavoritesManager {
    constructor() {
        this.storageKey = 'platsec_favorites';
        this.favorites = this.loadFavorites();
        this.init();
    }

    init() {
        // Initialize favorite buttons on lesson pages
        const favoriteBtn = document.querySelector('.favorite-btn');
        if (favoriteBtn) {
            this.setupFavoriteButton(favoriteBtn);
        }

        // Update favorites display if on favorites page
        if (document.body.classList.contains('favorites-page') || window.location.pathname.includes('favorites.html')) {
            this.displayFavorites();
        }

        // Set active navigation
        this.setActiveNavigation();
    }

    loadFavorites() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading favorites:', error);
            return [];
        }
    }

    saveFavorites() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.favorites));
        } catch (error) {
            console.error('Error saving favorites:', error);
        }
    }

    addFavorite(lessonId) {
        if (!this.favorites.includes(lessonId)) {
            this.favorites.push(lessonId);
            this.saveFavorites();
            return true;
        }
        return false;
    }

    removeFavorite(lessonId) {
        const index = this.favorites.indexOf(lessonId);
        if (index > -1) {
            this.favorites.splice(index, 1);
            this.saveFavorites();
            return true;
        }
        return false;
    }

    isFavorite(lessonId) {
        return this.favorites.includes(lessonId);
    }

    setupFavoriteButton(button) {
        const lessonId = button.getAttribute('data-lesson');
        
        // Set initial state
        this.updateButtonState(button, lessonId);

        // Add click event listener
        button.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleFavorite(button, lessonId);
        });
    }

    toggleFavorite(button, lessonId) {
        const isFavorited = this.isFavorite(lessonId);
        
        if (isFavorited) {
            this.removeFavorite(lessonId);
        } else {
            this.addFavorite(lessonId);
        }

        this.updateButtonState(button, lessonId);
        this.showFeedback(button, !isFavorited);
    }

    updateButtonState(button, lessonId) {
        const heartIcon = button.querySelector('.heart-icon');
        const isFavorited = this.isFavorite(lessonId);

        if (isFavorited) {
            button.classList.add('favorited');
            button.innerHTML = '<span class="heart-icon">♥</span> Remove from Favorites';
        } else {
            button.classList.remove('favorited');
            button.innerHTML = '<span class="heart-icon">♡</span> Add to Favorites';
        }
    }

    showFeedback(button, added) {
        const originalText = button.innerHTML;
        const feedbackText = added ? 
            '<span class="heart-icon">♥</span> Added to Favorites!' : 
            '<span class="heart-icon">♡</span> Removed from Favorites!';
        
        button.innerHTML = feedbackText;
        button.style.background = added ? '#28a745' : '#6c757d';
        
        setTimeout(() => {
            this.updateButtonState(button, button.getAttribute('data-lesson'));
            button.style.background = '';
        }, 1500);
    }

    displayFavorites() {
        const container = document.querySelector('.favorites-container');
        if (!container) return;

        if (this.favorites.length === 0) {
            container.innerHTML = `
                <div class="favorites-empty">
                    <h2>No Favorites Yet</h2>
                    <p>Start exploring lessons and add them to your favorites by clicking the heart icon!</p>
                    <a href="lessons.html" class="btn btn-primary">Browse Lessons</a>
                </div>
            `;
            return;
        }

        const lessonData = this.getLessonData();
        const favoriteLessons = this.favorites.map(id => lessonData[id]).filter(Boolean);

        container.innerHTML = `
            <div class="lessons-grid">
                ${favoriteLessons.map(lesson => `
                    <a href="lessons/${lesson.id}.html" class="lesson-card">
                        <div class="lesson-icon">${lesson.icon}</div>
                        <h3>${lesson.title}</h3>
                        <p>${lesson.description}</p>
                    </a>
                `).join('')}
            </div>
        `;
    }

    getLessonData() {
        return {
            'lesson1': {
                id: 'lesson1',
                title: 'Authentication Basics',
                description: 'Learn the fundamentals of user authentication and password security in modern platforms.',
                icon: '🔐'
            },
            'lesson2': {
                id: 'lesson2',
                title: 'Authorization & Access Control',
                description: 'Understand role-based access control and permission systems for secure platforms.',
                icon: '🛡️'
            },
            'lesson3': {
                id: 'lesson3',
                title: 'Data Encryption',
                description: 'Master encryption techniques to protect sensitive data at rest and in transit.',
                icon: '🔒'
            },
            'lesson4': {
                id: 'lesson4',
                title: 'Network Security',
                description: 'Explore network protocols, firewalls, and secure communication channels.',
                icon: '🌐'
            },
            'lesson5': {
                id: 'lesson5',
                title: 'API Security',
                description: 'Secure your APIs with proper authentication, rate limiting, and validation.',
                icon: '⚡'
            },
            'lesson6': {
                id: 'lesson6',
                title: 'Security Monitoring',
                description: 'Implement logging, monitoring, and alerting systems for threat detection.',
                icon: '🔍'
            },
            'lesson7': {
                id: 'lesson7',
                title: 'Incident Response',
                description: 'Develop effective incident response procedures and recovery strategies.',
                icon: '🚨'
            },
            'lesson8': {
                id: 'lesson8',
                title: 'Security Testing',
                description: 'Learn penetration testing, vulnerability assessments, and security auditing.',
                icon: '🧪'
            },
            'lesson9': {
                id: 'lesson9',
                title: 'Compliance & Standards',
                description: 'Navigate security frameworks, regulations, and industry best practices.',
                icon: '📋'
            }
        };
    }

    setActiveNavigation() {
        const navLinks = document.querySelectorAll('.nav-links a');
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkPage = link.getAttribute('href').split('/').pop();
            
            if (linkPage === currentPage || 
                (currentPage === 'index.html' && linkPage === 'home.html') ||
                (currentPage.startsWith('lesson') && linkPage === 'lessons.html')) {
                link.classList.add('active');
            }
        });
    }
}

// Smooth scroll for anchor links
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Mobile menu toggle (for responsive design)
function initMobileMenu() {
    const navbar = document.querySelector('.navbar');
    if (window.innerWidth <= 768) {
        // Add mobile menu functionality if needed
        // This can be expanded based on requirements
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize favorites manager
    window.favoritesManager = new FavoritesManager();
    
    // Initialize other features
    initSmoothScroll();
    initMobileMenu();
    
    // Handle window resize
    window.addEventListener('resize', initMobileMenu);
});

// Export for use in other scripts if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FavoritesManager;
}