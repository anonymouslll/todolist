var fs=require('fs')
var path=require('path')

exports.send=function(res,staticPath){ //根据staticPath传送
	fs.readFile(staticPath,'utf8',function(err,data){
		if(err){
			return res.end(err.message)
		}
		res.end(data)
	})
}

	