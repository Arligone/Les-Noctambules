document.addEventListener('DOMContentLoaded', function() {
    loadProducts();

    // Gestion des filtres
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Retirer la classe active de tous les boutons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Ajouter la classe active au bouton cliqué
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            filterProducts(filter);
        });
    });

    // Sélectionner tous les boutons de filtre et la grille de produits
    const productsGrid = document.querySelector('.products-grid');
    const productCards = document.querySelectorAll('.product-card');

    // Animation des cartes au survol
    productCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            if (card.style.visibility !== 'hidden') {
                card.style.transform = 'translateY(-5px) scale(1.02)';
            }
        });

        card.addEventListener('mouseleave', () => {
            if (card.style.visibility !== 'hidden') {
                card.style.transform = 'translateY(0) scale(1)';
            }
        });
    });

    // Fonction pour mettre à jour le stock
    function updateStock(productId, newStock) {
        const stockElement = document.querySelector(`[data-product-id="${productId}"] .stock-value`);
        if (stockElement) {
            stockElement.textContent = newStock;
            
            // Mettre à jour l'état "En stock" ou "Rupture de stock"
            const statusElement = document.querySelector(`[data-product-id="${productId}"] .stock-status`);
            if (statusElement) {
                if (newStock > 0) {
                    statusElement.textContent = 'En stock';
                    statusElement.style.color = 'var(--acid-green)';
                } else {
                    statusElement.textContent = 'Rupture de stock';
                    statusElement.style.color = 'var(--flashy-pink)';
                }
            }
        }
    }

    // Exemple d'utilisation de la fonction updateStock
    // updateStock('product1', 5);
});

function loadProducts() {
    fetch('shop.json')
        .then(response => response.json())
        .then(data => {
            const productsGrid = document.querySelector('.products-grid');
            productsGrid.innerHTML = '';

            data.produits.forEach(produit => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.setAttribute('data-category', produit.categorie);

                // Générer le HTML des détails en fonction du type de produit
                let detailsHTML = '';
                if (produit.details) {
                    if (produit.details.tailles) {
                        detailsHTML += `
                            <div class="detail-row">
                                <span class="detail-label">Tailles:</span>
                                <span class="detail-value">${produit.details.tailles.join(', ')}</span>
                            </div>`;
                    }
                    if (produit.details.couleur) {
                        detailsHTML += `
                            <div class="detail-row">
                                <span class="detail-label">Couleur:</span>
                                <span class="detail-value">${produit.details.couleur}</span>
                            </div>`;
                    }
                    if (produit.details.matiere) {
                        detailsHTML += `
                            <div class="detail-row">
                                <span class="detail-label">Matière:</span>
                                <span class="detail-value">${produit.details.matiere}</span>
                            </div>`;
                    }
                    if (produit.details.dimensions) {
                        detailsHTML += `
                            <div class="detail-row">
                                <span class="detail-label">Dimensions:</span>
                                <span class="detail-value">${produit.details.dimensions}</span>
                            </div>`;
                    }
                    if (produit.details.caracteristiques) {
                        detailsHTML += `
                            <div class="detail-row">
                                <span class="detail-label">Caractéristiques:</span>
                                <span class="detail-value">
                                    <ul class="caracteristiques-list">
                                        ${produit.details.caracteristiques.map(carac => `<li>${carac}</li>`).join('')}
                                    </ul>
                                </span>
                            </div>`;
                    }
                    if (produit.details.contenu) {
                        detailsHTML += `
                            <div class="detail-row">
                                <span class="detail-label">Contenu:</span>
                                <span class="detail-value">
                                    <ul class="contenu-list">
                                        ${produit.details.contenu.map(item => `<li>${item}</li>`).join('')}
                                    </ul>
                                </span>
                            </div>`;
                    }
                }

                productCard.innerHTML = `
                    <div class="card-inner">
                        <div class="card-front">
                            <div class="product-image">
                                <img src="images/${produit.image}" alt="${produit.nom}" class="product-img" onerror="this.src='images/noctambule.jpg'">
                                ${produit.categorie === 'edition-limitee' ? '<div class="limited-badge">Édition Limitée</div>' : ''}
                            </div>
                            <div class="product-info">
                                <h3 class="product-name">${produit.nom}</h3>
                                <span class="product-price">${produit.prix.toFixed(2)} €</span>
                            </div>
                        </div>
                        <div class="card-back">
                            <h3>${produit.nom}</h3>
                            <div class="product-details">
                                <div class="detail-row">
                                    <span class="detail-label">Prix:</span>
                                    <span class="detail-value">${produit.prix.toFixed(2)} €</span>
                                </div>
                                ${detailsHTML}
                                <div class="product-description">
                                    <p>${produit.description}</p>
                                </div>
                                <a href="${produit.lien || '#'}" class="neon-btn" ${produit.lien ? 'target="_blank"' : ''}>
                                    ${produit.lien ? 'Acheter' : 'Bientôt disponible'}
                                </a>
                            </div>
                        </div>
                    </div>
                `;

                productsGrid.appendChild(productCard);
            });
        })
        .catch(error => console.error('Erreur lors du chargement des produits:', error));
}

function filterProducts(filter) {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all') {
            card.style.display = 'block';
        } else {
            const filterMap = {
                'clothing': 'vetements',
                'accessories': 'accessoires',
                'limited': 'edition-limitee'
            };
            card.style.display = category === filterMap[filter] ? 'block' : 'none';
        }
    });
} 