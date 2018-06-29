var http=require('http')
var config=require('./config')
var router=require('./router')

var server=http.createServer()
server.on('request',function(req,res){
	router(req,res)
})

server.listen(config.port,function(){
	console.log('server is listening at port'+config.port)
	console.log('please visit http://'+config.host+":"+config.port) 
})
