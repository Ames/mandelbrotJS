
var canv; //the canvas object
var canv2; //the canvas object
var selBox;	//a selBox (select-box) object, used when selecting a new region

var ui;	//user interfce

var prog;


window.onhashchange=function hashChanged(){	
	if(window.location.hash){
		var args=window.location.hash.substring(1).split(',');
		ui.setx(args[0]);
		ui.sety(args[1]);
		ui.setw(args[2]);
		ui.seti(args[3]);
	}
	
	go();
}

function setHash(){
	
	var w=ui.getw();
	
	var mag=1-Math.round(Math.log(w)/Math.log(10));
	
	var newHash="#"+
		roundn(ui.getx(),mag)+","+
		roundn(ui.gety(),mag)+","+
		roundn(ui.getw(),mag)+","+
		ui.geti();
		
	if(newHash!=window.location.hash){
		window.location.hash=newHash;
	}else{
		window.onhashchange();	
	}
}

function roundn(n,mag){
	return Math.round(n*Math.pow(10,mag))/Math.pow(10,mag)
}

function init(){
	
	
	prog=new Progress();
	

	canv=new Canvas('canvas');
	canv2=new Canvas('canvas2');
	
	ui=new UI();

	
	window.onresize=function(){
		//alert('hey!');
		canv.resize();
		canv2.resize();
		//go();
		ui.resize();
	}
	
	
	if(gup('x')){
		//we're still supporting ?x=... format for backwards compatibility//
		/*
		if(gup('x')) ui.setx(gup('x'));
		if(gup('y')) ui.sety(gup('y'));
		if(gup('w')) ui.setw(gup('w'));
		if(gup('i')) ui.seti(gup('i'));
		*/
		/////
		
		
		window.location="./#"+gup('x')+","+gup('y')+","+gup('w')+","+gup('i');
		//window.location.search="";
		
		//setHash();
		
	}else{
		window.onhashchange();
	}
	//setHash();
	//window.onhashchange();
	//go();

	//setTimeout('go()',2000);
}



function Progress(){
	
	this.parts;
	this.completed;
	
	this.anim=document.getElementById('run');

	this.prog=document.getElementById('progress');
	this.progbar=document.getElementById('progbar');

	this.HTML="HEY!";
	
	this.start=function start(numParts){
		this.parts=numParts;
		this.completed=0;
		this.progbar.style.width="0%";
		this.prog.style.visibility="visible";
		//this.anim.style.visibility="visible";
	}
	this.finish=function finish(){
		this.completed++;
		
		
		this.progbar.style.width=(Math.floor(100*this.completed/this.parts)+"%");
		
		if(this.completed==this.parts){
			this.prog.style.visibility="hidden";

			//this.anim.style.visibility="hidden";
		}
		
	}
	
}


function go(){
	

	
	var x=ui.getx();
	var y=ui.gety();
	var w=ui.getw();
	var i=ui.geti();

	var xparts=6;
	var yparts=5;
	
	var xpart=Math.floor(canv.width/xparts);
	var ypart=Math.floor(canv.height/yparts);

	prog.start(xparts*yparts);

	var px,py;

	for(py=0; py<yparts; py++){
		for(px=0; px<xparts; px++){
			
			setTimeout('mandel('+ui.getx()+','+ui.gety()+','+ui.getw()+','+ui.geti()+',"'+ui.getc()+'",'+px*xpart+','+(xpart*(px+1))+','+py*ypart+','+(ypart*(py+1))+')',Math.floor(Math.random()*20));
			//Math.floor(Math.random()*10) //random timeouts
		}		
	}

	//document.getElementById('para').innerHTML="Parameters: ?x="+x+"&y="+y+"&w="+w+"&i="+i;

	//document.location.hash="#"+x+","+y+","+w+","+i;

	ui.resize();
}


function mouseDown(event){
	//alert(event.button);
	if(event.button==0){//left-click
		selBox=new Box(event.pageX-canv.x, event.pageY-canv.y);
	}
}

function mouseUp(event){

	selBox.release(event.pageX-canv.x, event.pageY-canv.y);
	selBox=null;
}

