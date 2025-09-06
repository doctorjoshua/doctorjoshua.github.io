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


// toggle the review form
function toggleReviewForm() {
    var x = document.getElementById("review-form");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
    $("#review-form-submit-msg").hide()
};


$(document).ready(function() {

    // manage the form submission
    $('#review-form').on('submit',function(e) {
        e.preventDefault();  // To avoid page refresh and fire the event "Click"
        if ($(this).parsley().isValid()) {
            reviewFormSubmit();
        }
    });

    // manage the stars display in the form
    updateStarsDisplay();
    $('input[type=radio][name=review-rating]').change(function() {
        updateStarsDisplay();
    });
});


// update the star display in the form
function updateStarsDisplay() {
    var value_checked = $('input[type=radio][name=review-rating]:checked').val();
    var star_full = '<i class="fa fa-star yellow"></i>'
    var star_empty = '<i class="fa fa-star-o yellow"></i>'
    
    if (value_checked == '1') {
        $('#1star-label').html(star_full);
        $('#2star-label').html(star_empty);
        $('#3star-label').html(star_empty);
        $('#4star-label').html(star_empty);
        $('#5star-label').html(star_empty);
    } else if (value_checked == '2') {
        $('#1star-label').html(star_full);
        $('#2star-label').html(star_full);
        $('#3star-label').html(star_empty);
        $('#4star-label').html(star_empty);
        $('#5star-label').html(star_empty);
    } else if (value_checked == '3') {
        $('#1star-label').html(star_full);
        $('#2star-label').html(star_full);
        $('#3star-label').html(star_full);
        $('#4star-label').html(star_empty);
        $('#5star-label').html(star_empty);
    } else if (value_checked == '4') {
        $('#1star-label').html(star_full);
        $('#2star-label').html(star_full);
        $('#3star-label').html(star_full);
        $('#4star-label').html(star_full);
        $('#5star-label').html(star_empty);
    } else if (value_checked == '5') {
        $('#1star-label').html(star_full);
        $('#2star-label').html(star_full);
        $('#3star-label').html(star_full);
        $('#4star-label').html(star_full);
        $('#5star-label').html(star_full);
    }
}


// process the form with ajax
function reviewFormSubmit() {
    // Waiting message while we process, to avoid multiple submissions
    $("#review-form-submit-msg").removeClass().addClass("text-success mb-2").text("Submitting review...").show();
    $("#review-form-submit-btn").prop('disabled', true); 

    // Initiate Variables With Form Content
    var rating = $("input[name='review-rating']:checked").val();
    var title = $("#review-title").val();
    var content = $("#review-content").val();
    var name = $("#review-name").val();
    var email = $("#review-email").val();
    var object_id = $("#review-object-id").val();
    var object_type = $("#review-object-type").val();
    var website = $("#review-website").val();

    $.ajax({
        type: "POST",  // http method
        url: $("#review-form").attr("data-process-review"),  // the endpoint
        dataType: 'json',
        data: {
            "rating": rating,
            "title": title,
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
                reviewFormSuccess();
                reviewFormMessage(true, response_data.message)
            } else {
                reviewFormError();
                reviewFormMessage(false, response_data.message);
            }
        },
        // handle a non-successful response
        error: function(xhr, errmsg, err) {
            console.log("error"); // sanity check
            console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
            reviewFormError();
            reviewFormMessage(false, "There was an error when submitting your review :-( Could you please try again?");
        }
    });
}

function reviewFormSuccess() {
    $("#review-form")[0].reset();
    $("#review-form-submit-btn").prop('disabled', false);
    $("#review-form").hide();
    $("#btn-toggle-review-form").hide();
}

function reviewFormError() {
    $("#review-form-submit-btn").prop('disabled', false);
}

function reviewFormMessage(is_successful, msg) {
    if(is_successful){
        var msgClasses = "text-success text-center my-4";
    } else {
        var msgClasses = "text-danger my-4";
    }
    $("#review-form-submit-msg").removeClass().addClass(msgClasses).text(msg);
}
