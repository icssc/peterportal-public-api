# Register Here
Please enter your information below to receive an API key and get started. You will need an 
API key to access PeterPortal web services. 

<style>
    input {
        border: 1px solid black;
        padding: 5px;
        margin: 3px;
    }

    .required, .required-fields{
        color: red;
        font-size: 12px;
    }
    
    .error {
        font-size: 11px;
        color: red;
    }

    .btn {
        border: 1px solid black;
        padding: 5px;
        border-radius: 5px;
    }
</style>
<div class="form">
    <p class="required-fields">
    <abbr title="Required" class="required"><span >*</span></abbr> Required fields</p>
    <form id="register_form">
        <div class="form-group">
            <label class="col-sm-4 control-label" for="user_first_name">
                First Name
                <abbr title="Required" class="required">
                    <span class="abbr-required">*</span>
                </abbr> 
            </label>
            <div class="col-sm-5">
                <input class="form-control" id="user_first_name" name="user[first_name]" size="50" type="text" placeholder="Peter" required>
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-4 control-label" for="user_last_name">
                Last Name
                <abbr title="Required" class="required">
                    <span class="abbr-required">*</span>
                </abbr> 
            </label>
            <div class="col-sm-5">
                <input class="form-control" id="user_last_name" name="user[last_name]" size="50" type="text" placeholder="Anteater" required>
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-4 control-label" for="user_email">
                Email
                <abbr title="Required" class="required">
                    <span class="abbr-required">*</span>
                </abbr>
            </label>
            <div class="col-sm-5">
                <input class="form-control" id="user_email" name="user[email]" size="50" type="email" placeholder="panteater@example.com" required>
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-4 control-label" for="user_app_name">
                App Name
                <abbr title="Required" class="required">
                    <span class="abbr-required">*</span>
                </abbr>
            </label>
            <div class="col-sm-5">
                <input class="form-control" id="user_app_name" name="user[app_name]" size="50" type="text" placeholder="PeterPortal" required>
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-4 control-label" for="user_app_description">How will you use the API?<br></label>
            <div class="col-sm-5">
                <textarea class="form-control" cols="40" id="user_app_description" name="user[app_description]" placeholder="With care..." rows="5"></textarea>
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-4 control-label" for="user_web_url">
                Website URL
            </label>
            <div class="col-sm-5">
                <input class="form-control" id="user_web_url" name="user[web_url]" size="75" type="url" placeholder="https://example.com">
            </div>
        </div>
        <br>
        <div class="form-group">
            <div class="col-sm-offset-4 col-sm-8">
                <input type="hidden" name="user[registration_source]" value="web">
                <button type="submit" class="btn" data-loading-text="Loading...">Signup</button>
            </div>
        </div>
    </form>
</div>