import { cart, removeFromCart, updateCartQuantity, updateDeliveryOption } from "../../data/cart.js";
import { products } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import { deliveryOptions, getDeliveryOption } from "../../data/deliveryOptions.js";
import { renderPaymentSummary } from "./paymentSummary.js";
import { renderCheckoutHtml } from "./checkoutSummary.js";
import { totalCartItems } from "./paymentSummary.js";



export function renderOrderSummary() {
  let cartSummaryHtml = '';

  cart.forEach(cartItem => {
    const productId = cartItem.productId;

    let matchingProduct;
    products.forEach(product => {
      if (product.id === productId) {
        matchingProduct = product;
      }
    })

    const deliveryOptionId = cartItem.deliveryOptionId;

    const deliveryOption = getDeliveryOption(deliveryOptionId);

    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');

    const dateString = deliveryDate.format('dddd, MMMM D');

    cartSummaryHtml += `
              <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
            <div class="delivery-date">
              Delivery date: ${dateString}
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image"
                src="${matchingProduct.image}">

              <div class="cart-item-details">
                <div class="product-name">
                  ${matchingProduct.name}
                </div>
                <div class="product-price">
                  ${matchingProduct.getPrice()}
                </div>
                <div class="product-quantity">
                  <span>
                    Quantity: <span class="quantity-label js-quantity-label-${productId}">${cartItem.quantity}</span>
                  </span>
                  <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProduct.id}">
                    Update
                  </span>
                  <input class="quantity-input js-quantity-link-${matchingProduct.id}">
              <span class="save-quantity-link link-primary js-save-link"
                  data-product-id="${matchingProduct.id}">
                  Save
              </span>
                  <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                ${deliveryOptionsHtml(matchingProduct, cartItem)}
              </div>
            </div>
          </div>
  `;

  })

  function deliveryOptionsHtml(matchingProduct, cartItem) {

    let html = '';

    deliveryOptions.forEach(deliveryOption => {
      const today = dayjs();

      const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');

      const dateString = deliveryDate.format('dddd, MMMM D');

      const priceString = deliveryOption.priceCents === 0 ? 'Free' : `$${formatCurrency(deliveryOption
        .priceCents
      )} -`;

      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      html += ` 
      <div class="delivery-option js-delivery-option" data-product-id="${matchingProduct.id}" data-delivery-option-id="${deliveryOption.id}">
    <input type="radio" ${isChecked ? 'checked' : ''}
      class="delivery-option-input"
      name="delivery-option-${matchingProduct.id}">
    <div>
      <div class="delivery-option-date">
        ${dateString}
      </div>
      <div class="delivery-option-price">
        ${priceString}  Shipping
      </div>
    </div>
  </div>
    `;
    })

    return html;
  }

  document.querySelector('.js-order-summary').innerHTML = cartSummaryHtml;


  document.querySelectorAll('.js-delete-link').forEach(link => {
    link.addEventListener('click', () => {
      const { productId } = link.dataset;

      removeFromCart(productId);

      const container = document.querySelector(`.js-cart-item-container-${productId}`);

      container.remove();

      calculateTotalQuantity();
      renderPaymentSummary();
      renderCheckoutHtml();

    })
  })

  updateCartQuantityInput();

  function updateCartQuantityInput() {
    renderCheckoutHtml();

    document.querySelectorAll('.js-update-link')
      .forEach((link) => {
        link.addEventListener('click', () => {
          const productId = link.dataset.productId;
          
          const container = document.querySelector(
  `.js-cart-item-container-${productId}`
);
          container.classList.add('is-editing-quantity');

          document.body.addEventListener('keydown',(Event) => {
            if(Event.key === 'Enter'){
              updateQuantityALL(link);
            }
          })
      });
    });

    function updateQuantityALL(link) {
      const productId = link.dataset.productId;
      const inputValue = document.querySelector(`.js-quantity-link-${productId}`);
      const newQuantity = Number(inputValue.value);

      if (newQuantity <= 0 || newQuantity > 10) {
        alert('minimum quantity is 1 and maximum quantity is 10 , please update correctly')

        return;
      }

      updateCartQuantity(productId,newQuantity);

      const quantityLabel = document.querySelector(`.js-quantity-label-${productId}`);

      quantityLabel.innerHTML = newQuantity;

      updateCartQuantityInput();

      const container = document.querySelector(
  `.js-cart-item-container-${productId}`
);

      container.classList.remove('is-editing-quantity');

      renderCheckoutHtml();
      renderPaymentSummary();
    }

    document.querySelectorAll('.js-save-link').forEach((link) => {
      link.addEventListener('click', () => {
        updateQuantityALL(link);
      })
    })

    document.querySelectorAll('.js-delivery-option').forEach((element) => {
    element.addEventListener('click', () => {
      const { productId, deliveryOptionId } = element.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      renderCheckoutHtml();
      renderOrderSummary();
      renderPaymentSummary();
    })
  })
  }

 function calculateTotalQuantity() {

    let totalCartQuantity = 0;

    cart.forEach(cartItem => {
      totalCartQuantity += cartItem.quantity;
    })

    document.querySelector('.js-return-to-home-link').innerHTML = `${totalCartQuantity} items`;
  }

  // document.querySelectorAll('.js-delivery-option').forEach((element) => {
  //   element.addEventListener('click', () => {
  //     const { productId, deliveryOptionId } = element.dataset;
  //     updateDeliveryOption(productId, deliveryOptionId);
  //     renderCheckoutHtml();
  //     renderOrderSummary();
  //     renderPaymentSummary();
  //   })
  // })
}

// document.querySelector('.js-return-to-home-link').innerHTML = `${totalCartItems()} items`;