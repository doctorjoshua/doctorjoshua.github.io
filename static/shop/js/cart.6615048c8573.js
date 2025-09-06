// Track pending cart operations
let is_pending_cart_operation = false;


function addToCart(id_product, quantity = 1) {
  // show message while we wait
  $(".js-cart-message").hide()
  cartMessageProductId = "#cart-message-product-" + id_product
  $(cartMessageProductId).html("<div class='mt-3 text-success'>Adding to cart...</div>")
  $(cartMessageProductId).show()

  // if a cart operation is already pending, do not execute the current request
  if (is_pending_cart_operation) {
    $(cartMessageProductId).html("<div class='mt-3 text-danger'>Another operation is already pending. Please wait for it to complete.</div>")
    $(cartMessageProductId).show()
    return;
  }
  is_pending_cart_operation = true; // set the flag to true to prevent multiple requests

  // get the add to cart button
  button = $("#btn-add-cart-product-" + id_product)

  // get the selected options
  id_product_option_choice_1 = 0;
  if ( $('input[name="product-option-1"]:checked').length ) {
      id_product_option_choice_1 = $('input[name="product-option-1"]:checked').val();
  }
  id_product_option_choice_2 = 0;
  if ( $('input[name="product-option-2"]').length ) {
      if ( $('input[name="product-option-2"]:checked').length ) {
          id_product_option_choice_2 = $('input[name="product-option-2"]:checked').val();
      }
  }
  id_product_option_choice_3 = 0;
  if ( $('input[name="product-option-3"]').length ) {
      if ( $('input[name="product-option-3"]:checked').length ) {
          id_product_option_choice_3 = $('input[name="product-option-3"]:checked').val();
      }
  }
  additional_details = '';
  if ( $('#additional_details').length ) {
      additional_details = $('#additional_details').val().substring(0, 1000)
  }

  // execute ajax request
  $.ajax({
      type: "POST",
      url: URLS.addItem,  //form.attr("data-process-url"),
      dataType: 'json',
      crossDomain: true,
      data: {
          "id_organization": organizationId,
          "id_product": id_product,
          "id_product_variant": button.attr("data-product-variant"),
          "id_product_option_choice_1": id_product_option_choice_1,
          "id_product_option_choice_2": id_product_option_choice_2,
          "id_product_option_choice_3": id_product_option_choice_3,
          "quantity": quantity,
          "additional_details": additional_details
      },
      success : function(response_data) {
          console.log("success");
          console.log(response_data);
          if (response_data.success == true) {
            if (response_data.totalItems > 1) {
              // update the cart message
              cartMessage(id_product, "<div class='mt-3 text-success'>Item successfully added. <a href='" + URLS.checkout + "'>Go to cart <i class='fa fa-shopping-cart' aria-hidden='true'></a></div>")
              // update the cart logo icon
              $('#cart-badge').text(response_data.totalItems);
            } else {
              window.location.href = URLS.checkout;
            };
          } else {
            cartMessage(id_product, "<div class='mt-3 text-danger'>" + response_data.msg + "</div>")
          }
      },
      error: function(xhr, errmsg, err) {
          console.log("error");
          console.log(xhr.status + ": " + xhr.responseText);
      },
      complete: function() {
          // set the flag to false to allow the next request
          is_pending_cart_operation = false;
      }
  });
};

function removeFromCart(id_cart_item) {
  $.ajax({
      type: "POST",
      url: URLS.removeItem,
      dataType: 'json',
      crossDomain: true,
      data: {
          "id_organization": organizationId,
          "id_cart_item": id_cart_item
      },
      success : function(response_data) {
          console.log("success");
          console.log(response_data);
          updateCartDisplay(response_data);
      },
      error: function(xhr, errmsg, err) {
          console.log("error");
          console.log(xhr.status + ": " + xhr.responseText);
      }
  });
};

function decreaseQuantity(id_cart_item) {
  $.ajax({
      type: "POST",
      url: URLS.decreaseQuantity,
      dataType: 'json',
      crossDomain: true,
      data: {
          "id_organization": organizationId,
          "id_cart_item": id_cart_item
      },
      success : function(response_data) {
          console.log("success");
          console.log(response_data);
          updateCartDisplay(response_data);
      },
      error: function(xhr, errmsg, err) {
          console.log("error");
          console.log(xhr.status + ": " + xhr.responseText);
      }
  });
};

function increaseQuantity(id_cart_item) {
  $.ajax({
      type: "POST",
      url: URLS.increaseQuantity,
      dataType: 'json',
      crossDomain: true,
      data: {
          "id_organization": organizationId,
          "id_cart_item": id_cart_item
      },
      success : function(response_data) {
          console.log("success");
          console.log(response_data);
          updateCartDisplay(response_data);
      },
      error: function(xhr, errmsg, err) {
          console.log("error");
          console.log(xhr.status + ": " + xhr.responseText);
      }
  });
};

function changeShippingMethod(id_shipping_method) {
  $.ajax({
      type: "POST",
      url: URLS.changeShippingMethod,
      dataType: 'json',
      crossDomain: true,
      data: {
          "id_organization": organizationId,
          "id_shipping_method": id_shipping_method
      },
      success : function(response_data) {
          console.log("success");
          console.log(response_data);
          updateCartDisplay(response_data);
      },
      error: function(xhr, errmsg, err) {
          console.log("error");
          console.log(xhr.status + ": " + xhr.responseText);
      }
  });
};

