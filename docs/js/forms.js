$(document).ready(function() {
    // process the form
    $('#register_form').validate({
        submitHandler: function(form, event) {

            event.preventDefault();
            // get the form data
            // there are many ways to get this data using jQuery (you can use the class or id also)
            var formData = {
                'first_name' : $('input[id=user_first_name]').val(),
                'last_name' : $('input[id=user_last_name]').val(),
                'email' : $('input[id=user_email]').val(),
                'app_name' : $('input[id=user_app_name]').val(),
                'app_description' : $('#user_app_description').val() ? $('#user_app_description').val() : "",
                'website_url' : $('input[id=user_web_url]').val(),
            };
            // process the form
            $.ajax({
                type        : 'POST', // define the type of HTTP verb we want to use 
                url         : '/generateKey', // the url to submit form to 
                data        : JSON.stringify(formData), // our data object
                contentType : "application/json; charset=utf-8",
                dataType    : 'json', // what type of data do we expect back from the server
                encode      : true
            })
                // using the done promise callback
                .done(function(data) {

                    // log data to the console so we can see
                    $('input[id=user_first_name]').val(''),
                    $('input[id=user_last_name]').val(''),
                    $('input[id=user_email]').val(''),
                    $('input[id=user_app_name]').val(''),
                    $('textarea[id=user_app_description]').val(''),
                    $('input[id=user_web_url]').val(''),
                    alert("An email containing the next steps has been sent to the address. Please check your inbox to proceed.")
                    
                    // here we will handle errors and validation messages
                });

            // stop the form from submitting the normal way and refreshing the page
        }
    });
    // $('form').submit(function(event) {
    //     console.log($('input[id=user_first_name]').val())
    //     // get the form data
    //     // there are many ways to get this data using jQuery (you can use the class or id also)
    //     var formData = {
    //         'firstName' : $('input[id=user_first_name]').val(),
    //         'lastName' : $('input[id=user_last_name]').val(),
    //         'email' : $('input[id=user_email]').val(),
    //         'appName' : $('input[id=user_app_name]').val(),
    //         'appDescription' : $('input[id=user_app_description]').val(),
    //         'websiteURL' : $('input[id=user_web_url]').val(),
    //     };

    //     // process the form
    //     $.ajax({
    //         type        : 'GET', // define the type of HTTP verb we want to use 
    //         url         : 'http://localhost:8080/generateKey', // the url to submit form to 
    //         data        : formData, // our data object
    //         dataType    : 'text', // what type of data do we expect back from the server
    //         encode      : true
    //     })
    //         // using the done promise callback
    //         .done(function(data) {

    //             // log data to the console so we can see
    //             console.log(data);
    //             $('input[id=user_first_name]').val(''),
    //             $('input[id=user_last_name]').val(''),
    //             $('input[id=user_email]').val(''),
    //             $('input[id=user_app_name]').val(''),
    //             $('input[id=user_app_description]').val(''),
    //             $('input[id=user_web_url]').val(''),
    //             alert("An email containing the next steps has been sent to the address. Please check your inbox to proceed.")
                
    //             // here we will handle errors and validation messages
    //         });

    //     // stop the form from submitting the normal way and refreshing the page
    //     event.preventDefault();
    // });

});