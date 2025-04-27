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