function mouseMove(event){
	
	if(selBox){
		selBox.up(event.pageX-canv.x, event.pageY-canv.y);
	}else if(ui.gett()){
		
		//this probably should go in a seperate function...
		
		canv2.show();
	
		
		//var x=ui.getx();
		//var y=ui.gety();
		//var w=ui.getw();
		//var i=ui.geti();
		
		

//ui.getx()+','+ui.gety()+','+ui.getw()+','+ui.geti()+',"'+ui.getc()+'",'+px*xpart+','+(xpart*(px+1))+','+py*ypart+','+(ypart*(py+1))		

		var cx=ui.getx();
		var cy=ui.gety();
		var w=canv2.width;
		var h=canv2.height;
		var wide=ui.getw();
		
		var imax=ui.geti();
		
		var x0=0;
		var y0=0;
		
		var x=0;
		var y=0;
		var i=0;
		
		var mx=event.pageX-canv2.x;
		var my=event.pageY-canv2.y;

		var y0=-cy+(my/h-.5)*(h/w)*wide
		var x0=+cx+(mx/w-.5)*wide;

		var py=((y+cy)/((h/w)*wide)+.5)*h;
		var px=((x-cx)/(wide)+.5)*w;



		var ctx=canv2.ctx;

		ctx.clearRect(0, 0, w, h)
		
	//	ctx.shadowColor="black";
	//	ctx.shadowBlur=1;

		var xtmp;
		

		while(i<imax && x*x+y*y<4){
			
			// (a+ib)^2
			// (a+ib)(a+ib)
			// a^2 + 2iab + (ib)^2
			// a^2 + 2iab - b^2
			
			
			ctx.beginPath();
			ctx.moveTo(px,py);
		
			
			xtmp=x*x-y*y+x0;
			y=2*x*y+y0;
			x=xtmp;
			
			
			
			py=((y+cy*1)/((h/w)*wide)+.5)*h;
			px=((x-cx)/(wide)+.5)*w;
			
			ctx.lineTo(px, py);
			
			
			color=getColor(i,imax,ui.getc());
			
			color[0]*=.9;
			color[1]*=.9;
			color[2]*=.9;
			
			//ctx.strokeStyle = "#"+((Math.round(color[0])<<16)+(Math.round(color[1])<<8)+(Math.round(color[2]))).toString(16);
			//ctx.strokeStyle = "#"+Math.round(color[0]).toString(16)+Math.round(color[1]).toString(16)+Math.round(color[2]).toString(16);
			ctx.strokeStyle=rgb2hex(color);
			ctx.stroke();

			
			i++;
		}


		//ctx.lineTo(0, 0);


		//color=getColor(i,imax,ui.getc());


		//ctx.strokeStyle = "#eee";
		
	}else{
		canv2.hide();
		
	}
	
}

function zoomOut(){
	ui.setw(ui.getw()*4);
	setHash();
}
function doReset(){
	ui.setx(0);
	ui.sety(0);
	ui.setw(4.5);
	ui.seti(200);
	setHash();
}

function rgb2hex(color){
	return "#"+
	Math.round(color[0]/16).toString(16)+
	Math.round(color[0]%16).toString(16)+
	Math.round(color[1]/16).toString(16)+
	Math.round(color[1]%16).toString(16)+
	Math.round(color[2]/16).toString(16)+
	Math.round(color[2]%16).toString(16);
}

function mandel(cx,cy,wide,imax,colors,xmin,xmax,ymin,ymax){
	
	var start=(new Date).getTime();
	 
//	var imax=64;
//	var cx=-1;
//	var cy=.5;
//	var wide=1;
	
	//info();
	//info("c: "+cx+", "+cy+" wide: "+wide+" imax:"+imax);

	var w=canv.width;
	var h=canv.height
	
	var x0,y0,x,y,xtmp,i;
	
	var color;
	
	var px,py;
	
	var val;
	
	for(var py=ymin;py<ymax;py++){
		y0=-cy+(py/h-.5)*(h/w)*wide;
		
		for(var px=xmin;px<xmax;px++){
			x0=+cx+(px/w-.5)*wide;
			
			x=y=i=0;
			
			while(i<imax && x*x+y*y<4){
				
				// (a+ib)^2
				// (a+ib)(a+ib)
				// a^2 + 2iab + (ib)^2
				// a^2 + 2iab - b^2
				
				xtmp=x*x-y*y+x0;
				y=2*x*y+y0;
				x=xtmp;
				
				i++;
			}
			
			if(i==imax){	//in set
				color=[0,0,0,255];
			}else{			//not in set
			
				color=getColor(i,imax,colors);

			}
			
			canv.point(px,py,color);
		}
	}
	
	canv.update();
	
//	info("time: "+((new Date).getTime()-start));

	prog.finish();

}

