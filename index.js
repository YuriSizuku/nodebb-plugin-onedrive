'use strict';
const fs = require('fs');
const winston = require('winston');
const path = require('path');
const mkdirp = require('mkdirp');
const meta = require.main.require('./src/meta');
const od = require('./od.js');

const onedrive = module.exports;

async function renderAdmin(req, res, next) {
	res.render('admin/plugins/onedrive', {});
}

onedrive.init = async function (params) {
	var app = params.router;
	var middleware = params.middleware;
	app.get('/admin/plugins/onedrive', middleware.admin.buildHeader, renderAdmin);
	app.get('/api/admin/plugins/onedrive', renderAdmin);
};

onedrive.admin = {};

onedrive.admin.menu = async function (menu) {
	menu.plugins.push({
		route: '/plugins/onedrive',
		icon: 'fa-cloud-upload',
		name: 'onedrive',
	});
	return menu;
};

async function getSettings() {
	return (await meta.settings.get('onedrive') || 
	        {
				applyPostImage: meta.settings.applyPostImage == 'on', 
				applyCoverImage: meta.settings.applyCoverImage == 'off', 
				applyAvatorImage: meta.settings.applyAvatorImage == 'off', 
				applyPostFile: meta.settings.applyPostFile == 'off',
				clientId: "",
				clientSecret: "",
				basedDir: "/public",
				redirectUrl: "",
			});
}

const saveFileToLocal = async function (filename, folder, tempPath) {
    const basePath = path.join(path.resolve('.'), "./public/uploads");
	const uploadPath = path.join(basePath, folder, filename);
	console.log('basePath: ' + basePath + ' uploadPath: ' + uploadPath);
	if (!uploadPath.startsWith(basePath)) {
		throw new Error('[[error:invalid-path]]');
	}

	winston.verbose('Saving file ' + filename + ' to : ' + uploadPath);
	await mkdirp(path.dirname(uploadPath));
	await fs.promises.copyFile(tempPath, uploadPath);
	return {
		url: '/assets/uploads/' + (folder ? folder + '/' : '') + filename,
		path: uploadPath,
	};
};

onedrive.uploadImage = async function (data) {
	if (!data.image) {
		throw new Error('invalid image');
	}
	var useHook = false;
	const settings = await getSettings();
	//console.log(settings);
	//console.log(data);

	// checking img type
	if (data.uid && data.folder === 'profile') {
		if (data.image.name === 'profileAvatar') {
			useHook = settings.applyAvatorImage == 'on' ?  true : false; 
		} else if (data.image.name === 'profileCover') {
			useHook = settings.applyCoverImage == 'on' ? true : false;
		}
	}
	else{
	    useHook = settings.applyPostImage == 'on' ? true:false;
	} 

	// define path
	var filename = data.image.name;
	var tempPath = data.image.path;
	var folder = data.folder;
	if (data.uid && data.folder === 'profile'){
		filename = path.parse(filename).name + "_" + data.uid.toString() 
				  + path.extname(tempPath);
	}
	else{ // non profile
		filename = path.parse(filename).name + "_"
		   + new Date().getTime().toString() + path.extname(tempPath);
		folder = path.posix.join(data.folder, data.uid.toString());
	}
	
	if (useHook) { // upload to onedrive
		var res = await od.auth(settings.clientId, settings.clientSecret, settings.refreshToken);
		if(res==undefined || res==null || res.data==undefined || res.data.access_token==undefined){
			throw new Error("onedrive auth invalid!");
		}
		var access_token = res.data.access_token;
		var dstpath = path.posix.join(settings.baseDir, "uploads", folder, filename);
	
		res = await od.upload(tempPath, dstpath, access_token)
		if (res) {
			console.log(path.posix.join(settings.redirectUrl, folder, filename));
			return {
				name: filename,
				url: settings.redirectUrl == "" ? 
					res['@content.downloadUrl'] : 
					new URL(path.posix.join("uploads", folder, filename), settings.redirectUrl).href
			};
		}
		throw new Error(res.data.error.message || res.data.error);
	}
	else{ // upload to local
		const upload = await saveFileToLocal(filename, folder, tempPath);
		return {
			url: upload.url,
			path: upload.path,
			name: filename,
		};
	}
};

onedrive.uploadFile = async function(data){
	const settings = await getSettings();
	var useHook = settings.applyPostFile == 'on' ? true:false;
	var filename = data.file.name;
	var tempPath = data.file.path;
	var folder = data.folder;
	
	filename = path.parse(filename).name + "_"
		+ new Date().getTime().toString() + path.extname(tempPath);
	folder = path.posix.join(data.folder, data.uid.toString());
	console.log(filename, tempPath, folder)
	if (useHook) { // upload to onedrive
		var res = await od.auth(settings.clientId, settings.clientSecret, settings.refreshToken);
		if(res==undefined || res==null || res.data==undefined || res.data.access_token==undefined){
			throw new Error("onedrive auth invalid!");
		}
		var access_token = res.data.access_token;
		var dstpath = path.posix.join(settings.baseDir, "uploads", folder, filename);
	
		res = await od.upload(tempPath, dstpath, access_token)
		if (res) {
			console.log(path.posix.join(settings.redirectUrl, folder, filename));
			return {
				name: filename,
				url: settings.redirectUrl == "" ? 
					res['@content.downloadUrl'] : 
					new URL(path.posix.join("uploads", folder, filename), settings.redirectUrl).href
			};
		}
		throw new Error(res.data.error.message || res.data.error);
	}
	else{ // upload to local
		const upload = await saveFileToLocal(filename, folder, tempPath);
		return {
			url: upload.url,
			path: upload.path,
			name: filename,
		};
	}
}