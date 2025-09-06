// manage the csrf validation, from the django documentation
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken');
function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});


$(document).ready(function() {
    // manage the form submission
    $("#newsletter-form").on("submit", function (event) {
        event.preventDefault();
        if ($(this).parsley().isValid()) {
            newsletterSubmitForm();
        }
    });
});


function newsletterSubmitForm(){
    // Waiting message while we process
    $("#newsletter-msg-submit").removeClass().addClass("text-center text-success").text("Subscribing...");
    $("#newsletter-msg-submit").prop('disabled', true);

    // Initiate Variables With Form Content
    var form = $("#newsletter-form");
    var email = $("#newsletter-email").val();
    var website = $("#newsletter-website").val();
    var name = ""
    if ($("#newsletter-name").length > 0) {
        var name = $("#newsletter-name").val();
    }

    $.ajax({
        type: "POST",  // http method
        url: form.attr("data-process-newsletter-signup"),  // the endpoint
        dataType: 'json',
        data: {
            "email": email,
            "website": website,
            "name": name,
        },  // the data sent with the post request
        // handle a successful response
        success : function(response_data){
            console.log("success"); // sanity check
            console.log(response_data); // log the returned json to the console
            if (response_data.text == "success"){
                newsletterFormSuccess();
                newsletterSubmitMSG(true, "You have been successfully subscribed!")
            } else {
                newsletterFormError();
                newsletterSubmitMSG(false, response_data.text);
            }
        },
        // handle a non-successful response
        error: function(xhr, errmsg, err) {
            console.log("error"); // sanity check
            console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
            newsletterFormError();
            newsletterSubmitMSG(false, "Oh snap! There was an error when subscribing your email address. Could you please try again?");
        }
    });
}

function newsletterFormSuccess() {
    $("#newsletter-form")[0].reset();
    $("#newsletter-submit").prop('disabled', false);
}

function newsletterFormError() {
    $("#newsletter-msg-submit").prop('disabled', false);
}

function newsletterSubmitMSG(valid, msg) {
    if(valid){
        var msgClasses = "text-center text-success mt-2";
    } else {
        var msgClasses = "text-center text-danger mt-2";
    }
    $("#newsletter-msg-submit").removeClass().addClass(msgClasses).text(msg);
}