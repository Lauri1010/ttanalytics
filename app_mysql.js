var http = require('http');
var https = require('https');
const fs = require('fs');
var tls = require('tls');
var mysql = require('mysql');
// HTTPS port 443, http port 80. To be changed in production
var port = (process.env.PORT || process.env.VCAP_APP_PORT || 8888);
var ipService = require('ip');
const requestIp = require('request-ip');
var url = require('url');
var uniqid = require('uniqid');
var cookieService= require("cookies");
var debug=true;
var skey = fs.readFileSync('lkey.pem');
var scert = fs.readFileSync('lcert.pem');
const util = require('util');

var options = {
	    key: skey,
	    cert: scert,
	    rejectUnauthorized: false,
	    requestCert: true,
	    agent: false
};

var pool = mysql.createPool({
	  host     : '127.0.0.1',
	  port	   : '3306',
	  user     : 'analytics',
	  password : 'paloauto2',
	  database : 'tt_analytics',
	  debug    :  false
});

var executeSql = function(sqls,data,callback) {
	// console.log(sql+' '+data);
	if(sqls && data){
		if(debug){
			console.log(sqls+' '+util.inspect(data));
		}
	    pool.getConnection(function(err, connection) {
		    if(connection){
		    	connection.query({
		    	    sql: sqls,
		    	    timeout: 40000
		    	  },
		    	  data,
		    	  function (error, results, fields) {
		    		  
		    		  if (error) {
					        if(debug){
					    		console.log(error); 
					        }
					        return connection.rollback(function() {
					          throw error;
					        });
					  }

		    		  connection.release();
		    		  
		    		  if(callback){
					    	callback(results);
					  }

		    	  }
		    	);
		    }else{
		    	if(err){
			    	console.log(err);
		    	}else{
			    	console.log('No connection');
		    	}
		    }
	    });
	 }
};

