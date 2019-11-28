/* global window */
import $ from 'jquery';
import serializeJSON from 'jquery-serializejson';
import getTemplate from './templates';

export default () => {
  const { commerce } = window;

  let Store = {};

  Store.loadProducts = () => {
    commerce.products.list().then(products => {
      const template = getTemplate('product-card');
      const productsSelector = $('#products');

      return $.each(products.data, (k, product) => {
        productsSelector.append(template(product));
        if (k && ((k % 2) === 0)) {
          return productsSelector.append('<hr class="product-break">');
        }
      });
    });
  };

  Store.addToCart = add => {
    commerce.cart.add(add).then(resp => {
      $('.cart-total').html(resp.cart.subtotal.formatted_with_symbol);
      return alert('Item added to cart!');
    });
  }

  Store.updateCartTotal = () => {
    commerce.cart.retrieve()
      .then(resp => $('.cart-total').html(resp.subtotal.formatted_with_symbol));
  };

  Store.loadCart = () => {
    commerce.cart.retrieve()
      .then(resp => {
        const template = getTemplate('cart');
        return $('#cart .container').html(template(resp));
      });
  };

  Store.removeItem = id => {
    commerce.cart.remove(id)
      .then(resp => {
        const template = getTemplate('cart');
        return $('#cart .container').html(template(resp.cart));
      });
  }

  Store.updateQuantity = (id, quantity) => {
    commerce.cart.update(id, { quantity })
    .then(resp => {
      if (resp.success === true) {
        const template = getTemplate('cart');
        return $('#cart .container').html(template(resp.cart));
      }
    });
  };

  Store.checkoutVerifyQuantity = (token, line_item_id, quantity) => {
    commerce.checkout.checkQuantity(token, line_item_id, { amount: quantity })
      .then(resp => {
        if (resp.available === true) {
          return Store.checkoutUpdateTotals(resp.live);
        }
      });
  };

  Store.checkoutVerifyShipping = (token, country, id) => {
    commerce.checkout.checkShippingOption(token, { country, id })
      .then(resp => {
        console.log(resp);
        if (resp.valid === true) {
          return Store.checkoutUpdateTotals(resp.live);
        }
     });
  };

  Store.checkoutVerifyTax = token => {
    commerce.checkout.setTaxZone(token, {
      country: $('select[name="shipping[country]"]').val(),
      region: $('select[name="shipping[county_state]"]').val(),
      postal_zip_code: $('input[name="shipping[postal_zip_code]"]').val()
    })
      .then(resp => {
        console.log(resp);
        if (resp.valid === true) {
          return Store.checkoutUpdateTotals(resp.live);
        }
      });
  };


  Store.loadCheckout = async () => {
    const cartId = await commerce.cart.id();
    commerce.checkout.generateToken(cartId, { type: 'cart' })
      .then(token => {
        const template = getTemplate('checkout');
        return $('#checkout .container').html(template(token));
      });
  };

  Store.checkoutUpdateTotals = live => {
    $.each(live.line_items, (k, v) => {
      $(`[data-line-item-id="${v.id}"] .quantity`).val(v.quantity);
      return $(`[data-line-item-id="${v.id}"] .line-total`).html(v.line_total.formatted_with_symbol);
    });
    $('.subtotal-amount').html(live.subtotal.formatted_with_symbol);
    $('.shipping-amount').html(live.shipping.price.formatted_with_symbol);
    $('.tax-amount').html(live.tax.amount.formatted_with_symbol);
    return $('.total-amount').html(live.total_with_tax.formatted_with_symbol);
  };

  Store.checkoutNow = token => {
    const formData = $('form[name="checkout_form"]').serializeJSON();
    commerce.checkout.capture(token, formData)
      .then(resp => {
        console.log(resp);
        $('.error-container').empty().addClass('invisible');
        return alert('Sent! Check console for result');
      })
      .catch(error => {
        $('.error-container').removeClass('invisible').html(`Something went wrong: ${error.message}`);
      });
  };

  window.Store = Store;
  window.Store.loadProducts();
  window.Store.updateCartTotal();
};
