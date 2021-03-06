(function(window,document){
		/****
			Copyright: Lauri Turunen


		****/	
		var tr=function(){
			this.cm=false;
			this.pageName;
			this.pathNameV=window.location.pathname;
			this.pathNameVF=this.pathNameV.replace('/',':');
			this.pathNameE=encodeURIComponent(window.location.pathname);
			this.pageTitle=encodeURIComponent(document.title);
			this.ePath = this.pathNameV.split("/").pop();
			this.ePathE = encodeURIComponent(this.ePath);
			this.referrer = document.referrer;
			this.referrerE=encodeURIComponent(this.referrer);
			this.domain = window.location.hostname;
			this.pDomain= this.domain.replace('www.','.');
			this.rDomain = this.domain.replace('www.','');
			this.safeDomain = this.pDomain.replace(/\./g,':'); 
			this.lHref=window.location.href;
			this.dc=true;
			this.fVtracked=false;
			this.visitId;
			this.sTime;
			this.lTime;
			this.tTime=false;
			this.hn=window.location.hostname;
			this.ttid=00000;
			this.aMaxLenghtC=80;
			this.eTextLenght=105;
			this.lMaxLenghtC=80;
			this.pnMaxLength=110;
			this.referrerMaxLength=110;
			this.optOut=false;
			this.coptOut=false;
			this.uvid;
			this.vid;
			// this.protocol=(location.protocol == "https:" ? "https://" : "http://");
			this.protocol='https://';
	        this.eType='mousedown';
	        if ('ontouchstart' in document.documentElement === true){
	          this.eType='touchstart';
	        }
	        this.eSelector='a[href],input[type="submit"],button[type="submit"],button';

	        if(this.hn=='localhost'){
	        	this.serverDomain='localhost';
		        this.serverPort=':1337';
	        }else{
		        this.serverDomain='ttanalytics.westeurope.cloudapp.azure.com';
		        this.serverPort='';
	        }
			this.md=1;
			this.bust=true;
			this.autotagging=true;
			
			
			this.pageNameF=function() {
				
				var pathName=window.location.pathname;
				if(pathName){
					if(pathName!=="/"){
						if(pathName.charAt(0)==='/'){
							var end=pathName.length;
							pathName=pathName.substring(1, end);
						}
						// return pathName.replace('/(?!^)\//g', ':').toLowerCase();
					}
					return pathName.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/gi,':').toLowerCase();
				}
			};
			
		    this.readElementText=function(e){
            	      if(e.textContent){
            	    	 var text= e.textContent.toLowerCase();
                         text=text.replace(/\s\s+/g, ' ');
						 return text;
            	      }else{
						 if(e.value){
							return e.value; 
						 }else{
							return 'undefined';
						 }
                      };    
								  
		    };

		    this.getSdata=function(e){
		    	    var r='';
		    	    for(var i=0;i<3;i++){
		    	    	e=e.parentElement;
		    	    	if (e.id) {
		    	    		r+=i+'id~'+e.id;
			    	    }
		    	    	if (e.className) {
			    	    	r+=i+'cl~'+e.className;
			    	    }
		    	    	if(i>0 && r){r+=':';};
		    	    }
		    	    
		    	    if(r){
			    	    return r;
		    	    }else{
		    	    	return 'not available';
		    	    }
	
		    };
		    
		    this.getParentElementId=function(e,d){
	    		if(d>0){
	    			e=e.parentElement.parentElement;
	    		}else{
	    			e=e.parentElement;
	    		}
	    		
		    	if(e.id){	
	    			return e.id;
		    	}else{
		    		return 'na';
		    	}
		    };
		    
		    this.getParentElementClass=function(e,d){
		    	if(d>0){
	    			e=e.parentElement.parentElement;
	    		}else{
	    			e=e.parentElement;
	    		}
	    		
		    	if(e.className){	
	    			return e.className;
		    	}else{
		    		return 'na';
		    	}
		    };

			this.$r = function(opts){
			    // Make sure we have a base object for opts
			    opts = opts || {};
			    // Setup defaults for options
			    opts.url = opts.url || null;
			    opts.vars = opts.vars || {};
			    opts.error = opts.error || function(){};
			    opts.success = opts.success || function(){};
			
			    // Split up vars object into an array
			    var varsArray = [];
			    for(var key in opts.vars){varsArray.push(key+'='+opts.vars[key]);}
			    // Build query string
			    // var qString = encodeURIComponent(varsArray.join('&'));
			    var qString = varsArray.join('&');
			    
			    // Create a beacon if a url is provided
			    if(opts.url && (opts.m===1 || opts.m===2)){
			    	if(opts.m==1){
				        var r = new Image();
			    	}else if(opts.m===2){
			    		var r = document.createElement('script');
			    		r.type = 'text/javascript';
			    		r.async = opts.async;
			    	}
			    
			        if(r.onerror)
			        {r.onerror = opts.error;}
			        if(r.onload)
			        {r.onload  = opts.success;}	
			        if(this.cm){
			        	console.log(this.coptOut);
			        }
			        if(this.coptOut){
			        	r.src = this.protocol+opts.url + '/tt/?co=1&' + qString;
			        }else{
				        r.src = this.protocol+opts.url + '/tt/?' + qString;
			        }
			        if(opts.m===2){
			        	document.getElementsByTagName('head')[0].appendChild(r);
			        }	
			    }
			}};
		
		// true, 1,1,true
		tr.prototype.i=function(ttid,cm,fd,pageName,action,bust,autotracking,allowTracking,allowCookies){
			    try{
					var self=this;

					self.cm=cm;	
					self.aOptOut=!allowTracking;
					self.coptOut=!allowCookies;
					self.autotracking=autotracking;
					if(self.cm){console.log(self.aOptOut);};
					if(self.cm){console.log(self.coptOut);};
					
					if(!pageName){
						self.pageName=self.pageNameF();
					}else if(typeof pageName==='string'){
						self.pageName=pageName;
					}
					
					if(typeof ttid == 'string'){
						self.ttid=ttid
						if(self.cm){
							console.log(self.ttid);
						}
					};
					
					if(self.ttid && typeof self.ttid === 'string'
					&& (bust === true || bust === false) 
					&& !self.aOptOut){
						self.bust=bust;
						    if(!(self.rc("ttc1_uvid"))){
								self.uvid=self.idg();
								self.cc("ttc1_uvid",self.uvid,63072000,self.pDomain);
							}else{
								self.uvid=self.rc("ttc1_uvid");
							}
							if(!(self.rc("ttc1_vid"))){
								self.vid=self.idg();
								self.cc("ttc1_vid",self.vid,1800,self.pDomain);
							}else{
							    self.vid=self.rc("ttc1_vid");	
							}
							if(fd){
								self.t('hit',action);
								if(self.autotagging){
									if(self.cm){console.log('Autotagging enabled');};
									self.ut();
								}
							}
	
					}else{
						if(self.cm){console.log("Malformed parameter settings. ");}
					}
				
			    }catch(error){
			    	if(self.cm){
			    		console.log(error);
			    	}
			    }
		}
	
		tr.prototype.t=function(c,action){
			var self=this;
			try{
				if(self.ttid && typeof self.ttid === 'string' && !self.aOptOut && self.pageName.length < self.pnMaxLength && self.referrerE.length < self.referrerMaxLength){
							if(c=='hit'){
								
								var st='c';
								
								var p={
									t:self.ttid
								};
								
								if(self.cm){console.log(action);};
								
								if(action){
									if(action.category && typeof action.category === 'string' &&  action.text && typeof action.text === 'string'){
											p.a=action.category;
											p.a1=action.text;
											
											if(action.path && typeof action.path === 'string'){
												p.a2=action.path;
											}
											
											if(action.sdata && typeof action.sdata === 'string'){
												p.a3=action.sdata;
											}
											
											if(action.pid1 && typeof action.pid1 === 'string'){
												p.d1=action.pid1;
											}
											
											if(action.pid2 && typeof action.pid2 === 'string'){
												p.d2=action.pid2;
											}
											
											if(action.pcl1 && typeof action.pcl1 === 'string'){
												p.d3=action.pcl1;
											}
											
											if(action.pcl2 && typeof action.pcl2 === 'string'){
												p.d4=action.pcl2;
											}
											
											st='c2';
											self.md=1;
										}								
								}
								
							    
								
								p.s=st;
							
								if(self.bust){
									p.b=(new Date()).getTime();
								}
								
								if(typeof self.referrerE === 'string' && self.referrerE){
									p.r=self.referrerE;
								}
								
								if(typeof self.uvid !== 'undefined' && self.uvid){
									p.i=self.uvid;
								}
								
								if(typeof self.vid !== 'undefined' && self.vid){
									p.v=self.vid;
								}
								
								/*
								if(typeof self.pageTitle === 'string' && self.pageTitle){
									p.p=self.pageTitle;
								} */
	
								p.p1=self.pageName;
								
								/*
								if(typeof self.ePathE === 'string' && self.ePathE){
									p.p2=self.ePathE;
								}*/

								p.hn=self.safeDomain;
								
								self.$r({
							       url : self.serverDomain+self.serverPort,
							       async : true,
							       m:self.md,
							       vars : p,
							       error : function(){
							    	   if(self.cm){console.log("error in request");}
							       },
							       success : function(c){
							    	  if(self.cm){console.log('request successfull')};
							       }
								});
								
							}
				}else{
					if(self.cm){console.log("ttid needs to be set");};
				}
			
			}catch(e){
				if(self.cm){console.log(e);};
			}
			
		}
		
		tr.prototype.ut=function(){
			var self=this;
			try{
				
				document.addEventListener(self.eType, function(event) {
					var tag = event.target;
					var tagName=tag.tagName.toLowerCase();
					var id1=self.getParentElementId(tag,0);
					var id2=self.getParentElementId(tag,1);
					var cl1=self.getParentElementClass(tag,0);
					var cl2=self.getParentElementClass(tag,1);
					var elementText=self.readElementText(tag);
				
					if(id1.length<self.aMaxLenghtC && 
								 id2.length<self.aMaxLenghtC && 
								 cl1.length<self.aMaxLenghtC && 
								 cl2.length<self.aMaxLenghtC && 
								 elementText.length < self.eTextLenght &&
								 self.ttid 
								 && typeof self.ttid === 'string' && (self.bust==true || self.bust==false) && typeof self.pageName === 'string'){
									if (tagName == 'a') {
										
											if(self.cm){console.log('Autotracking init');};
											
											var href=tag.href;
											var pathName='undefined';
					
											if(typeof href !== 'undefined'){
													pathName=encodeURIComponent(href.replace("http://","").replace("https://","").replace(self.hn,""));
												
											}
												
												// var selectorData=self.getSdata(tag);
											
												
												if(self.cm){ 
													console.log('id2 length '+id2.length);
													console.log('id2 length '+id2.length);
													console.log('cl1 length  '+cl1.length);
													console.log('cl2 length  '+cl2.length);
												}

												
													if(self.cm){ 
														console.log('Href '+href);
														console.log('Pathname '+pathName);
														console.log('Element text or data attribute: '+elementText);
														console.log('Parent 1 id '+id1);
														console.log('Parent 2 id '+id2);
														console.log('Parent 1 class '+cl1);
														console.log('Parent 2 class '+cl2);
													}
													self.t('hit',{'category':'click','text':elementText,'path':pathName,'pid1': id1,'pid2': id2,'pcl1': cl1,'pcl2': cl2});	
											
									}else if(tagName == 'input' || tagName == 'button'){
									     self.t('hit',{'category':tagName+' submit','text':elementText,'path':pathName,'pid1': id1,'pid2': id2,'pcl1': cl1,'pcl2': cl2});
									}
					  
				    }
		
				});
	 
			 }catch(error){
       		  if(self.cm){
       			  console.log(error);
       		  }
       	  }				

		}

		tr.prototype.get=function(name){
			 if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search)){
				 return decodeURIComponent(name[1]);
			 }
		}
		
		tr.prototype.cc=function(name,value,seconds,domain) {
		    if (seconds) {
		        var date = new Date();
		        date.setTime(date.getTime()+(seconds*1000));
		        var expires = "; expires="+date.toGMTString();
		    }
		    if(domain){document.cookie = name+"="+value+expires+";domain="+domain+";path=/";}
			else{document.cookie = name+"="+value+expires+";path=/";};
		}
		
		tr.prototype.rc=function(name) {
		    var nameEQ = name + "=";
		    var ca = document.cookie.split(';');
		    for(var i=0;i < ca.length;i++) {
		        var c = ca[i];
		        while (c.charAt(0)==' ') c = c.substring(1,c.length);
		        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
		    }
		    return false;
		}
		
		tr.prototype.gcv=function(field){
		    var re = new RegExp(field + "=([^;]+)");
		    var value = re.exec(document.cookie);
		    return (value != null) ? unescape(value[1]) : null;
		}
		
		tr.prototype.ec=function(name) {
		    createCookie(name,"",-1);
		}
		
		tr.prototype.idg=function(){
			 this.length = 8;
			 this.timestamp = +new Date;
			 
			 var _getRandomInt = function( min, max ) {
				return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
			 }

				 var ts = this.timestamp.toString();
				 var parts = ts.split( "" ).reverse();
				 var id = "";
				 
				 for( var i = 0; i < this.length; ++i ) {
					var index = _getRandomInt( 0, parts.length - 1 );
					id += parts[index];	 
				 }
				 
				 return id;
	
	   }
	
		
		var tRun=new tr();
		
		window.ttlib = (function(){
		    var _a = {};
		    var _g = {};

		    return {
		        init : function(args,gSettings) {
		            _a = args;
		            _g = gSettings;		            
		        },
				pageview: function() {
					tRun.i(_a[0],_a[1],_a[2],_a[3],_a[4],_a[5],_a[6],_g[0],_g[1]);
		        },
		        fireEvent: function(){
		        	
		        }
		    };
		}());

})(window,document);