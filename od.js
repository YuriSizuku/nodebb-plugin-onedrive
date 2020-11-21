/**
 * This is a slightly warpper for onedrive-api, including auth adn upload, delete
 */

const fs = require('fs');
const path = require('path');
const util = require('util');
const { URLSearchParams } = require('url');
const axios = require('axios');
const odapi = require('onedrive-api');

async function auth(client_id, client_secret, refresh_token){
    var res=null;
    try {
        res =  await axios.post("https://login.microsoftonline.com/common/oauth2/v2.0/token" , new URLSearchParams({
            client_id: client_id, 
            client_secret: client_secret,
            refresh_token: refresh_token,
            grant_type: "refresh_token"
        }).toString(),  {
            headers : {
               "Content-Type": "application/x-www-form-urlencoded"
            }, 
        })
    } catch(e){
        console.log("odauth error!", e)
    }
    return res; // res.data.access_token
}

async function upload(srcpath, dstpath, access_token){
    const filename = path.basename(dstpath);
    const parentPath = path.dirname(dstpath)
    const fileSize = fs.statSync(srcpath).size;
    var res=null;
    try{
        res = await odapi.items.uploadSession({
            accessToken: access_token,
            filename: filename, 
            fileSize: fileSize,
            parentPath: parentPath,
            readableStream: fs.createReadStream(srcpath)
        }, (byteUploaded) => {
            console.log(util.format("%s, %d/%d uploaded", dstpath, byteUploaded, fileSize))
        })
    }
    catch(e){
        console.log("upload error!", e)
    }
    return res;
}

async function getid(odpath, access_token) {
    const subpaths = odpath.split("/");
    var dirid = "root";
    for(var i=0;i<subpaths.length;i++){
        if(subpaths[i]=="") continue;
        try{
            var res = await odapi.items.listChildren({
                accessToken: access_token,
                itemId: dirid, // public
                drive: 'me', // 'me' | 'user' | 'drive' | 'group' | 'site'
                driveId: '' // BLANK | {user_id} | {drive_id} | {group_id} | {sharepoint_site_id}
            });
            //console.log(res, subpaths[i], dirid)
            list = res.value;
            if(list==undefined || list==null){
                console.log("list obtain error!")
                return -1;
            }
            for(var j=0;j<list.length;j++){
                if(list[j].name != subpaths[i]) continue;
                dirid = list[j].id;
                break;
            }
            if(j >= list.length){
                console.log("error, can not find " + odpath +" !");
                return -1;
            }
        }
        catch (e) {
            console.log("getid error!", e);
            return -1;
        }
    }
    return dirid;
}

async function remove(odpath, access_token){
    var id = await getid(odpath, access_token);
    if(id==-1){
        console.log("error! remove " + odpath)
        return false;
    }
    console.log(odpath, id, "to be removed...");
    try{
        res = await odapi.items.delete({
            accessToken: access_token,
            itemId: id
        });
        return true;
    }catch(e){
        console.log("error! during remove", e);
        return false;
    }
}

module.exports = {auth, upload, getid, remove}