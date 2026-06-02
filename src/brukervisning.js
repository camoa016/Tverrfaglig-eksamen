const productsContainer = document.getElementById('products');
const productDetails = document.getElementById('product-details');
let products = [];

function escapeHtml(text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function createProductCard(product) {
    return `
        <article class="product-card" data-id="${product.id}" tabindex="0" role="button" aria-label="Vis detaljer for ${escapeHtml(product.navn)}">
            <h3>${escapeHtml(product.navn)}</h3>
            <p class="product-price">Kr ${Number(product.pris).toFixed(2)}</p>
            <p>${escapeHtml(product.beskrivelse || 'Ingen beskrivelse')}</p>
            ${product.bilde ? `<p><a href="${escapeHtml(product.bilde)}" target="_blank" rel="noreferrer">Se bilde</a></p>` : ''}
        </article>
    `;
}

function renderProducts(productList) {
    products = productList;
    if (!products.length) {
        productsContainer.innerHTML = '<p>Ingen produkter funnet.</p>';
        return;
    }
    productsContainer.innerHTML = products.map(createProductCard).join('');
}

function closeProductDetails() {
    productDetails.innerHTML = '';
    productDetails.classList.add('hidden');
}

function showProductDetails(product) {
    productDetails.innerHTML = `
        <div class="details-card">
            <button type="button" class="details-close" aria-label="Lukk produktdetaljer">×</button>
            <div class="details-header">
                <div>
                    <h3>${escapeHtml(product.navn)}</h3>
                    <p class="details-price">Kr ${Number(product.pris).toFixed(2)}</p>
                </div>
            </div>
            <p class="details-description">${escapeHtml(product.beskrivelse || 'Ingen beskrivelse lagt til.')}</p>
            ${product.bilde ? `
                <div class="details-image">
                    <img src="${escapeHtml(product.bilde)}" alt="${escapeHtml(product.navn)} bilde">
                </div>
                <p class="details-link-wrapper"><a class="details-link" href="${escapeHtml(product.bilde)}" target="_blank" rel="noreferrer">Åpne bilde i ny fane</a></p>
            ` : ''}
        </div>
    `;
    productDetails.classList.remove('hidden');
    productDetails.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function handleProductSelection(event) {
    const card = event.target.closest('.product-card');
    if (!card) return;
    const id = card.dataset.id;
    const product = products.find(item => String(item.id) === String(id));
    if (!product) return;
    showProductDetails(product);
}

async function fetchProducts() {
    try {
        const response = await fetch('/produkter');
        if (!response.ok) {
            throw new Error('Failed to load products');
        }
        const data = await response.json();
        renderProducts(data);
    } catch (error) {
        console.error(error);
        productsContainer.innerHTML = '<p>Kunne ikke laste produkter.</p>';
    }
}

productsContainer.addEventListener('click', handleProductSelection);
productsContainer.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
        handleProductSelection(event);
    }
});

productDetails.addEventListener('click', event => {
    if (event.target.closest('.details-close')) {
        closeProductDetails();
    }
});

fetchProducts();
