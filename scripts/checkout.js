import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { renderCheckoutHtml } from "./checkout/checkoutSummary.js";
// import '../data/cart-oop.js';
// import '../data/cart-class.js';
// import '../data/backend-practice.js';
import { loadProducts, loadProductsFetch } from "../data/products.js";
import { loadCart, loadCartFetch } from "../data/cart.js";

async function loadPage() {

  try {
    //throw 'error1';

    await loadProductsFetch();

    const value = await new Promise((resolve, reject) => {
      //throw 'error2';
      loadCart(() => {
        //reject('error3');
        resolve('value 3');
      });
    })
  } catch(error) {
    console.log('unexpected error. please try agian later.')
  }

  renderCheckoutHtml();
  renderOrderSummary();
  renderPaymentSummary();

}

loadPage();

/*
Promise.all([
loadProductsFetch(),
new Promise((resolve) => {
    loadCart(() => {
      resolve();
    });
  })
]).then(() => {
  renderOrderSummary();
  renderPaymentSummary(); 
})
*/

/*
new Promise((resolve) => {
  loadProducts(() => {
    resolve();
  })
}).then(() => {
  return new Promise((resolve) => {
    loadCart(() => {
      resolve();
    });
  })
}).then(() => {
  renderOrderSummary();
  renderPaymentSummary(); 
})
*/



/*
loadProducts(() => {
  loadCart(() => {
    renderOrderSummary();
    renderPaymentSummary();
  })
})
*/


