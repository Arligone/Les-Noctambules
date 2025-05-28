document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    // Charger les données du palmarès
    if (window.location.pathname.includes('palmares.html')) {
        loadPalmares();
    }

    // Charger les actualités
    if (window.location.pathname.includes('index.html') || window.location.pathname.includes('actus.html')) {
        loadActualites();
    }

    // Stats counter animation
    const statValues = document.querySelectorAll('.stat-value');
    
    const observerStats = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const countTo = parseInt(target.getAttribute('data-count'));
                
                let count = 0;
                const updateCount = () => {
                    const increment = countTo > 1000 ? Math.ceil(countTo / 100) : Math.ceil(countTo / 50);
                    count += increment;
                    
                    if (count < countTo) {
                        target.textContent = count.toLocaleString();
                        setTimeout(updateCount, 20);
                    } else {
                        target.textContent = countTo.toLocaleString();
                        target.classList.add('counted');
                    }
                };
                
                updateCount();
                observer.unobserve(target);
            }
        });
    });
    
    statValues.forEach(stat => {
        observerStats.observe(stat);
    });
    
    // Initialize Swiper carousel
    if (document.querySelector('.swiper')) {
        const swiper = new Swiper('.swiper', {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            grabCursor: true,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                640: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                },
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                },
            }
        });
    }

    // Add scroll animation for elements
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.featured-card, .news-card, .section-header');
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Parallax effect on hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.pageYOffset;
            hero.style.backgroundPositionY = scrollPosition * 0.5 + 'px';
        });
    }

    // Neon flicker animation for some elements
    function randomFlicker() {
        const neonElements = document.querySelectorAll('.neon-btn, .logo-text, .social-icon');
        
        neonElements.forEach(el => {
            if (Math.random() > 0.99) {
                el.style.opacity = Math.random() * 0.5 + 0.5;
                setTimeout(() => {
                    el.style.opacity = 1;
                }, 100);
            }
        });
        
        requestAnimationFrame(randomFlicker);
    }
    
    randomFlicker();
});

