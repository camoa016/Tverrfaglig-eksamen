const productForm = document.getElementById('product-form');
const productsContainer = document.getElementById('products');
const messageEl = document.getElementById('message');
const submitButton = document.getElementById('submit-button');
const cancelButton = document.getElementById('cancel-button');

let editingProductId = null;

function showMessage(text, isError = false) {
    messageEl.textContent = text;
    messageEl.style.color = isError ? '#d32f2f' : '#0070f3';
}

function setFormMode(editing) {
    if (editing) {
        submitButton.textContent = 'Oppdater produkt';
        cancelButton.classList.remove('hidden');
    } else {
        submitButton.textContent = 'Legg til produkt';
        cancelButton.classList.add('hidden');
        editingProductId = null;
    }
}

function resetForm() {
    productForm.reset();
    setFormMode(false);
}

function createProductCard(product) {
    return `
        <div class="product-card" data-id="${product.id}">
            <h3>${product.navn}</h3>
            <p class="product-price">Kr ${Number(product.pris).toFixed(2)}</p>
            <p>${product.beskrivelse || 'Ingen beskrivelse'}</p>
            ${product.bilde ? `<p><a href="${product.bilde}" target="_blank">Se bilde</a></p>` : ''}
            <div class="product-actions">
                <button type="button" class="edit-btn" data-id="${product.id}">Rediger</button>
                <button type="button" class="delete-btn" data-id="${product.id}">Slett</button>
            </div>
        </div>
    `;
}

async function fetchProducts() {
    try {
        const response = await fetch('/produkter');
        if (!response.ok) {
            throw new Error('Failed to load products');
        }
        const products = await response.json();
        if (!products.length) {
            productsContainer.innerHTML = '<p>Ingen produkter funnet.</p>';
            return;
        }

        productsContainer.innerHTML = products.map(createProductCard).join('');
        attachProductEventListeners();
    } catch (error) {
        console.error(error);
        productsContainer.innerHTML = '<p>Kunne ikke laste produkter.</p>';
    }
}

async function updateProduct(productId, data) {
    const response = await fetch(`/produkter/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error('Feilet ved oppdatering av produkt');
    }
    return response.json();
}

async function deleteProduct(productId) {
    const confirmed = window.confirm('Er du sikker på at du vil slette dette produktet?');
    if (!confirmed) {
        return;
    }
    const response = await fetch(`/produkter/${productId}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Feilet ved sletting av produkt');
    }
    await response.json();
    showMessage('Produkt slettet.');
    fetchProducts();
}

function attachProductEventListeners() {
    const editButtons = productsContainer.querySelectorAll('.edit-btn');
    const deleteButtons = productsContainer.querySelectorAll('.delete-btn');

    editButtons.forEach((button) => {
        button.addEventListener('click', async () => {
            const productId = button.dataset.id;
            try {
                const response = await fetch(`/produkter/${productId}`);
                if (!response.ok) {
                    throw new Error('Failed to load product for editing');
                }
                const product = await response.json();
                editingProductId = product.id;
                document.getElementById('navn').value = product.navn;
                document.getElementById('pris').value = product.pris;
                document.getElementById('bilde').value = product.bilde || '';
                document.getElementById('beskrivelse').value = product.beskrivelse || '';
                setFormMode(true);
                showMessage('Redigerer produkt: ' + product.navn);
            } catch (error) {
                console.error(error);
                showMessage('Kunne ikke laste produkt for redigering.', true);
            }
        });
    });

    deleteButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const productId = button.dataset.id;
            deleteProduct(productId).catch((error) => {
                console.error(error);
                showMessage('Kunne ikke slette produktet.', true);
            });
        });
    });
}

productForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const navn = document.getElementById('navn').value.trim();
    const prisValue = document.getElementById('pris').value;
    const beskrivelse = document.getElementById('beskrivelse').value.trim();
    const bilde = document.getElementById('bilde').value.trim();
    const pris = parseFloat(prisValue);

    if (!navn || Number.isNaN(pris) || pris < 0) {
        showMessage('Vennligst fyll inn gyldig navn og pris.', true);
        return;
    }

    const payload = { navn, beskrivelse, pris, bilde };

    try {
        let result;
        if (editingProductId) {
            result = await updateProduct(editingProductId, payload);
            showMessage(`Produkt oppdatert: ${result.navn}`);
        } else {
            const response = await fetch('/produkter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                throw new Error('Feilet ved opprettelse av produkt');
            }
            result = await response.json();
            showMessage(`Produkt lagt til: ${result.navn}`);
        }

        resetForm();
        fetchProducts();
    } catch (error) {
        console.error(error);
        showMessage('Kunne ikke lagre produktet. Prøv igjen.', true);
    }
});

cancelButton.addEventListener('click', () => {
    resetForm();
    showMessage('Redigering avbrutt.');
});

fetchProducts();
