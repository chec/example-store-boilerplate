window.Store = {}

window.getTemplate = (name) ->
  template = null
  $.ajax
    'async': false
    'type': 'GET'
    'dataType': 'html'
    'url': '/templates/'+name+'.hbs'
    'data': ''
    'success': (data) ->
      template = Handlebars.compile(data)
      return
  template


Store.loadProducts = () ->
    Chec.Products.list((products) ->
        template = getTemplate('product-card');
        $.each(products.data, (k, product) ->
            $('#products').append(template(product));
            if k and (k % 2 is 0)
              $('#products').append('<hr class="product-break">');
        )
    )

Store.addToCart = (add) ->
  Chec.Cart.add add, (resp) ->
    $('.cart-total').html(resp.cart.subtotal.formatted_with_symbol)
    alert('Item added to cart!');

Store.updateCartTotal = () ->
  Chec.Cart.retrieve (resp) ->
    $('.cart-total').html(resp.subtotal.formatted_with_symbol)

Store.loadCart = () ->
  Chec.Cart.retrieve (resp) ->
    template = getTemplate('cart');
    $('#cart .container').html(template(resp));

Store.removeItem = (id) ->
  Chec.Cart.remove id, (resp) ->
    template = getTemplate('cart');
    $('#cart .container').html(template(resp.cart));

Store.updateQuantity = (id, quantity) ->
  Chec.Cart.update id, {'quantity': quantity},  (resp) ->
    if resp.success is true
      template = getTemplate('cart');
      $('#cart .container').html(template(resp.cart));

Store.checkoutVerifyQuantity = (token, line_item_id,  quantity) ->
  Chec.Checkout.checkQuantity token, line_item_id, {'amount': quantity},  (resp) ->
    if resp.available is true
      Store.checkoutUpdateTotals resp.live

Store.checkoutVerifyShipping = (token, country, id) ->
  Chec.Checkout.checkShippingOption token, { country: country, id: id},  (resp) ->
    console.log resp
    if resp.valid is true
      Store.checkoutUpdateTotals resp.live

Store.checkoutVerifyTax = (token) ->
  Chec.Checkout.setTaxZone token, { country: $('select[name="shipping[country]"]').val(), region: $('select[name="shipping[county_state]"]').val(), postal_zip_code: $('input[name="shipping[postal_zip_code]"]').val()},  (resp) ->
    console.log resp
    if resp.valid is true
      Store.checkoutUpdateTotals resp.live


Store.loadCheckout = () ->
    Chec.Checkout.generateToken Chec.Cart.id(), {'type': 'cart'},  (token) ->
        template = getTemplate('checkout');
        $('#checkout .container').html(template(token));

Store.checkoutUpdateTotals = (live) ->
  console.log live
  $.each(live.line_items, (k, v) ->
        $('[data-line-item-id="'+v.id+'"] .quantity').val(v.quantity)
        $('[data-line-item-id="'+v.id+'"] .line-total').html(v.line_total.formatted_with_symbol)
    )
  $('.subtotal-amount').html(live.subtotal.formatted_with_symbol);
  $('.shipping-amount').html(live.shipping.price.formatted_with_symbol);
  $('.tax-amount').html(live.tax.amount.formatted_with_symbol);
  $('.total-amount').html(live.total_with_tax.formatted_with_symbol);

Store.checkoutNow = (token) ->
  $('form[name="checkout_form"').serializeJSON()
  Chec.Checkout.capture(token, $('form[name="checkout_form"').serializeJSON(), (resp) ->
    console.log resp
    alert('Sent! Check console for result')

);
