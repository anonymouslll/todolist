var notecontrollers=require('./controllers/notecontroller.js')
var url=require('url')

module.exports=function(req,res){
	var urlObj=url.parse(req.url,true); //获取pathname,query,   method
	// var query=urlObj.query;			     //query->req.query   
	var pathname=urlObj.pathname;
	var method=req.method;
	console.log("请求pathname:"+pathname);
	
	if(method==='GET' && (pathname==='/' || pathname==='index.html')){
		notecontrollers.send(res,__dirname+'/views/index.html');
	}else if(method==='GET' && pathname==='/favicon.ico'){
		res.end()	
	}else if(method==='GET'){
		notecontrollers.send(res,__dirname+pathname);
	}
}
