# Register Here!

<style>
    input {
        border: 1px solid black;
        padding: 5px;
        margin: 3px;
    }
</style>
<p class="required-fields">
<abbr title="Required" class="required"><span >*</span></abbr> Required fields</p>
<form id="register_form">
    <div class="form-group">
        <label class="col-sm-4 control-label" for="user_first_name">
            <abbr title="Required" class="required">
                <span class="abbr-required">*</span>
            </abbr> 
            First Name
        </label>
        <div class="col-sm-5">
            <input class="form-control" id="user_first_name" name="user[first_name]" size="50" type="text" required="">
        </div>
    </div>
    <div class="form-group">
        <label class="col-sm-4 control-label" for="user_last_name">
            <abbr title="Required" class="required">
                <span class="abbr-required">*</span>
            </abbr> 
            Last Name
        </label>
        <div class="col-sm-5">
            <input class="form-control" id="user_last_name" name="user[last_name]" size="50" type="text" required>
        </div>
    </div>
    <div class="form-group">
        <label class="col-sm-4 control-label" for="user_email">
            <abbr title="Required" class="required">
                <span class="abbr-required">*</span>
            </abbr>
             Email
        </label>
        <div class="col-sm-5">
            <input class="form-control" id="user_email" name="user[email]" size="50" type="email" required>
        </div>
    </div>
    <div class="form-group">
        <label class="col-sm-4 control-label" for="user_app_name">
            <abbr title="Required" class="required">
                <span class="abbr-required">*</span>
            </abbr>
            App Name
        </label>
        <div class="col-sm-5">
            <input class="form-control" id="user_app_name" name="user[app_name]" size="50" type="text" required>
        </div>
    </div>
    <div class="form-group">
        <label class="col-sm-4 control-label" for="user_app_description">How will you use the API?<br></label>
        <div class="col-sm-5">
            <textarea class="form-control" cols="40" id="user_app_description" name="user[app_description]" rows="5">
            </textarea>
        </div>
    </div>
    <div class="form-group">
        <label class="col-sm-4 control-label" for="user_web_url">
             Website URL
        </label>
        <div class="col-sm-5">
            <input class="form-control" id="user_web_url" name="user[web_url]" size="75" type="text">
        </div>
    </div>
    <input type="hidden" name="user[terms_and_conditions]" value="1">
    <div class="form-group">
        <div class="col-sm-offset-4 col-sm-8">
            <input type="hidden" name="user[registration_source]" value="web">
            <button type="submit" class="btn btn-lg btn-primary" data-loading-text="Loading...">Signup</button>
        </div>
    </div>
</form>
