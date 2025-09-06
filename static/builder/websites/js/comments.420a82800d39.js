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


// toggle the comment form
function toggleCommentForm() {
    var x = document.getElementById("comment-form");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
    $("#comment-form-submit-msg").hide()
};


$(document).ready(function() {
    // manage the form submission
    $('#comment-form').on('submit',function(e) {
        e.preventDefault();  // To avoid page refresh and fire the event "Click"
        if ($(this).parsley().isValid()) {
            commentFormSubmit();
        }
    });
});


// process the form with ajax
function commentFormSubmit() {
    // Waiting message while we process, to avoid multiple submissions
    $("#comment-form-submit-msg").removeClass().addClass("text-success mb-2").text("Submitting comment...").show();
    $("#comment-form-submit-btn").prop('disabled', true); 

    // Initiate Variables With Form Content
    var content = $("#comment-content").val();
    var name = $("#comment-name").val();
    var email = $("#comment-email").val();
    var object_id = $("#comment-object-id").val();
    var object_type = $("#comment-object-type").val();
    var website = $("#comment-website").val();

    $.ajax({
        type: "POST",  // http method
        url: $("#comment-form").attr("data-process-comment"),  // the endpoint
        dataType: 'json',
        data: {
            "content": content,
            "name": name,
            "email": email,
            "object_id": object_id,
            "object_type": object_type,
            "website": website,
        },  // the data sent with the post request
        // handle a successful response
        success : function(response_data){
            console.log("success"); // sanity check
            console.log(response_data); // log the returned json to the console
            if (response_data.result == "success"){
                commentFormSuccess();
                commentFormMessage(true, response_data.message)
            } else {
                commentFormError();
                commentFormMessage(false, response_data.message);
            }
        },
        // handle a non-successful response
        error: function(xhr, errmsg, err) {
            console.log("error"); // sanity check
            console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
            commentFormError();
            commentFormMessage(false, "There was an error when submitting your comment :-( Could you please try again?");
        }
    });
}

function commentFormSuccess() {
    $("#comment-form")[0].reset();
    $("#comment-form-submit-btn").prop('disabled', false);
    $("#comment-form").hide();
    $("#btn-toggle-comment-form").hide();
}

function commentFormError() {
    $("#comment-form-submit-btn").prop('disabled', false);
}

function commentFormMessage(is_successful, msg) {
    if(is_successful){
        var msgClasses = "text-success text-center my-4";
    } else {
        var msgClasses = "text-danger my-4";
    }
    $("#comment-form-submit-msg").removeClass().addClass(msgClasses).text(msg);
}
