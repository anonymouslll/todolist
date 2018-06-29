function Storage() {   
    this.storage = window.localStorage;

    if(!this.storage.getItem('users')){          //每次载入页面，检查本地库获取能否获得到数据，获不到说明未加载过此应用，写入examples
        var now=new Date();
        var year=now.getFullYear()+""
        var month=now.getMonth()+1+"";
        var day=now.getDate()+"";
        var example={"catalogid":0,"id":0,"content":"","completed":false,"createtime":"1/1/2018, 00:00:00","endyear":year,"endmonth":month,"endday":day};
        var examples=[];
        for(var i=0;i<5;i++){
            example["id"]=i;
            example["catalogid"]=i>2 ? 1:0;
            example["content"]="hello!    这是第"+i+"个测试任务,你可以在这里记录自己的任务";
            examples.push(JSON.stringify(example))
        }
        examples=examples.join(',');
        examples +=',{"catalogid":0,"id":5,"content":"到期时间2018年9月9号","completed":false,"createtime":"1/1/2018, 00:00:00","endyear":"2018","endmonth":"9","endday":"9"}';
        examples +=',{"catalogid":1,"id":6,"content":"创建时间2017年8月7号","completed":false,"createtime":"8/7/2017, 00:00:00","endyear":"2018","endmonth":"12","endday":"31"}';
        examples ='['+examples+']';

        this.storage.setItem('users', '[{"name":"test","id":0,"password":"test"}]');
        this.storage.setItem('catalogs', '[{"name":"first list","id":0,"length":4,"userid":0},{"name":"second list","id":1,"length":3,"userid":0}]');
        this.storage.setItem('tasks', examples);
    }
}
Storage.prototype = { 
    fetchUser: function() { 
        return JSON.parse( this.storage.getItem('users'))
    },

    saveUser: function(users) { 
        this.storage.setItem('users', JSON.stringify(users));
    },

    fetchCatalog: function() {  //全部获取catalogs数组
        return JSON.parse( this.storage.getItem('catalogs'))
    },

    saveCatalog: function(catalogs) {  //改变catalogs数组
        this.storage.setItem('catalogs', JSON.stringify(catalogs));
    },

    fetchTask: function() {  //全部获取tasks数组
        return JSON.parse(this.storage.getItem('tasks'));
    },

    saveTask: function(tasks) {  //写入tasks数组
        this.storage.setItem('tasks', JSON.stringify(tasks));
    }
}

