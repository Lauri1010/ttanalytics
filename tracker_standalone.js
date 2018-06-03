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
			this.lHref=window.location.href;
			this.dc=true;
			this.fVtracked=false;
			this.visitId;
			this.sTime;
			this.lTime;
			this.tTime=false;
			this.hn=window.location.hostname;
			this.chn=this.hn.replace('www','');
			this.ttid=00000;
			this.aMaxLenghtC=41;
			this.lMaxLenghtC=41;
			this.pnMaxLenght=110;
			this.optOut=false;
			this.coptOut=false;
			// this.protocol=(location.protocol == "https:" ? "https://" : "http://");
			this.protocol='https://';
	        this.eType='mousedown';
	        if ('ontouchstart' in document.documentElement === true){
	          this.eType='touchstart';
	        }
	        this.eSelector='a[href]';
	        this.serverDomain='ttanalytics.azurewebsites.net';
	        this.serverPort='';
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
					return pathName.replace('/',':').toLowerCase();
				}
			};
			
		    this.readElementText=function(e){
            	      if(e.textContent){
            	    	 var text= e.textContent.toLowerCase();
                         text=text.replace(/\s\s+/g, ' ');
						 return text;
            	      }else{
                         return 'undefined';
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
			        	r.src = this.protocol+opts.url + '/tc/?co=1&' + qString;
			        }else{
				        r.src = this.protocol+opts.url + '/tc/?' + qString;
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
					
					// if(!pageName && typeof pageName !== 'string'){
						self.pageName=self.pageNameF();
					// }else{
						// self.pageName=pageName;
					// }
					
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
							if(fd){
								self.t('hit',pageName,action);
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
	
		tr.prototype.t=function(c,pageName,action){
			var self=this;
			try{
				if(self.cm){console.log(pageName);};
				if(self.ttid && typeof self.ttid === 'string' && !self.aOptOut){
						if(pageName.length<self.pnMaxLenght){
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
											self.md=2;
										}								
								}
								
							    
								
								p.s=st;
							
								if(self.bust){
									p.b=(new Date()).getTime();
								}
								
								if(typeof self.referrerE === 'string' && self.referrerE){
									p.r=self.referrerE;
								}
								
								/*
								if(typeof self.pageTitle === 'string' && self.pageTitle){
									p.p=self.pageTitle;
								} */
	
								p.p1=pageName;
								
								/*
								if(typeof self.ePathE === 'string' && self.ePathE){
									p.p2=self.ePathE;
								}*/

								
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
							if(self.cm){console.log("page name too long");};
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
				document.body.addEventListener(self.eType, function(event) {
					var tag = event.target;
					if (tag.tagName == 'A') {
						if(self.ttid && typeof self.ttid === 'string' && (self.bust==true || self.bust==false) && typeof self.pageName === 'string'){
							if(self.cm){console.log('Autotracking init');};
							
							var href=tag.href;
							var pathName='undefined';
	
							if(typeof href !== 'undefined'){
									pathName=encodeURIComponent(href.replace("http://","").replace("https://","").replace(self.hn,""));
								
							}
								var elementText=self.readElementText(tag);
								// var selectorData=self.getSdata(tag);
								
								var id1=self.getParentElementId(tag,0);
								var id2=self.getParentElementId(tag,1);
								var cl1=self.getParentElementClass(tag,0);
								var cl2=self.getParentElementClass(tag,1);
								
								if(self.cm){ 
									console.log('Href '+href);
									console.log('Pathname '+pathName);
									console.log('Element text or data attribute: '+elementText);
									console.log('Parent 1 id '+id1);
									console.log('Parent 2 id '+id2);
									console.log('Parent 1 class '+cl1);
									console.log('Parent 2 class '+cl2);
								}
								self.t('hit',self.pageName,{'category':'click','text':elementText,'path':pathName,'pid1': id1,'pid2': id2,'pcl1': cl1,'pcl2': cl2});			
					  }else{
						  if(self.cm){console.log('Autotracking invalid parameters tid: '+self.ttid+'  ');};
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
		
		tr.prototype.cc=function(name,value,seconds,domain,isSession) {
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

