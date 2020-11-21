<div class="row">
	<div class="col-sm-2 col-xs-12 settings-header">Onedrive Settings</div>
	<div class="col-sm-10 col-xs-12">	
		<form role="form" class="onedrive-settings">
			<div class="checkbox">
				<label class="mdl-switch mdl-js-switch mdl-js-ripple-effect">
					<input class="mdl-switch__input" type="checkbox"  name="applyPostImage">
					<span class="mdl-switch__label"><strong>Apply for post images</strong></span>
				</label>
			</div>
			<div class="checkbox">
				<label class="mdl-switch mdl-js-switch mdl-js-ripple-effect">
					<input class="mdl-switch__input" type="checkbox"  name="applyPostFile">
					<span class="mdl-switch__label"><strong>Apply for post files</strong></span>
				</label>
			</div>
			<div class="checkbox">
				<label class="mdl-switch mdl-js-switch mdl-js-ripple-effect">
					<input class="mdl-switch__input" type="checkbox"  name="applyCoverImage">
					<span class="mdl-switch__label"><strong>Apply for cover image</strong></span>
				</label>
			</div>
			<div class="checkbox">
				<label class="mdl-switch mdl-js-switch mdl-js-ripple-effect">
					<input class="mdl-switch__input" type="checkbox"  name="applyAvatarImage">
					<span class="mdl-switch__label"><strong>Apply for avatar image</strong></span>
				</label>
			</div>
			<div>
			    client_id
				<input type="text"  name="clientId" placeholder="" style="width:100%"/>
			</div>
			<div>
			    client_secret
				<input type="text"  name="clientSecret" placeholder="" style="width:100%"/>
			</div>
			<div>
			    refresh_token
				<input type="text"  name="refreshToken" placeholder="" style="width:100%"/>
			</div>
			<div>
			    base_dir
				<input type="text"  name="baseDir" placeholder="" style="width:100%"/>
			</div>
			     redirect_url
				<input type="text"  name="redirectUrl" placeholder="" style="width:100%"/>
			</div>
		</form>
	</div>
</div>
	
<button id="save" class="floating-button mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">
    <i class="material-icons">save</i>
</button>