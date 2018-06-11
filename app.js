var http = require('http');
var https = require('https');
const fs = require('fs');
var tls = require('tls');
// HTTPS port 443, http port 80. To be changed in production
var port = 1337;
// var porthttps = (process.env.PORT || process.env.VCAP_APP_PORT || 1337);
var ipService = require('ip');
const requestIp = require('request-ip');
var url = require('url');
var uniqid = require('uniqid');
var debug=false;
var cookieService= require("cookies");
// var skey = fs.readFileSync('lkey.pem');
// var scert = fs.readFileSync('lcert.pem');
const util = require('util');
let DocumentDBClient = require('documentdb').DocumentClient;
let docdbUtils = require('./models/cosmosdb-manager');

function ttModel() {
	this.host = process.env.HOST || "https://ttanalytics.documents.azure.com:443/";
	this.authKey = process.env.AUTH_KEY || "4AN57BRIrDURzWM6f4aEidAnykKtlir30XxQM9cXrdSV1pnxipNA9vq7MsiegroLPXpJSV6Q9xNB9KAB5kYZeQ==";
	this.databaseId = "ttanalytics";
	this.collectionId = "instance_production";
	this.client = new DocumentDBClient(this.host, {
	    masterKey: this.authKey
	});
}

ttModel.prototype = {
		init: function(callback) {
		    let self = this;

		    docdbUtils.getOrCreateDatabase(self.client, self.databaseId, function(err, db) {
		    if (err) {
		        callback(err);
		    } else {
		        self.database = db;
		        docdbUtils.getOrCreateCollection(self.client, self.database._self, self.collectionId, function(err, coll) {
		        if (err) {
		            callback(err);
		        } else {
		            self.collection = coll;
		        }
		        });
		    }
		    });
		},

		find: function(querySpec, callback) {
		    let self = this;

		    self.client.queryDocuments(self.collection._self, querySpec).toArray(function(err, results) {
		    if (err) {
		        callback(err);
		    } else {
		        callback(null, results);
		    }
		    });
		},

		saveToInstance: function(hit, callback) {
		    let self = this;

		    self.client.createDocument(self.collection._self, hit, function(err, doc) {
		    if (err) {
				if(debug){
				   console.log(err);	
			    }
		        callback(err);
		    } else {
		        callback(null, doc);
		    }
		    });
		},

};
let model=new ttModel();
model.init();
/*
var optionshttps = {
	    key: skey,
	    cert: scert,
	    rejectUnauthorized: false,
	    requestCert: true,
	    agent: false
};  */
/*
const options = {
	 timeout:1000
};*/

