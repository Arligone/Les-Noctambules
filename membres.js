document.addEventListener('DOMContentLoaded', function() {
    // Flip card on touch for mobile devices
    const memberCards = document.querySelectorAll('.member-card');
    
    memberCards.forEach(card => {
        card.addEventListener('touchstart', function() {
            const cardInner = this.querySelector('.card-inner');
            cardInner.style.transform = cardInner.style.transform === 'rotateY(180deg)' ? 'rotateY(0deg)' : 'rotateY(180deg)';
        });
    });
    
    // Add hover effect for member cards
    memberCards.forEach(card => {
        const cardFront = card.querySelector('.card-front');
        
        // Create random decorative elements for each card
        const decorator = document.createElement('div');
        decorator.classList.add('card-decorator');
        
        // Create SVG element with random shapes
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute('viewBox', '0 0 100 100');
        svg.classList.add('decorator-svg');
        
        // Add random shapes to the SVG
        const shapes = ['circle', 'rect', 'polygon', 'path'];
        const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
        const element = document.createElementNS("http://www.w3.org/2000/svg", randomShape);
        
        // Set attributes based on shape type
        switch(randomShape) {
            case 'circle':
                element.setAttribute('cx', '50');
                element.setAttribute('cy', '50');
                element.setAttribute('r', '30');
                break;
            case 'rect':
                element.setAttribute('x', '20');
                element.setAttribute('y', '20');
                element.setAttribute('width', '60');
                element.setAttribute('height', '60');
                break;
            case 'polygon':
                element.setAttribute('points', '50,20 80,50 50,80 20,50');
                break;
            case 'path':
                element.setAttribute('d', 'M20,50 C20,20 80,20 80,50 C80,80 20,80 20,50 Z');
                break;
        }
        
        // Set common attributes
        element.setAttribute('fill', 'none');
        element.setAttribute('stroke', 'var(--acid-green)');
        element.setAttribute('stroke-width', '1');
        element.setAttribute('opacity', '0.3');
        
        svg.appendChild(element);
        decorator.appendChild(svg);
        
        // Add subtle parallax effect on mouse move
        card.addEventListener('mousemove', (e) => {
            const cardRect = card.getBoundingClientRect();
            const x = e.clientX - cardRect.left;
            const y = e.clientY - cardRect.top;
            
            const xPercent = (x / cardRect.width - 0.5) * 10;
            const yPercent = (y / cardRect.height - 0.5) * 10;
            
            card.querySelector('.member-avatar').style.transform = `translate(${xPercent}px, ${yPercent}px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.querySelector('.member-avatar').style.transform = 'translate(0, 0)';
        });
    });
    
    // Add scroll animation for join section
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

    const joinSection = document.querySelector('.join-section');
    if (joinSection) {
        observer.observe(joinSection);
    }
    
    // Animate requirements list items
    const reqItems = document.querySelectorAll('.requirements li');
    reqItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        item.style.transitionDelay = `${index * 0.1}s`;
        
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, 500);
    });
});

// Chargement des données des membres
document.addEventListener('DOMContentLoaded', () => {
    fetch('membres.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors du chargement des données des membres');
            }
            return response.json();
        })
        .then(data => {
            const membersGrid = document.querySelector('.members-grid');
            if (!membersGrid) return;

            data.membres.forEach(membre => {
                const memberCard = createMemberCard(membre);
                membersGrid.appendChild(memberCard);
            });

            // Initialiser les animations après le chargement des cartes
            initAnimations();
        })
        .catch(error => {
            console.error('Erreur:', error);
            const membersGrid = document.querySelector('.members-grid');
            if (membersGrid) {
                membersGrid.innerHTML = `
                    <div class="error-message">
                        <p>Une erreur est survenue lors du chargement des données des membres.</p>
                        <p>Veuillez réessayer plus tard.</p>
                    </div>
                `;
            }
        });
});

function createMemberCard(membre) {
    const card = document.createElement('div');
    card.className = 'member-card';

    const cardInner = document.createElement('div');
    cardInner.className = 'card-inner';

    // Front of the card
    const cardFront = document.createElement('div');
    cardFront.className = 'card-front';

    const memberImage = document.createElement('div');
    memberImage.className = 'member-image';
    
    if (membre.image === 'svg') {
        memberImage.innerHTML = createSVGAvatar();
    } else {
        const img = document.createElement('img');
        img.src = membre.image;
        img.alt = membre.nom;
        img.className = 'member-avatar';
        img.width = 300;
        img.height = 400;
        img.loading = 'eager';
        img.style.display = 'block';
        memberImage.appendChild(img);
    }

    const memberInfo = document.createElement('div');
    memberInfo.className = 'member-info';

    const name = document.createElement('h3');
    name.className = 'member-name';
    name.textContent = membre.nom;

    const role = document.createElement('span');
    role.className = 'member-role';
    role.textContent = membre.role;

    const quote = document.createElement('p');
    quote.className = 'member-quote';
    quote.textContent = membre.citation;

    memberInfo.appendChild(name);
    memberInfo.appendChild(role);
    memberInfo.appendChild(quote);

    cardFront.appendChild(memberImage);
    cardFront.appendChild(memberInfo);

    // Back of the card
    const cardBack = document.createElement('div');
    cardBack.className = 'card-back';

    const backName = document.createElement('h3');
    backName.textContent = membre.nom;

    const memberDetails = document.createElement('div');
    memberDetails.className = 'member-details';

    if (membre.details) {
        // Ajout des détails spécifiques
        const detailsToShow = {
            'Rôle:': membre.details.role_specifique,
            'Spécialité:': membre.details.specialite,
            'Dans la team:': membre.details.date_arrivee,
            'Jeux:': membre.details.jeux
        };

        for (const [label, value] of Object.entries(detailsToShow)) {
            const detailRow = document.createElement('div');
            detailRow.className = 'detail-row';

            const detailLabel = document.createElement('span');
            detailLabel.className = 'detail-label';
            detailLabel.textContent = label;

            const detailValue = document.createElement('span');
            detailValue.className = 'detail-value';
            detailValue.textContent = value;

            detailRow.appendChild(detailLabel);
            detailRow.appendChild(detailValue);
            memberDetails.appendChild(detailRow);
        }

        if (membre.details.bio) {
            const bioRow = document.createElement('div');
            bioRow.className = 'detail-row bio';
            const bioText = document.createElement('p');
            bioText.textContent = membre.details.bio;
            bioRow.appendChild(bioText);
            memberDetails.appendChild(bioRow);
        }
    }

    // Réseaux sociaux
    const socialLinks = document.createElement('div');
    socialLinks.className = 'member-socials';

    membre.reseaux.forEach(reseau => {
        const socialBadge = document.createElement('a');
        socialBadge.href = reseau.url;
        socialBadge.className = `social-badge ${reseau.type}`;
        socialBadge.target = '_blank';
        socialBadge.rel = 'noopener noreferrer';

        socialBadge.innerHTML = `
            <svg viewBox="0 0 24 24" class="badge-icon">
                ${getSocialIconPath(reseau.type)}
            </svg>
            <span>${reseau.nom_utilisateur || reseau.url.split('/').pop()}</span>
        `;

        socialLinks.appendChild(socialBadge);
    });

    memberDetails.appendChild(socialLinks);
    cardBack.appendChild(backName);
    cardBack.appendChild(memberDetails);

    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);

    return card;
}

function createSVGAvatar() {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="35" r="25" fill="${randomColor}"/>
        <circle cx="50" cy="95" r="35" fill="${randomColor}"/>
    </svg>`;
}

function getSocialIconPath(type) {
    const icons = {
        github: '<path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/>',
        linkedin: '<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>',
        twitter: '<path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>',
        dribbble: '<path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4-.814zm-11.62-2.58c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 11.775 2.206 11.71 1.756 11.7l-.004.312c0 2.633.998 5.037 2.634 6.855zm-2.42-8.955c.46.008 4.683.026 9.477-1.248-1.698-3.018-3.53-5.558-3.8-5.928-2.868 1.35-5.01 3.99-5.676 7.17zM9.6 2.052c.282.38 2.145 2.914 3.822 6 3.645-1.365 5.19-3.44 5.373-3.702-1.81-1.61-4.19-2.586-6.795-2.586-.825 0-1.63.1-2.4.285zm10.335 3.483c-.218.29-1.935 2.493-5.724 4.04.24.49.47.985.68 1.486.08.18.15.36.22.53 3.41-.43 6.8.26 7.14.33-.02-2.42-.88-4.64-2.31-6.38z"/>',
        twitch: '<path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>'
    };
    return icons[type] || '';
}

function initAnimations() {
    // Add any additional animation initialization here
    const memberCards = document.querySelectorAll('.member-card');
    memberCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
        card.classList.add('animate');
    });
}

