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
/*setInterval(()=>{
    if(dy._.name == "dynamic"){
        dy._.name = "timeNow:_Iamuseless_:" + new Date().getTime();
    }
    else{
        dy._.name = "dynamic";
    }
},1000);
updateTime();
setInterval(()=>{
    updateTime();
}, 1000);*/
function updateTime(){
    const date = new Date();
    var se = "", second = date.getSeconds().toString();
    if(second.length == 0) se = "00";
    else if(second.length == 1) se = `0${second}`;
    else se = second;
    dy.data.time = `${date.getHours()}:${date.getMinutes()}:${se}`;
}
dy.data.count = 0;
//Dynamic.disableDevTool();