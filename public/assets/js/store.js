window.Store = {};

window.getTemplate = function(name) {
  var template;
  template = null;
  $.ajax({
    'async': false,
    'type': 'GET',
    'dataType': 'html',
    'url': '/templates/' + name + '.hbs',
    'data': '',
    'success': function(data) {
      template = Handlebars.compile(data);
    }
  });
  return template;
};

Store.loadProducts = function() {
  return Chec.Products.list(function(products) {
    var template;
    template = getTemplate('product-card');
    return $.each(products.data, function(k, product) {
      $('#products').append(template(product));
      if (k && (k % 2 === 0)) {
        return $('#products').append('<hr class="product-break">');
      }
    });
  });
};

Store.addToCart = function(add) {
  return Chec.Cart.add(add, function(resp) {
    $('.cart-total').html(resp.cart.subtotal.formatted_with_symbol);
    return alert('Item added to cart!');
  });
};

Store.updateCartTotal = function() {
  return Chec.Cart.retrieve(function(resp) {
    return $('.cart-total').html(resp.subtotal.formatted_with_symbol);
  });
};

Store.loadCart = function() {
  return Chec.Cart.retrieve(function(resp) {
    var template;
    template = getTemplate('cart');
    return $('#cart .container').html(template(resp));
  });
};

Store.removeItem = function(id) {
  return Chec.Cart.remove(id, function(resp) {
    var template;
    template = getTemplate('cart');
    return $('#cart .container').html(template(resp.cart));
  });
};

Store.updateQuantity = function(id, quantity) {
  return Chec.Cart.update(id, {
    'quantity': quantity
  }, function(resp) {
    var template;
    if (resp.success === true) {
      template = getTemplate('cart');
      return $('#cart .container').html(template(resp.cart));
    }
  });
};

Store.checkoutVerifyQuantity = function(token, line_item_id, quantity) {
  return Chec.Checkout.checkQuantity(token, line_item_id, {
    'amount': quantity
  }, function(resp) {
    if (resp.available === true) {
      return Store.checkoutUpdateTotals(resp.live);
    }
  });
};

Store.checkoutVerifyShipping = function(token, country, id) {
  return Chec.Checkout.checkShippingOption(token, {
    country: country,
    id: id
  }, function(resp) {
    console.log(resp);
    if (resp.valid === true) {
      return Store.checkoutUpdateTotals(resp.live);
    }
  });
};

Store.checkoutVerifyTax = function(token) {
  return Chec.Checkout.setTaxZone(token, {
    country: $('select[name="shipping[country]"]').val(),
    region: $('select[name="shipping[county_state]"]').val(),
    postal_zip_code: $('input[name="shipping[postal_zip_code]"]').val()
  }, function(resp) {
    console.log(resp);
    if (resp.valid === true) {
      return Store.checkoutUpdateTotals(resp.live);
    }
  });
};

Store.loadCheckout = function() {
  return Chec.Checkout.generateToken(Chec.Cart.id(), {
    'type': 'cart'
  }, function(token) {
    var template;
    template = getTemplate('checkout');
    return $('#checkout .container').html(template(token));
  });
};

Store.checkoutUpdateTotals = function(live) {
  console.log(live);
  $.each(live.line_items, function(k, v) {
    $('[data-line-item-id="' + v.id + '"] .quantity').val(v.quantity);
    return $('[data-line-item-id="' + v.id + '"] .line-total').html(v.line_total.formatted_with_symbol);
  });
  $('.subtotal-amount').html(live.subtotal.formatted_with_symbol);
  $('.shipping-amount').html(live.shipping.price.formatted_with_symbol);
  $('.tax-amount').html(live.tax.amount.formatted_with_symbol);
  return $('.total-amount').html(live.total_with_tax.formatted_with_symbol);
};

Store.checkoutNow = function(token) {
  $('form[name="checkout_form"').serializeJSON();
  return Chec.Checkout.capture(token, $('form[name="checkout_form"').serializeJSON(), function(resp) {
    console.log(resp);
    return alert('Sent! Check console for result');
  });
};

Store.loadProducts();