function getColor(i,imax,colors){
	
	var color;
	
	val=(1-i/imax);

	//this whole color scheme business really needs to get abstracted, including the HTML part

	switch(colors){
		case 'color1':
			//color, relative
			color=hsv(i%(255)/255,1,1);
			break;
		case 'color2':
			//color, absolute
			color=hsv(val,1,1);
			break;
		case 'grey':
			//color, absolute
			//color=hsv(0,0,val);
			color=[255*val,255*val,255*val,255];
			break;
		case 'red':	//should allow arbitrary hues
			color=[255*val,0*val,0*val,255];
			break;
		case 'purple':	//should allow arbitrary hues
			color=[127*val,32*val,255*val,255];
			break;
		case 'alpha':	//should allow arbitrary hues
			color=[0,0,0,(1-val)*255];
			break;
		case 'white':
		default:
			//white
			color=[255,255,255,255];
			break;
	}

	return color;
}


function Box(x0, y0){
	
	this.x0=x0;
	this.y0=y0;
		
	var ratio=(canv.height/canv.width);
		
/*	this.cdiv=document.getElementById('canvasdiv');
	
	this.div=document.createElement('div');
	
	this.cdiv.appendChild(this.div);
*/
	this.div=document.getElementById('selbox');
	
	this.div.style.visibility="visible";
	
	this.mv=function mv(x1,y1,w,h){
		this.div.style.left=x1+'px';
		this.div.style.top=y1+'px';
		this.div.style.width=w+'px';
		this.div.style.height=h+'px';
	}	
		
	this.up=function up(x, y){
		//info("UP!");
		var wide=Math.abs(x-this.x0);
		
		if(wide==0){	//basically a click event
			//wide=canv.width/10;	//otherwise we get a width of 0; that's no good.
		}
				
		this.mv((x+this.x0)/2-wide/2,(y+this.y0)/2-wide/2*ratio,wide,wide*ratio);	
	}
	
	this.up(this.x0,this.y0);

	this.release=function release(x,y){
		//this.cdiv.removeChild(this.div);
		
		this.div.style.visibility="hidden";

		var wide=Math.abs(x-this.x0);
		
		if(wide==0){	//basically a click event - zoom in
			wide=canv.width/10;	//otherwise we get a width of 0; that's no good.
		}
		
		ui.setx( +ui.getx()+(((x+this.x0)/2)/canv.width-.5)*ui.getw());
		ui.sety( +ui.gety()-(((y+this.y0)/2)/canv.height-.5)*ui.getw()*(ratio));
		ui.setw(+ui.getw()*(wide/canv.width));
		
		setHash();
		//go();
		//ui.setx((this.x0+x)/2);
		
	}
}

function UI(){
	
	//elements:
	this.ex=document.getElementById('cx');
	this.ey=document.getElementById('cy');
	this.ew=document.getElementById('wide');
	this.ei=document.getElementById('imax');
	this.ec=document.getElementById('color');
	this.et=document.getElementById('trace');
	
	this.getx=function getx(){return this.ex.value;}
	this.gety=function gety(){return this.ey.value;}
	this.getw=function getw(){return this.ew.value;}
	this.geti=function geti(){return this.ei.value;}
	this.getc=function getc(){return this.ec.value;}
	this.gett=function gett(){return this.et.checked;}
	
	this.setx=function setx(x){this.ex.value=x;}
	this.sety=function sety(y){this.ey.value=y;}
	this.setw=function setw(w){this.ew.value=w;}
	this.seti=function seti(i){this.ei.value=i;}
	this.setc=function setc(c){this.ec.value=c;}
	this.sett=function sett(t){this.et.checked=t;}
	
	
	this.resize=function resize(){
		uiDiv=document.getElementById('ui')
		
		uiDiv.style.top=canv.height-uiDiv.clientHeight-20+'px';
		uiDiv.style.left=canv.width/2-uiDiv.clientWidth/2+'px';
	}
}