function isNumber(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

function pCall(ttid,url_parts,query,pathName,req,res){
	  
	  if(ttid){
		  	  var path=url_parts.pathname;
			  var a;
			  var a1;
			  var a2;
			  var a3;
			  var amC=121;
			  var a1mC=121;
			  var a2mC=121;
			  var a3mC=121;
			  var tt_vid;
			  var tt_uvid;
			  var tt_time_c;
			  var pageName;
			  var pagePath="undefined";
			  var pageTitle;
			  var pageId;
			  var c_uvid=1;
			  var c_vid=1;
			  var header=JSON.stringify(req.headers);
			  if(debug){
				  console.log(header);
			  }
			  var referrer="not defined";
              if(typeof query.hn !== 'undefined'){
				var hst = query.hn;
				// var cleanHost=hst.substring(0, hst.indexOf(':'));
				var cleanHost=hst.replace(/\:/g,'.')
			  }
			  
			  if(debug){
				  console.log(hst);
			  }

			  if(typeof req.headers.referer !== 'undefined'){
				  referrer=req.headers.referer;
			  }
			  var aRef='no r parameter';
			  if(typeof query.r !== 'undefined'){
				  	aRef = query.r; 
		      }
			  
			  var cookies = new cookieService( req, res ), unsigned, signed, tampered;
			  
			  if(debug){
				  console.log('vid: '+cookies.get('tt_vid'));
			  }

			  if(typeof query.co === 'undefined'){
				  
				  if(cookies.get('tt_vid')){
					  tt_vid=cookies.get('tt_vid');
				  }else{
					  
					  var date = new Date();
				      date.setTime(date.getTime()+(1800*1000));
				      tt_vid=uniqid();
					  
					  if(cleanHost){
						  cookies.set('tt_vid', tt_vid, {expires: date, domain: cleanHost});
					  }else{
						  cookies.set('tt_vid', tt_vid, {expires: date});
					  }
				  }
				  
				  if(cookies.get('tt_uvid')){
					  tt_uvid=cookies.get('tt_uvid');
				  }else{
					  var date = new Date();
				      date.setTime(date.getTime()+(63072000*1000));
				      tt_uvid=uniqid();
				      if(cleanHost){
				    	  cookies.set('tt_uvid', tt_uvid, {expires: date, domain: cleanHost});
				      }else{
				    	  cookies.set('tt_uvid', tt_uvid, {expires: date});
				      }
				  }
				  
				  if(cookies.get('tt_time_c')!==null){
					  tt_time_c=cookies.get('tt_time_c');
				  } 
				  
				  			  
				  if(typeof query.i !=='undefined'){
					  c_uvid=query.i;
				  }
				  
				  if(typeof query.v !=='undefined'){
					  c_vid=query.v;
				  }

			  }

			  
			  var ip=requestIp.getClientIp(req); 

			  if(debug){
				  console.log('Ip before '+ip);
			  }
			  
			  var ip=requestIp.getClientIp(req); 

			  if(!ip || typeof ip==='undefined'){
				  ip=0;
			  }else if(ipService.isV4Format(ip) && ip){
				  ip=ipService.mask(ip,'255.255.255.0');
				  
			  }
			  if(req.headers.hasOwnProperty("x-real-ip")){
					  req.headers["x-real-ip"]=ipService.mask(req.headers["x-real-ip"],'255.255.255.0');
			  }
			  
			  if(debug && typeof ip !== 'undefined'){
				  console.log('Ip '+ip);
			  }
			  
			  if(query.p2){
				  pagePath=query.p2;
			  }
			  
			  if(query.p1){
				  pageName=query.p1;
			  }
			  
/*			  if(query.p2){
				  pageName=url_parts.p2;
			  }*/
			  
			  if(debug){
				  console.log(pageName);
				  console.log('U vid: '+tt_uvid);
			  }
			  
			  
				 
			if(ttid && pageName){
			  
		  	     var hitd = {
		  				    "account": {
		  				        "website_identity_token": ttid,
		  				        "account_id_ref": -1
		  				    },
		  				    "session_data": {
		  				        "visitor_id": tt_vid,
								"visitor_id_client": c_vid,
		  				        "location": "not defined",
		  				        "ip": ip
		  				    },
		  				    "visitor": {
		  				        "visitor_unique_id": tt_uvid,
								"visitor_unique_id_client": c_uvid,
		  				        "global_visitor_id": "not available"
		  				    },
		  				    "hit_data": {
		  				        "page_name": pageName,
		  				        "page_path_customized": pagePath,
		  				        "page_url_shorned": pagePath,
		  				        "client_host": cleanHost,
		  				        "unix_timestamp": Math.floor(new Date() / 1000),
		  				        "referrer": referrer,
								"referrer_actual": aRef,
		  				        "event_category": "",
		  				        "event_element_text": "",
		  				        "event_target_url": "",
		  				        "event_selector_data_raw": "",
		  				        "event_htlm_parent1_id":"",
		  				        "event_htlm_parent2_id":"",
		  				        "event_htlm_parent1_class":"",
		  				        "event_htlm_parent2_class":"",
		  				    },
							"header": req.headers,
		  		  }; 

				  if(query.a){
					  a=query.a;
					  hitd.hit_data.event_category=a;
					  if(debug){
						  console.log(a);
					  }
					  if(query.a1){
						  a1=query.a1;
						  hitd.hit_data.event_element_text=a1;
						  
						  if(debug){
							  console.log(a1);
						  }
							  if(query.a2){
								  a2=query.a2; 
								  hitd.hit_data.event_target_url=a2;
									  if(debug){
										  console.log(a2);
									  }
			 
									  if(query.a3){
										 a3=query.a3; 
										 hitd.hit_data.event_selector_data_raw=a3;
										 
										 if(debug){
											 console.log(a3);
										 }
									  }
							  }
					  }
					  
					  if(query.d1){
						  hitd.hit_data.event_htlm_parent1_id=query.d1;
					  }
					  
					  if(query.d2){
						  hitd.hit_data.event_htlm_parent2_id=query.d2;
					  }
					  
					  if(query.d3){
						  hitd.hit_data.event_htlm_parent1_class=query.d3;
					  }
					  
					  if(query.d4){
						  hitd.hit_data.event_htlm_parent2_class=query.d4;
					  }
					  
				  }

				  model.saveToInstance(hitd,function(){});		  

		}

	  }

}

function serverCall(req, res){
	  var url_parts = url.parse(req.url, true);
	  var pathName=url_parts.pathname;
	  try{
		  
	   if(debug){
		   console.log(pathName);
	   }
	   var query=url_parts.query;
	   var s=query.s;
	   var ttid=null;
	   
	   if(query.t){
			ttid=query.t;
	   }
	   
	   if(debug){
	    console.log('tid: '+ttid);
	    console.log(s);
	   }
	   /*
	   if (req.url === '/favicon.ico') {
		    res.writeHead(200, {'Content-Type': 'image/x-icon'} );
		    res.end();
		    console.log('favicon requested');
		    return;
	   }*/

	   if(req.method==='GET') {
	      if(pathName==="/tt/"){
				if(s==='c' || s==='c2'){
					if(debug){
						console.log('c requested');
					}
					if(typeof pCall==='function'){
						pCall(ttid,url_parts,query,pathName,req,res);
					}
					res.setHeader('Content-Type', 'image/gif');
					res.statusCode = 200;
					res.end();
					
				}else{
					res.statusCode = 200;
					res.setHeader('Content-Type', 'text/plain');
					res.end('Unparamitarized');
				}
	      }else{
			  res.statusCode = 200;
			  res.setHeader('Content-Type', 'text/plain');
			  res.end('Unparamitarized');
	      }
			
	   }
	   
	  }catch(error){
		  console.log(error);
	  }
}

var server = http.createServer(function(req, res) {
    serverCall(req,res);
});

server.listen(port);
server.timeout = 1500;