/*var getClientIp = function(req) {
    return (req.headers["X-Forwarded-For"] ||
            req.headers["x-forwarded-for"] ||
            '').split(',')[0] ||
           req.client.remoteAddress;
};
*/
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
			  
			  if(debug){
				  console.log(hst);
			  }

			  if(typeof req.headers.referer !== 'undefined'){
				  referrer=req.headers.referer;
			  }
			  
			  var cookies = new cookieService( req, res ), unsigned, signed, tampered;
			  
			  if(cookies.get('tt_vid')){
				  tt_vid=cookies.get('tt_vid');
			  }else{
				  
				  var date = new Date();
			      date.setTime(date.getTime()+(1800*1000));
			      tt_vid=uniqid();
				  
				  if(hst){
					  cookies.set('tt_vid', tt_vid, {expires: date, domain: hst});
				  }else{
					  cookies.set('tt_vid', tt_vid, {expires: date});
				  }
			  }
			  
			  if(typeof query.co === 'undefined'){
			  
				  if(cookies.get('tt_uvid')){
					  tt_uvid=cookies.get('tt_uvid');
				  }else{
					  var date = new Date();
				      date.setTime(date.getTime()+(63072000*1000));
				      tt_uvid=uniqid();
				      if(hst){
				    	  cookies.set('tt_uvid', tt_uvid, {expires: date, domain: hst});
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

			  if(query.a){
				  a=query.a;
				  if(debug){
					  console.log(a);
				  }
				  if(query.a1){
					  a1=query.a1;
					  if(debug){
						  console.log(a1);
					  }
						  if(query.a2){
							  a2=query.a2;  
								  if(debug){
									  console.log(a2);
								  }
		 
								  if(query.a3){
									 a3=query.a3; 
									 if(debug){
										 console.log(a3);
									 }
								  }
						  }
				  }
			  }
			  
			  function saveVisit(ttid,accountId,tt_uvid,tt_vid,hst,a){
				  
		  		  try{
		  			var visitorSelect=[tt_uvid];  
		  			
		  			var insertUniqueVisitor=function(results){
		  				
			  			var visitorId;
		  				
		  				if(debug){
		  					console.log('Insert visitor results '+results);
		  				}
		  				
		  				if(results.length>0){
		  					visitorId=results[0].visitor_id;
		  					if(debug){
		  						console.log('Visitor id '+visitorId);
		  					}
		  				}else{
		  					
			  				var visitorData = {visitor_ipv4: ip,visitor_identity_hash: tt_uvid};
			  				var iv=function(results){
			  					if(debug){console.log(results.insertId);};
			  					visitorId=results.insertId;
			  				}
			  				executeSql('INSERT INTO visitor SET ?',visitorData,iv);
		  					
		  				}
		  				
		  			  // Insert visit data
						  var visitData = {visitor_hash_ref: tt_uvid,visit_identity_hash:tt_vid};
						  var ivi=function(results){
							  if(debug){	
								  console.log(results);
							  }
							  
								  // Insert hit data
								  var hitd = {
								    hit_id:null,
									visitor_id_ref : visitorId,
									website_identity_id_ref: accountId,
									domain : hostname,
									trust_level : 10,
									referrer : referrer,
									page_name : pageName,
									page_path : pagePath,
									received : null
								 };
								  
								  if(debug){
									  for(var attributename in hitd){
										  if(debug){	
										    console.log('h-data '+attributename+": "+hitd[attributename]);
										  }
									  }
								  }
								  
								  var hitCallback=function(results){
									  if(debug){
										  console.log(results.insertId);
									  }
									  
									  var hitData = {
											 data_row_id:null,
											 domain:hst,
											 page_name : pageName,
											 page_path : pagePath,
											 website_identity_id_ref : accountId
									  };
									  
									  executeSql('INSERT IGNORE INTO hit_data SET ? ',hitData,null);
									  
									  
								  }
								  
								  if(hitd.visitor_id_ref && hitd.website_identity_id_ref){
									  // executeSql('INSERT INTO hit(hit_id, visitor_id_ref, website_identity_id_ref, domain, trust_level, referrer, page_name, page_path) VALUES (?)', hitData,hitCallback);
									  executeSql('INSERT INTO hit SET ? ',hitd,hitCallback);
								  }
							  
						  }
						  executeSql('INSERT IGNORE INTO visit SET ?',visitData,ivi);
						  
						  if(a){
							  if(a.length < amC){
								  var eventData=
								  	 {
								     event_id:null,
								     visitor_id_ref:visitorId,
								     category:a
								     };
									  if(a1){
										  if(a1.length < a1mC){
											  eventData.action=a1;
												  if(a2){
													  if(a2.length < a2mC){
														  eventData.path=a2;
													  }
												  }
												  if(a3){
													  if(a3.length < a3mC){
														  eventData.label=a3;
													  }
												  }
												  if(tt_time_c){
													  eventData.time_since_page_view_load=tt_time_c;
												  }
												  var ec=function(results){
													  if(results){
														  
													  }
												  }
												  
												  if(debug){console.log('insert into event '+eventData);}
												  
												  executeSql('INSERT INTO event SET ?',eventData,ec);
												  
										  }
									  }
							  
						  }
					  }else{
						  if(debug){console.log('No a set')};
					  }
		  				
		  			}
		  			
		  			executeSql('SELECT visitor_id FROM visitor WHERE visitor_identity_hash = ?',visitorSelect,insertUniqueVisitor);


				  }catch(err) {
				      console.log(err);
				  }
					  
			  }
			 
			  if(tt_vid && tt_uvid && ttid && pageName){
				  
				  if(debug){	
					  console.log(tt_vid+' '+tt_uvid+' '+ttid);
				  }
				  
					  var accountData = [ttid];
					  var cb=function(results){
						  if(debug){
							  console.log('Results '+results);
						  }
						  
						  if(results[0]){
							  var ctid=results[0].website_identity_token;
							  var accountId=results[0].account_id;
							  if(ctid===ttid){
								  if(debug){	
									  console.log('website_identity_token '+results[0].website_identity_token);
								  }
								  saveVisit(ttid,accountId,tt_uvid,tt_vid,hst,a);
							  }
						  }
					  }
					  executeSql('SELECT account_id, website_identity_token FROM analytics_account WHERE website_identity_token = ? LIMIT 1',accountData,cb);
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
	      }
			
	   }
	   
	  }catch(error){
		  console.log(error);
	  }
}


https.createServer(options, function (req, res) {
	serverCall(req, res);     
}).listen(port);
console.log('Server running at https://127.0.0.1:'+port);
/*http.createServer(options, function (req, res) {
	serverCall(req, res); 
}).listen(port);
console.log('Server running at http://127.0.0.1:'+port);*/