function Canvas(elementName){
	
	
	this.element=document.getElementById(elementName);


	var pos=findPos(this.element);
	
	this.x=pos[0];
	this.y=pos[1];

	this.width=this.element.width;
	this.height=this.element.height;

	this.ctx=this.element.getContext('2d');

	if(this.ctx.createImageData){
		this.imageData = this.ctx.createImageData(this.element.width, this.element.height);
	}else{//opera
		this.imageData = this.ctx.getImageData(0,0,this.element.width, this.element.height);
	}
	
	this.point=function point(px,py,color){
		for(var i=0;i<4;i++){
			this.imageData.data[(py*this.imageData.width+px)*4+i]=color[i];
		}
	}
	
	this.update=function update(){
		this.ctx.putImageData(this.imageData,0,0);
	}
	
	this.resize=function resize(){
		this.element.width=document.getElementById('canvasdiv').clientWidth;
		this.element.height=document.getElementById('canvasdiv').clientHeight;

		this.width=this.element.width;
		this.height=this.element.height;
	
		this.ctx=this.element.getContext('2d');
		
		if(this.ctx.createImageData){
			this.imageData = this.ctx.createImageData(this.element.width, this.element.height);
		}else{//opera
			this.imageData = this.ctx.getImageData(0,0,this.element.width, this.element.height);
		}		

		//go();
	}
	
	this.show=function show(){this.element.style.visibility="visible";}
	this.hide=function hide(){this.element.style.visibility="hidden";}
	
	this.resize();
	
}

function info(message){
	if(message){
		document.getElementById('info').innerHTML+=(message+'<br>');
	}else{
		document.getElementById('info').innerHTML="";
	}
}


//from http://www.quirksmode.org/js/findpos.html
function findPos(obj) {
	var curleft = curtop = 0;
	if (obj.offsetParent) {
		do {
				curleft += obj.offsetLeft;
				curtop += obj.offsetTop;
			} while (obj = obj.offsetParent);
		return [curleft,curtop];
	}
}


/*colors:
	a color will look like this: [red, green, blue, alpha]
	r,g,b,a are 0...255
	hsv() will make this from Hue, Saturation, Value
	h,s,v,a are 0...1

*/
function rgb(r, g, b){
	return [r, g, b, 255];
}
function rgba(r, g, b, a){
	return [r, g, b, a];
}

function hsv(h, s, v){return hsva(h, s, v, 1)}

function hsva(h, s, v, a){
	
	//take HSV (0...1) and return RGB array (0...255)
	
	//code from http://www.easyrgb.com/index.php?X=MATH&H=21#text21
	
	
	if (s==0){ 
		return [v*255,v*255,v*255,a*255];                      //HSV from 0 to 1
	}else{
		
		var var_h = h * 6;
		if (var_h == 6 ) var_h = 0;    //H must be < 1

		var var_i = Math.floor(var_h); //Or ... var_i = floor( var_h )
		var var_1 = v * ( 1 - s );
		var var_2 = v * ( 1 - s * ( var_h - var_i ) );
		var var_3 = v * ( 1 - s * ( 1 - ( var_h - var_i ) ) );
		
		if      ( var_i == 0 ) { var_r = v     ; var_g = var_3 ; var_b = var_1 }
		else if ( var_i == 1 ) { var_r = var_2 ; var_g = v     ; var_b = var_1 }
		else if ( var_i == 2 ) { var_r = var_1 ; var_g = v     ; var_b = var_3 }
		else if ( var_i == 3 ) { var_r = var_1 ; var_g = var_2 ; var_b = v     }
		else if ( var_i == 4 ) { var_r = var_3 ; var_g = var_1 ; var_b = v     }
		else                   { var_r = v     ; var_g = var_1 ; var_b = var_2 }
		
		
		return[var_r * 255, var_g * 255, var_b * 255, a*255]; //RGB results from 0 to 255

	}
}

///we're not using ?x=... style anymore, but we're supporting it for backwards compatibility

// from http://www.netlobo.com/url_query_string_javascript.html
function gup( name )
{
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return "";
  else
    return results[1];
}
