const QUICK_PRICES = {
    'Cheese':         { Small: 9.99,  Medium: 11.99, Large: 13.99 },
    'Pepperoni':      { Small: 10.99, Medium: 12.99, Large: 14.99 },
    'Veggie Supreme': { Small: 11.99, Medium: 13.99, Large: 15.99 },
    'Meat Lovers':    { Small: 12.99, Medium: 14.99, Large: 16.99 }
};

const BASE_PRICE = { Small: 8.99, Medium: 10.99, Large: 12.99 };
const TOPPING_PRICE = 1.00;
const CHEESE_UPCHARGE = { 'Extra Cheese': 1.00, 'Vegan': 1.00 };

let order = [];
let itemsEl, totalEl, itemCountEl;

function renderOrder() {
    itemsEl.innerHTML = '';
    let total = 0;

    if (order.length === 0) {
        const empty = document.createElement('li');
        empty.className = 'order-empty';
        empty.textContent = 'Your order is empty. Add something tasty!';
        itemsEl.appendChild(empty);
    }

    order.forEach(function (item, idx) {
        total += item.price;

        const li = document.createElement('li');
        li.className = 'order-line';

        const nameSpan = document.createElement('span');
        nameSpan.textContent = item.name;

        const priceSpan = document.createElement('span');
        priceSpan.className = 'order-line-price';
        priceSpan.textContent = '$' + item.price.toFixed(2);

        const removeBtn = document.createElement('button');
        removeBtn.className = 'btn-remove';
        removeBtn.textContent = '\u2715';
        removeBtn.setAttribute('aria-label', 'Remove ' + item.name);
        removeBtn.addEventListener('click', function () {
            order.splice(idx, 1);
            renderOrder();
        });

        li.appendChild(nameSpan);
        li.appendChild(priceSpan);
        li.appendChild(removeBtn);
        itemsEl.appendChild(li);
    });

    totalEl.textContent = total.toFixed(2);

    if (itemCountEl) {
        itemCountEl.textContent = order.length;
        itemCountEl.style.display = order.length > 0 ? 'inline-block' : 'none';
    }
}

function initQuickAdd() {
    const cards = document.querySelectorAll('#popular-list .product-card');

    cards.forEach(function (card) {
        const btn = card.querySelector('.add-quick');

        btn.addEventListener('click', function () {
            const pizza = card.dataset.pizza;
            const size = card.querySelector('.size').value;
            const price = QUICK_PRICES[pizza][size];

            order.push({ name: size + ' ' + pizza, price: price });
            renderOrder();

            btn.textContent = '\u2713 Added!';
            btn.classList.add('btn-added');
            setTimeout(function () {
                btn.textContent = 'Add ' + pizza;
                btn.classList.remove('btn-added');
            }, 1200);
        });
    });
}

function initCustomForm() {
    const form = document.getElementById('custom-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const size = form.size.value;
        const crust = form.crust.value;
        const sauce = form.sauce.value;
        const cheese = form.cheese.value;
        const toppings = Array.from(
            document.querySelectorAll('#toppings input:checked')
        ).map(function (t) { return t.value; });

        let price = BASE_PRICE[size];
        price += CHEESE_UPCHARGE[cheese] || 0;
        price += toppings.length * TOPPING_PRICE;

        let name = size + ' Custom (' + crust + ', ' + sauce + ', ' + cheese;
        if (toppings.length) {
            name += ', ' + toppings.join(', ');
        }
        name += ')';

        order.push({ name: name, price: price });

        document.querySelectorAll('#toppings input:checked').forEach(function (cb) {
            cb.checked = false;
        });

        renderOrder();
    });
}

function initCheckout() {
    const checkoutBtn = document.getElementById('checkout');
    const clearBtn = document.getElementById('clear-order');

    checkoutBtn.addEventListener('click', function () {
        if (order.length === 0) {
            alert('Your order is empty. Add some items first!');
            return;
        }
        showCheckoutModal();
    });

    clearBtn.addEventListener('click', function () {
        order = [];
        renderOrder();
    });
}

function showCheckoutModal() {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    let total = order.reduce(function (sum, item) { return sum + item.price; }, 0);

    overlay.innerHTML = `
        <div class="modal">
            <h3>Checkout</h3>
            <p>Order total: <strong>$${total.toFixed(2)}</strong></p>
            <form id="checkout-form" class="contact-form" novalidate>
                <label for="checkout-name">Name</label>
                <input id="checkout-name" type="text" placeholder="Your name" required>

                <label for="checkout-email">Email</label>
                <input id="checkout-email" type="email" placeholder="you@example.com" required>

                <label for="checkout-phone">Phone</label>
                <input id="checkout-phone" type="tel" placeholder="555-123-4567" required>

                <div class="order-actions">
                    <button type="submit" class="btn btn-primary">Place Order</button>
                    <button type="button" class="btn btn-secondary" id="cancel-checkout">Cancel</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(overlay);

    overlay.querySelector('#cancel-checkout').addEventListener('click', function () {
        overlay.remove();
    });

    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) overlay.remove();
    });

    const phoneInput = overlay.querySelector('#checkout-phone');
    phoneInput.addEventListener('input', function () {
        clearFieldError(phoneInput);
        let digits = phoneInput.value.replace(/\D/g, '').substring(0, 10);
        if (digits.length > 6) {
            phoneInput.value = digits.slice(0, 3) + '-' + digits.slice(3, 6) + '-' + digits.slice(6);
        } else if (digits.length > 3) {
            phoneInput.value = digits.slice(0, 3) + '-' + digits.slice(3);
        } else {
            phoneInput.value = digits;
        }
    });

    const form = overlay.querySelector('#checkout-form');
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const nameField = overlay.querySelector('#checkout-name');
        const emailField = overlay.querySelector('#checkout-email');

        let isValid = true;

        if (!validateField(nameField, PATTERNS.name.regex, PATTERNS.name.msg)) isValid = false;
        if (!validateField(emailField, PATTERNS.email.regex, PATTERNS.email.msg)) isValid = false;
        if (!validateField(phoneInput, PATTERNS.phone.regex, PATTERNS.phone.msg)) isValid = false;

        if (isValid) {
            overlay.querySelector('.modal').innerHTML = `
                <div class="checkout-success">
                    <h3>Order Placed!</h3>
                    <p>Thanks, ${nameField.value}! Your order of <strong>$${total.toFixed(2)}</strong> is being prepared.</p>
                    <p class="demo-note">(This is a demo and no payment was processed.)</p>
                    <button class="btn btn-primary" id="close-modal">Close</button>
                </div>
            `;
            overlay.querySelector('#close-modal').addEventListener('click', function () {
                overlay.remove();
            });
            order = [];
            renderOrder();
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    if (!document.getElementById('order-layout')) return;

    itemsEl = document.getElementById('order-items');
    totalEl = document.getElementById('order-total');
    itemCountEl = document.getElementById('item-count');

    renderOrder();
    initQuickAdd();
    initCustomForm();
    initCheckout();
});