function loadActualites() {
    console.log('Tentative de chargement des actualités...');
    fetch('actus.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            console.log('Réponse reçue du serveur pour actus.json');
            return response.json();
        })
        .then(data => {
            console.log('Données JSON parsées avec succès:', data);
            if (!data || !data.actualites || !Array.isArray(data.actualites)) {
                throw new Error('Format de données invalide');
            }
            
            // Trier les actualités par date (du plus récent au plus ancien)
            const actualites = data.actualites.sort((a, b) => {
                const [jourA, moisA, anneeA] = a.date.split(' ');
                const [jourB, moisB, anneeB] = b.date.split(' ');
                const moisMap = {
                    'JAN': 0, 'FEV': 1, 'MAR': 2, 'AVR': 3, 'MAI': 4, 'JUI': 5,
                    'JUL': 6, 'AOU': 7, 'SEP': 8, 'OCT': 9, 'NOV': 10, 'DEC': 11
                };
                const dateA = new Date(parseInt(anneeA), moisMap[moisA], parseInt(jourA));
                const dateB = new Date(parseInt(anneeB), moisMap[moisB], parseInt(jourB));
                return dateB - dateA;
            });

            // Mettre à jour la section "À LA UNE" sur la page d'accueil
            const featuredNewsElement = document.querySelector('.featured-news');
            if (featuredNewsElement && actualites.length > 0) {
                console.log('Mise à jour de la section À LA UNE');
                const featuredNews = actualites[0];
                const featuredCard = document.createElement('div');
                featuredCard.className = 'featured-card';
                featuredCard.innerHTML = `
                    <div class="card-content">
                        <h3>${featuredNews.titre}</h3>
                        <p class="date">${featuredNews.date}</p>
                        <p>${featuredNews.description}</p>
                        <a href="actus.html" class="neon-btn">Lire la suite</a>
                    </div>
                `;
                featuredNewsElement.innerHTML = '';
                featuredNewsElement.appendChild(featuredCard);
            }

            // Mettre à jour la section "DERNIÈRES ACTUS" sur la page d'accueil
            const newsGrid = document.querySelector('.news-grid');
            if (newsGrid && actualites.length > 1) {
                console.log('Mise à jour de la section DERNIÈRES ACTUS');
                newsGrid.innerHTML = '';
                actualites.slice(1, 5).forEach(actualite => {
                    const newsCard = document.createElement('div');
                    newsCard.className = 'news-card';
                    newsCard.innerHTML = `
                        <div class="news-content">
                            <h3>${actualite.titre}</h3>
                            <p class="date">${actualite.date}</p>
                            <p>${actualite.description}</p>
                            <a href="actus.html" class="read-more">
                                Lire la suite
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M5 12h14M12 5l7 7-7 7"/>
                                </svg>
                            </a>
                        </div>
                    `;
                    newsGrid.appendChild(newsCard);
                });
            }

            // Mettre à jour la timeline sur la page des actualités
            const timeline = document.querySelector('.timeline');
            if (timeline) {
                console.log('Mise à jour de la timeline des actualités');
                timeline.innerHTML = '';
                actualites.forEach(actualite => {
                    const timelineItem = document.createElement('div');
                    timelineItem.className = 'timeline-item';
                    timelineItem.setAttribute('data-category', actualite.categorie.toLowerCase());
                    timelineItem.innerHTML = `
                        <div class="timeline-date">
                            <span class="date">${actualite.date}</span>
                        </div>
                        <div class="timeline-content">
                            <h3>${actualite.titre}</h3>
                            <p>${actualite.description}</p>
                            <div class="article-tags">
                                <span class="tag ${actualite.categorie.toLowerCase()}">${actualite.categorie}</span>
                                ${actualite.jeu ? `<span class="tag sot">${actualite.jeu}</span>` : ''}
                            </div>
                        </div>
                    `;
                    timeline.appendChild(timelineItem);
                });
            }
        })
        .catch(error => {
            console.error('Erreur lors du chargement des actualités:', error);
            // Afficher un message d'erreur à l'utilisateur
            const featuredNewsElement = document.querySelector('.featured-news');
            const newsGrid = document.querySelector('.news-grid');
            const timeline = document.querySelector('.timeline');
            
            const errorMessage = `
                <div class="error-message">
                    <p>Désolé, une erreur est survenue lors du chargement des actualités.</p>
                    <p>Veuillez réessayer plus tard.</p>
                </div>
            `;
            
            if (featuredNewsElement) featuredNewsElement.innerHTML = errorMessage;
            if (newsGrid) newsGrid.innerHTML = errorMessage;
            if (timeline) timeline.innerHTML = errorMessage;
        });
}

