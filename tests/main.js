/*var dy = new Dynamic("#app");
dy.sourceDN({
    name: "aa",
    fetch(){
        return "Hello world";
    },
    frequency: 0
});
dy.sourceDN("aa").connectTo("ab");
dy.transDN({
    name: "ac",
    update(data){
        return data.aa + data.ad;
    }
}).connectTo("ab"); //链式调用*/
var dy = Dynamic.new("#app");
dy.data.name = "dynamic";
dy.data.op = function(){
    if(this.name === 1){
        return 2;
    }
    else if(this.name === "dynamic"){
        return "hahahahahahaha!";
    }
    else{
        return null;
    }
}
setInterval(()=>{
    if(dy._.name == "dynamic"){
        dy._.name = new Date().getTime();
    }
    else{
        dy._.name = "dynamic";
    }
},1000);