function addDiscountCode(discount_code) {
  $.ajax({
      type: "POST",
      url: URLS.addDiscountCode,
      dataType: 'json',
      crossDomain: true,
      data: {
          "id_organization": organizationId,
          "discount_code": discount_code.trim()
      },
      success : function(response_data) {
          console.log("success");
          console.log(response_data);
          if (response_data.is_successful) {
            updateCartDisplay(response_data);
            $('#js-discount-message').hide();
          } else {
            $('#js-discount-message').text(response_data['message']);
            $('#js-discount-message').show();
          }
      },
      error: function(xhr, errmsg, err) {
          console.log("error");
          console.log(xhr.status + ": " + xhr.responseText);
      }
  });
};

function removeDiscountCode() {
  $.ajax({
      type: "POST",
      url: URLS.removeDiscountCode,
      dataType: 'json',
      crossDomain: true,
      data: {
          "id_organization": organizationId
      },
      success : function(response_data) {
          console.log("success");
          console.log(response_data);
          updateCartDisplay(response_data);
      },
      error: function(xhr, errmsg, err) {
          console.log("error");
          console.log(xhr.status + ": " + xhr.responseText);
      }
  });
};

function updateCartDisplay(cart) {
    // for each cart_item:
    $.each(cart.items, function(key, value) {
        if (value['quantity'] > 0) {
            // show the line
            cartItemRowId = "#cart-item-row-" + key;
            $(cartItemRowId).show();

            // update the quantity in the quantity tag
            cartItemQuantityId = "#cart-item-quantity-" + key;
            $(cartItemQuantityId).html(value['quantity']);

            // deactivate the add button if the max quantity is reached
            cartItemIncreaseQuantityId = "#cart-item-increase-quantity-" + key;
            if (value['maxQuantity'] !== null) {
                if (value['quantity'] >= value['maxQuantity']) {
                    $(cartItemIncreaseQuantityId).html('<i class="fa fa-ban" aria-hidden="true"></i>');
                    $(cartItemIncreaseQuantityId).attr("disabled", true);
                } else {
                    $(cartItemIncreaseQuantityId).html('+');
                    $(cartItemIncreaseQuantityId).attr("disabled", false);
                }
            }

            // update the line total
            cartItemLineTotalId = "#cart-item-line-total-" + key;
            $(cartItemLineTotalId).text(value['lineTotal']);
        } else {
            // if the item quantity is 0, remove the line
            cartItemRowId = "#cart-item-row-" + key;
            $(cartItemRowId).hide();
        };
    });

    // update the discount section
    if (cart.discountCode != "") {
        $('#discount-form').hide();
        $('#discount-data').show();

        $('#js-discount-code').text(cart.discountCode);
        $('#js-discount-details').text(cart.discountDetails);
        $('#js-discount-amount').text(cart.discountAmount);

    } else {
        $('#discount-form').show();
        $('#discount-data').hide();
    }

    // update the cart total
    $('#cart-subtotal').text(cart.subTotal);
    $('#cart-subtotal-after-discount').text(cart.subTotalAfterDiscountBeforeShipping);
    $('#cart-total-price').text(cart.totalPrice);

    // update the shipping options
    cartSubTotalAfterDiscountBeforeShipping = cart.subTotalAfterDiscountBeforeShipping;
    cartTotalWeight = cart.totalWeight
    updateShippingOptionDisplay();
    $('#shipping_method_' + cart.shippingMethod).prop("checked", true);

    // update the cart logo icon
    updateCartBadgeDisplay(cart.totalItems);
};

function updateCartBadge() {
    $.ajax({
        type: "GET",
        url: URLS.getCartNbOfItems,
        data: {
            "id_organization": organizationId
        },
        timeout: 2000,
        success: function(response) {
            updateCartBadgeDisplay(response.cart_nb_of_items);
        },
        error: function() {
            console.log("error");
            console.log(xhr.status + ": " + xhr.responseText);
        }
    });
};

// function to update the cart badge in the navbar
function updateCartBadgeDisplay(cart_nb_of_items) {
    // reset the badge
    $('#cart-badge').text('');
    $('#cart-badge').hide();
    // update the badge if the cart is not empty
    if (cart_nb_of_items > 0) {
        // update the badge value
        $('#cart-badge').text(cart_nb_of_items);
        // update the badge position depending on the size of the number
        if (cart_nb_of_items >= 100) {
            $('#cart-badge').css('right', '-9px');
        } else if (cart_nb_of_items >= 10) {
            $('#cart-badge').css('right', '-5px');
        } else {
            $('#cart-badge').css('right', '0px');
        }
        // show the badge
        $('#cart-badge').show();
    }
};

// function to update the success / error message after a visitor clicked on 'add to cart'
function cartMessage(id_product, message) {
    // hide all the cart messages
    $(".js-cart-message").hide()
    // update the relevant message
    cartMessageProductId = "#cart-message-product-" + id_product
    $(cartMessageProductId).html(message)
    // and show it
    $(cartMessageProductId).show()
};
