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
    $("#contact-form").on("submit", function (event) {
        event.preventDefault();
        if ($(this).parsley().isValid()) {
            submitContactForm();
        }
    });
});


function submitContactForm(){
    // Waiting message while we process, to avoid multiple submissions
    $("#contact-form-submit-msg").removeClass().addClass("text-success").text("Sending message...");
    $("#contact-form-submit-btn").prop('disabled', true); 

    // Initiate Variables With Form Content
    var form = $("#contact-form");
    var name = $("#contact-form-name").val();
    var email = $("#contact-form-email").val();
    var phone = $("#contact-form-phone-number").val();
    var message = $("#contact-form-message").val();
    var website = $("#website").val();
    var num1 = $("#num1").val();
    var num2 = $("#num2").val();
    var captcha = $("#captcha").val();
    var url = $("#url").val();
    var csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    $.ajax({
        type: "POST",  // http method
        url: form.attr("data-process-contact-form-message"),  // the endpoint
        dataType: 'json',
        data: {
            "name": name,
            "email": email,
            "phone": phone,
            "message": message,
            "website": website,
            "num1": num1,
            "num2": num2,
            "captcha": captcha,
            "url": url,
            "csrfmiddlewaretoken": csrftoken
        },  // the data sent with the post request
        // handle a successful response
        success : function(response_data){
            console.log("success"); // sanity check
            console.log(response_data); // log the returned json to the console
            if (response_data.text == "success"){
                contactFormSuccess();
                contactFormMessage(true, "Message successfully sent!")
            } else {
                contactFormError();
                contactFormMessage(false, response_data.text);
            }
        },
        // handle a non-successful response
        error: function(xhr, errmsg, err) {
            console.log("error"); // sanity check
            console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
            contactFormError();
            contactFormMessage(false, "There was an error when submitting the message :-( Could you please try again?");
        }
    });
}

function contactFormSuccess(){
    $("#contact-form")[0].reset();
    $("#contact-form-submit-btn").prop('disabled', false);
}

function contactFormError(){
    $("#contact-form-submit-btn").prop('disabled', false);
}

function contactFormMessage(is_successful, msg){
    if(is_successful){
        var msgClasses = "text-success mt-2";
    } else {
        var msgClasses = "text-danger mt-2";
    }
    $("#contact-form-submit-msg").removeClass().addClass(msgClasses).text(msg);
}