function loadPalmares() {
    console.log('Début du chargement du palmarès...');
    fetch('palmares.json')
        .then(response => {
            console.log('Réponse reçue du serveur:', response);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Données JSON reçues:', data);
            // Calcul des statistiques
            const participations = data.tournois.length;
            const victoires = data.tournois.filter(t => t.classement === 1).length;
            const podiums = data.tournois.filter(t => t.classement <= 3).length;

            console.log('Statistiques calculées:', { participations, victoires, podiums });

            // Mise à jour des statistiques
            document.getElementById('participations').textContent = participations;
            document.getElementById('victoires').textContent = victoires;
            document.getElementById('podiums').textContent = podiums;

            // Animation des statistiques
            animateValue('participations', 0, participations, 2000);
            animateValue('victoires', 0, victoires, 2000);
            animateValue('podiums', 0, podiums, 2000);

            // Trier les tournois par date (du plus récent au plus ancien)
            const tournoisTries = data.tournois.sort((a, b) => {
                const [jourA, moisA, anneeA] = a.date.split(' ');
                const [jourB, moisB, anneeB] = b.date.split(' ');
                const moisMap = {
                    'JAN': 0, 'FEV': 1, 'MAR': 2, 'AVR': 3, 'MAI': 4, 'JUI': 5,
                    'JUL': 6, 'AOU': 7, 'SEP': 8, 'OCT': 9, 'NOV': 10, 'DEC': 11
                };
                const dateA = new Date(parseInt(anneeA), moisMap[moisA], parseInt(jourA));
                const dateB = new Date(parseInt(anneeB), moisMap[moisB], parseInt(jourB));
                return dateB - dateA;
            });

            console.log('Tournois triés:', tournoisTries);

            // Affichage de la timeline
            const timeline = document.querySelector('.timeline');
            if (timeline) {
                console.log('Timeline trouvée, mise à jour en cours...');
                timeline.innerHTML = '';
                tournoisTries.forEach(tournoi => {
                    const timelineItem = document.createElement('div');
                    timelineItem.className = 'timeline-item';
                    timelineItem.innerHTML = `
                        <div class="timeline-date">
                            <span class="date">${tournoi.date}</span>
                        </div>
                        <div class="timeline-content">
                            <h3>${tournoi.titre}</h3>
                            <p>${tournoi.description}</p>
                            <div class="game-info">
                                <span class="game-tag">${tournoi.jeu}</span>
                            </div>
                            <div class="participants">
                                <h4>Participants :</h4>
                                <ul>
                                    ${tournoi.players.map(player => `<li>${player}</li>`).join('')}
                                </ul>
                            </div>
                            <div class="achievement-icons">
                                <div class="achievement-icon">
                                    <svg viewBox="0 0 100 100" class="medal-svg">
                                        <circle cx="50" cy="50" r="30" class="medal-circle ${tournoi.classement === 1 ? '' : tournoi.classement === 2 ? 'silver' : tournoi.classement === 3 ? 'bronze' : 'blue'}"/>
                                        <text x="50" y="55" class="medal-text" text-anchor="middle">${tournoi.classement}</text>
                                        <rect x="45" y="80" width="10" height="15" class="medal-ribbon ${tournoi.classement === 1 ? '' : tournoi.classement === 2 ? 'silver' : tournoi.classement === 3 ? 'bronze' : 'blue'}"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    `;
                    timeline.appendChild(timelineItem);
                });
                console.log('Timeline mise à jour avec succès');
            } else {
                console.error('Élément timeline non trouvé dans le DOM');
            }
        })
        .catch(error => {
            console.error('Erreur lors du chargement du palmarès:', error);
            // Afficher un message d'erreur à l'utilisateur
            const timeline = document.querySelector('.timeline');
            if (timeline) {
                timeline.innerHTML = `
                    <div class="error-message">
                        <p>Impossible de charger les tournois. Veuillez réessayer plus tard.</p>
                    </div>
                `;
            }
        });
}

function loadTournaments() {
    fetch('palmares.json')
        .then(response => response.json())
        .then(data => {
            const tournamentsGrid = document.querySelector('.tournaments-grid');
            if (!tournamentsGrid) return;

            const sortedTournaments = data.tournaments.sort((a, b) => new Date(b.date) - new Date(a.date));
            const latestTournaments = sortedTournaments.slice(0, 3);

            tournamentsGrid.innerHTML = latestTournaments.map(tournament => `
                <div class="tournament-card ${tournament.rank === 2 ? 'silver' : ''}">
                    <div class="tournament-content">
                        <h3>${tournament.title}</h3>
                        <div class="date">${tournament.date}</div>
                        <p>${tournament.description}</p>
                        <div class="players-list">
                            <span class="players-label">Joueurs :</span>
                            <div class="players">
                                ${tournament.players.map(player => `
                                    <span class="player-tag">${player}</span>
                                `).join('')}
                            </div>
                        </div>
                        <div class="tournament-info">
                            <span class="game-tag">${tournament.game}</span>
                            <div class="achievement-icon">
                                <svg class="medal-svg" viewBox="0 0 100 100">
                                    <circle class="medal-circle ${tournament.rank === 2 ? 'silver' : ''}" cx="50" cy="50" r="40"/>
                                    <text class="medal-text" x="50" y="60" text-anchor="middle">${tournament.rank}</text>
                                    <path class="medal-ribbon ${tournament.rank === 2 ? 'silver' : ''}" d="M30,20 L70,20 L80,40 L20,40 Z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');
        })
        .catch(error => console.error('Erreur lors du chargement des tournois:', error));
}

// Fonction d'animation des valeurs
function animateValue(id, start, end, duration) {
    const element = document.getElementById(id);
    const range = end - start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / range));
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        element.textContent = current;
        if (current === end) {
            clearInterval(timer);
        }
    }, stepTime);
}

// Ajouter des styles pour les transitions
const style = document.createElement('style');
style.textContent = `
    .timeline-item {
        transition: all 0.3s ease-in-out;
    }
`;
document.head.appendChild(style);

