var http = require('http');
var https = require('https');
const fs = require('fs');
var tls = require('tls');
// HTTPS port 443, http port 80. To be changed in production
var porthttp = (process.env.PORT || process.env.VCAP_APP_PORT || 1337);
var ipService = require('ip');
const requestIp = require('request-ip');
var url = require('url');
var uniqid = require('uniqid');
var cookieService= require("cookies");
var debug=true;
// var skey = fs.readFileSync('lkey.pem');
// var scert = fs.readFileSync('lcert.pem');
const util = require('util');
let DocumentDBClient = require('documentdb').DocumentClient;
let docdbUtils = require('./models/cosmosdb-manager');

function ttModel() {
	this.host = process.env.HOST || "https://ttanalytics.documents.azure.com:443/";
	this.authKey = process.env.AUTH_KEY || "4AN57BRIrDURzWM6f4aEidAnykKtlir30XxQM9cXrdSV1pnxipNA9vq7MsiegroLPXpJSV6Q9xNB9KAB5kYZeQ==";
	this.databaseId = "ttanalytics";
	this.collectionId = "instance";
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
		        callback(err);
		    } else {
		        callback(null, doc);
		    }
		    });
		},

};
let model=new ttModel();
model.init();

var optionshttps = {
	    key: skey,
	    cert: scert,
	    rejectUnauthorized: false,
	    requestCert: true,
	    agent: false
};

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
			  var amC=51;
			  var a1mC=51;
			  var a2mC=51;
			  var a3mC=51;
			  var tt_vid;
			  var tt_uvid;
			  var tt_time_c;
			  var pageName;
			  var pagePath="undefined";
			  var pageTitle;
			  var pageId;
			  var header=JSON.stringify(req.headers);
			  if(debug){
				  console.log(header);
			  }
			  var referrer="not defined";
			  var hst = req.headers.host;
			  var cleanHost=hst.substring(0, hst.indexOf(':'));
			  
			  if(debug){
				  console.log(hst);
			  }

			  if(typeof req.headers.referer !== 'undefined'){
				  referrer=req.headers.referer;
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

			  }else{
				  tt_uvid=1;
				  tt_vid=1;
			  }
			  
			  var ip=requestIp.getClientIp(req); 

			  if(ipService.isV4Format(ip) && ip){
				  ip=ipService.mask(ip);
				  ip=ipService.toLong(ip);
			  }
			  
			  if(!ip){
				  ip=0;
			  }
			  
			  if(debug){
				  console.log('Ip '+ip);
			  }
			  
			  if(debug){
				  console.log(ip);
			  }
			  
			  if(query.p2){
				  pagePath=query.p2;
			  }
			  
			  var hostname=req.headers.host;
			  var lang=req.headers["accept-language"];
			  			

			  if(query.p1){
				  pageName=query.p1;
			  }
			  
/*			  if(query.p2){
				  pageName=url_parts.p2;
			  }*/
			  
			  if(debug){
				  console.log(pageName);
			  }
			  
			  
				 
			if(tt_vid && tt_uvid && ttid && pageName){
			  
		  	     var hitd = {
		  				    "account": {
		  				        "website_identity_token": ttid,
		  				        "account_id_ref": -1
		  				    },
		  				    "session_data": {
		  				        "visitor_id": tt_vid,
		  				        "location": "not defined",
		  				        "ip": ip
		  				    },
		  				    "visitor": {
		  				        "visitor_unique_id": tt_uvid,
		  				        "global_visitor_id": "not available"
		  				    },
		  				    "hit_data": {
		  				        "page_name": pageName,
		  				        "page_path_customized": pagePath,
		  				        "page_url_shorned": pagePath,
		  				        "page_domain": hst,
		  				        "unix_timestamp": Math.floor(new Date() / 1000),
		  				        "referrer": referrer,
		  				        "event_category": "",
		  				        "event_element_text": "",
		  				        "event_target_url": "",
		  				        "event_selector_data_raw": "",
		  				        "event_htlm_parent1_id":"",
		  				        "event_htlm_parent2_id":"",
		  				        "event_htlm_parent1_class":"",
		  				        "event_htlm_parent2_class":"",
		  				    }
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
	   
	   if (req.url === '/favicon.ico') {
		    res.writeHead(200, {'Content-Type': 'image/x-icon'} );
		    res.end();
		    console.log('favicon requested');
		    return;
	  }

	   if(req.method==='GET') {
	      if(pathName==="/tl/"){
					if(s==='gl'){
					  fs.readFile(__dirname+'/tracker_standalone.js', function(err, data) {
						  res.statusCode = 200;
						  res.setHeader('Content-Type', 'application/javascript');
						  res.write(data);
						  res.end();
					  });
					}
		  }else if(pathName==="/tc/"){
				if(s==='c'){
					if(debug){
						console.log('c requested');
					}
					pCall(ttid,url_parts,query,pathName,req,res);
					res.statusCode = 204;
					res.setHeader('Content-Type', 'image/jpg');
					// res.json({p0: 0 })
					// res.setHeader('Content-Type', 'text/plain');
					res.end();
					
				}else if(s==='c2'){
					pCall(ttid,url_parts,query,pathName,req,res);
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/javascript');
					res.write("");
					res.end();
				}else{
					res.statusCode = 200;
					res.setHeader('Content-Type', 'text/plain');
					res.end('unparamitarized');
				}
	      }else{
			  res.statusCode = 200;
			  res.setHeader('Content-Type', 'text/plain');
			  res.end('unparamitarized');
	      }
			
	   }
	   
	  }catch(error){
		  console.log(error);
	  }
}

/*
https.createServer(optionshttps, function (req, res) {
	serverCall(req, res);     
}).listen(port);
console.log('Server running at https://127.0.0.1:'+port); */
http.createServer(function (req, res) {
	serverCall(req, res); 
}).listen(porthttp);
console.log('Server running at http://127.0.0.1:'+port);
