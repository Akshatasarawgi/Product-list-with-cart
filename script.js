let cart = [];

const emptyCartContainer = document.querySelector('.emptyCartContainer');
const itemsAdded = document.querySelector('.item-added');
const orderTotalContainer = document.querySelector('.order-total');
const cartFooter = document.querySelector('.cart-footer');
const confirmOrderBtn = document.querySelector('.confirm-order-btn');
const confirmationContainer = document.querySelector('.confirmationContainer');
const confirmedItemsContainer = document.querySelector('.confirmed-items');
const confirmedTotalContainer = document.querySelector('.confirmed-total-amount');
const overlay = document.querySelector('.overlay');


confirmationContainer.style.display = 'none';

if (cart.length === 0) {
emptyCartContainer.style.display = "block";
emptyCartContainer.classList.add('empty');
itemsAdded.style.display = "none";
orderTotalContainer.style.display = "none";
cartFooter.style.display = "none";
confirmOrderBtn.style.display = "none";
}

function updateCartDisplay() {
  const orderTotal = document.querySelector('.total-amount');
  const cartQuantity = document.querySelector('.total-quantity');

  itemsAdded.innerHTML = '';
  let totalAmount = 0;
  let totalQuantity = 0;

  cart.forEach(item => {
    
  totalQuantity += item.quantity;  
  let itemTotal = item.quantity * item.price;
  totalAmount += itemTotal;

  const itemElement = document.createElement('div');
  itemElement.classList.add('item-added1');
  
  itemElement.innerHTML = `
  
  <h5>${item.name}</h5>
    <div class="item-info">
      <div class="item-quantity">
        <h5 class="quantity">${item.quantity}x</h5>
        <h5 class="price-per-item">$${item.price}</h5>
        <h5 class="total-per-price">$${itemTotal.toFixed(2)}</h5>
      </div>
      <div class = "remove-item">
        <img src="./assets/images/icon-remove-item.svg" alt="remove item">
      </div>
    </div>
   
  `;

  itemsAdded.appendChild(itemElement);
});

  cartQuantity.textContent = `${totalQuantity}`;
  orderTotal.textContent = `$${totalAmount.toFixed(2)}`;

  if(cart.length > 0) {
  emptyCartContainer.style.display = "none";
  emptyCartContainer.classList.remove('empty');
  itemsAdded.style.display = "block";
  orderTotalContainer.style.display = "flex";
  cartFooter.style.display = "block";
  confirmOrderBtn.style.display = "inline-block";
  }
  else {
  emptyCartContainer.style.display = "block";
  emptyCartContainer.classList.add('empty');
  itemsAdded.style.display = "none";
  orderTotalContainer.style.display = "none";
  cartFooter.style.display = "none";
  confirmOrderBtn.style.display = "none";
  }

}


function addToCart(name, price, productElement) {
  let existingItem = cart.find(item => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  }
  else {
    cart.push ( {name, price, quantity : 0});
  }

  updateCartDisplay();
  updateProductControls(name, productElement);

}

function removeFromCart(name, productElement) {
  let existingItem = cart.find(item => item.name === name);
  if (existingItem) {
    existingItem.quantity -= 1;
    if (existingItem.quantity === 0) {
      cart = cart.filter(i => i.name !== name);
    }
  }
  updateCartDisplay();
  updateProductControls(name, productElement);
}

function updateProductControls(name, productElement) {
  const item = cart.find(i => i.name === name);
  const addToCartBtn = productElement.querySelector('.add-to-cart');
  const controls = productElement.querySelector('.quantity-controls');
  const quantityText = controls.querySelector('.quantity');

  if (item) {
    addToCartBtn.style.display = 'none';
    controls.style.display = 'flex';
    quantityText.textContent = item.quantity;
  } else {
    addToCartBtn.style.display = 'flex';
    controls.style.display = 'none';
  }
}

document.querySelectorAll('.product').forEach(product => {
  const addBtn = product.querySelector('.add-to-cart');
  const name = addBtn.getAttribute('data-name');
  const price = parseFloat(addBtn.getAttribute('data-price').replace('$', ''));
  const increaseBtn = product.querySelector('.increase');
  const decreaseBtn = product.querySelector('.decrease');

  addBtn.addEventListener('click', () => addToCart(name, price, product));
  increaseBtn.addEventListener('click', () => addToCart(name, price, product));
  decreaseBtn.addEventListener('click', () => removeFromCart(name, product));
});

/* Adding event listeners to the add to cart buttons*/ 
document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', () => {
    const name =  button.getAttribute('data-name');
    const price = parseFloat(button.getAttribute('data-price').replace('$',''));
    const productElement = button.closest('.product');
    addToCart( name, price, productElement);
  })
})

/* Remove item from cart */
document.querySelector('.cart').addEventListener('click', event => {
  const removeBtn = event.target.closest('.remove-item');
  if (!removeBtn) return;

  const itemName= removeBtn.closest('.item-added1').querySelector('h5').textContent;

  cart = cart.filter(item => item.name !== itemName);
  updateCartDisplay();

});

/* To display confirmation pop up when clicked on confirm order */
confirmOrderBtn.addEventListener('click', () => {

  overlay.style.display = 'block';
  confirmationContainer.style.display = 'block';

  confirmedItemsContainer.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    const itemTotal = item.quantity * item.price;
    total += itemTotal;

    const confirmedItem = document.createElement('div');
    confirmedItem.classList.add('confirmed-item');

    confirmedItem.innerHTML = `
      <img src="./assets/images/image-${item.name.toLowerCase().replace(/ /g, "-").replace(/[^a-z-]/g, "")}-thumbnail.jpg" alt="${item.name}">
      <div>
        <div class="confirmed-item-name"><h5>${item.name}</h5></div>
        <div class="confirmed-quantity-price">
          <div class="quantity-price">
            <h5 class="confirmed-quantity">${item.quantity}x</h5>
            <h5 class="confirmed-price-per-quantity">@$${item.price.toFixed(2)}</h5>
          </div>
          <h4 class="confirmed-price-item-total">$${itemTotal.toFixed(2)}</h4>
        </div>
      </div>
    `;

    confirmedItemsContainer.appendChild(confirmedItem);

  });
  
  const totalAmount = document.createElement('div');
  totalAmount.classList.add('confirmed-total');

  totalAmount.innerHTML = `<div class="confirmed-total">
      <h5>Order total</h5>
      <h3 class="confirmed-total-amount">$${total.toFixed(2)}</h3>
      </div>`;

  confirmedItemsContainer.appendChild(totalAmount);
  confirmationContainer.style.display = 'block';
  
});

/*This will take us back to the original page */

document.querySelector('.startNewOrder').addEventListener('click', () => {
  cart = [];
  updateCartDisplay();
 
  confirmationContainer.style.display = 'none';
  overlay.style.display = 'none';

  document.querySelectorAll('.product').forEach(product => {
    updateProductControls(product.querySelector('.add-to-cart').getAttribute('data-name'), product);
  });

  })