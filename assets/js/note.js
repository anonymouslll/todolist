var storage = new Storage();
var vm = new Vue({
    el: 'body',
    data: {
    //需要的数据
        tasks: storage.fetchTask(),
        catalogs: storage.fetchCatalog(),
        users: storage.fetchUser(),
        
    //标识选中:
        showdatas:[],
        nowcatalog:{},
        nowtask:{},
        nowuser:{},
    //绑定数据，获取数据
        newcatalog: '',
        endyear: '',
        endmonth:'',
        endday:'',
        content:'',
        searchstring:'',
        username:'test',
        userpwd:'test',
        showstyle:{
                'card': true,
                'mb-4': true,
                'boxshadow': true,
        },
    //隐藏，样式标志
        passwderr: false,
        editable: false,      
        online: false,
        addcatalogmask: false,
        showcompleted: true,   //显示要求
        showmodels:JSON.parse('{"default": true,"info": false,"secondary": false}'),
        orders:JSON.parse('{"createtime": false,"endtime": false,"name": true}'),
        models:JSON.parse('{"catalogmode": false,"allmode": false,"searchmode": false,"todaymode": true}'),//显示的模块
        
    },
    methods: {
        getdatas:function(){ //得到该模块且排好序的showdatas,已完成的根据showcompleted在前台过滤
            this.showdatas=this.selectdatas();
            if(this.orders["createtime"]){
                this.showdatas.sort(function(a,b){
                    return Date.parse(a.createtime) - Date.parse(b.createtime);
                })
            }
            else if(this.orders["endtime"]){
                this.showdatas.sort(function(a,b){
                    var atime=a.endmonth+'/'+a.endday+'/'+a.endyear;
                    var btime=b.endmonth+'/'+b.endday+'/'+b.endyear;
                    return Date.parse(atime) - Date.parse(btime);
                })
            }
            else if(this.orders["name"]){
                this.showdatas.sort(function(a,b){
                    if(a.content>b.content) return 1;
                    else if (a.content<b.content) return -1;
                    else return 0;
                })
            }
        },
        selectdatas: function(){
            if(this.models['catalogmode']){
                var datas=[];
                for(i in this.tasks){
                    var id = this.nowcatalog.id;
                    if(id===this.tasks[i].catalogid){
                        datas.push(this.tasks[i]);
                    }
                }
                return datas;
            }
            var alldatas=[];
            var userid=this.nowuser.id;                                               //先求得此用户的数据          
            for(j in this.catalogs){
                if(userid===this.catalogs[j].userid){
                    for(i in this.tasks){
                        var id = this.catalogs[j].id;
                        if(id===this.tasks[i].catalogid){
                            alldatas.push(this.tasks[i]);
                        }
                    }
                }
            }
            if(this.models['allmode']){
                return alldatas;
            }
            else if(this.models['searchmode']){
                var datas=[];
                for(i in alldatas){
                    if(alldatas[i].content.includes(this.searchstring)){
                        datas.push(alldatas[i]);
                    }
                }
                return datas;
            }
            else if(this.models['todaymode']){
                var now=new Date();
                var year=now.getFullYear()+"";
                var month=now.getMonth()+1+"";
                var day=now.getDate()+"";
                var datas=[];
                for(i in alldatas){
                    data=alldatas[i];
                    if(data.endday===day && data.endmonth===month && data.endyear===year){
                        datas.push(data);
                    }
                }
                return datas;
            }
        },

        login:function(){
            for(var i in this.users){
                if(this.users[i].name===this.username){
                    if(this.users[i].password===this.userpwd){
                        this.nowuser=this.users[i];
                        this.online=true;
                        this.getdatas();
                    }
                    else{
                        this.passwderr=true;
                    }
                    return;
                }
            }
            var user={};
            user.id=this.users.length;
            user.name=this.username;
            user.password=this.userpwd;
            this.users.push(user);
            this.nowuser=user;
            this.online=true;
        },
        logout:function(){
            this.showdatas=[];
            this.nowcatalog={};
            this.nowtask={};
            this.nowuser={};
            this.newcatalog= '';
            this.endyear= '';
            this.endmonth='';
            this.endday='';
            this.content='';
            this.searchstring='';
            this.username='test';
            this.userpwd='test';
            this.passwderr= false;
            this.editable= false;      
            this.online= false;
            this.addcatalogmask= false;
            this.showcompleted= true;   //显示要求
            this.showmodels=JSON.parse('{"default": true,"info": false,"secondary": false}'),
            this.orders=JSON.parse('{"createtime": false;"endtime": false;"name": true}');
            this.models=JSON.parse('{"catalogmode": false;"allmode": false;"searchmode": false;"todaymode": true}');//显示的模块
        },
       
        turnonmode: function(model){
          for(key in this.models){
             this.models[key]=false;
          }
          this.models[model]=true;
        },
        turnonorder: function(order){
            for(key in this.orders){
               this.orders[key]=false;
            }
            this.orders[order]=true;
        },
        turnonshowmodel: function(model){
            for(key in this.showmodels){
               this.showmodels[key]=false;
            }
            this.showmodels[model]=true;
        },
        getshowstyle:function(){
            this.showstyle={
                'card': true,
                'mb-4': true,
                'boxshadow': true,
                'bg-dark': this.showmodels['secondary'],
                'text-danger': this.showmodels['secondary'],
                'bg-info': this.showmodels['info'],
                'text-warning':this.showmodels['info']
            }
        },

        addCatalog: function() {          //增加catalog     动态绑定newcatalog，再调用
            var catalogname = this.newcatalog;  
            if (catalogname) {
                var len = this.catalogs.length;
                var nowcatalog = {
                    'id': len,
                    'name': catalogname,
                    'length': 0,
                    'userid': this.nowuser.id,
                };
                this.catalogs.push(nowcatalog);
                this.newcatalog = '';
                this.addcatalogmask=false;
            }
        },
        removeCatalog: function() {      //删除选中的catalog  
         
            for(var i=0;i<this.tasks.length;i++){
                if(this.tasks[i].catalogid === this.nowcatalog.id){
                    this.tasks.splice(i,1);
                    i--;
                }
            }
            this.catalogs.$remove(this.nowcatalog);
            this.nowcatalog={};
        },
        removeTask: function() {         //删除task
            this.tasks.$remove(this.nowtask);
            if(JSON.stringify(this.nowcatalog)==='{}'){
                var id = this.nowtask.catalogid;
                var i=0;
                for(i in this.catalogs){
                    if(this.catalogs[i].id===id){
                        this.catalogs[i].length--;
                        break;
                    }
                }
            }
            else this.nowcatalog.length--;
            this.nowtask={};
        },
        addTask: function() {            //添加task
            this.editable = true;
            this.content="";
            this.nowtask={};
            this.endmonth='';
            this.endday='';
            this.endyear='';
        },
        editTask: function(){               //  编辑task
            this.editable = true;
            this.content = this.nowtask.content;
            this.endmonth=this.nowtask.endmonth;
            this.endyear=this.nowtask.endyear;
            this.endday=this.nowtask.endday;
        },
        saveTask: function() {              //保存task
            if(JSON.stringify(this.nowtask)==="{}"){
                var nowtask={};
                nowtask.catalogid=this.nowcatalog.id;
                nowtask.id=this.tasks.length;
                nowtask.content=this.content;
                nowtask.completed=false;
                nowtask.createtime=new Date().toLocaleString('en-GB',{hour12:false});
                nowtask.endmonth=this.endmonth;
                nowtask.endyear=this.endyear;
                nowtask.endday=this.endday;
                this.tasks.push(nowtask);
                this.nowcatalog.length++;
                this.nowtask=nowtask;
            }
            else{
                this.nowtask.content=this.content;
                this.nowtask.endmonth=this.endmonth;
                this.nowtask.endyear=this.endyear;
                this.nowtask.endday=this.endday;
            }
            this.editable = false;
        }
    },
    watch:{
        tasks: {
            handler: function(){
                storage.saveTask(this.tasks);
            },
            deep: true      //深度监听 
        },
        catalogs:{
            handler: function(){
            storage.saveCatalog(this.catalogs);
            },
            deep: true
        },
        users:{
            handler: function(){
            storage.saveUser(this.users);
            },
            deep: true
        }
    }
});




