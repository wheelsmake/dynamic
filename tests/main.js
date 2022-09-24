var dy = Dynamic("#app");
dy.name = "dynamic";
dy.op = function(){
    this.few = '"``"';
    delete this;
    if(this.name === 1){
        return `fe
        `;
    }
    else if(this.name === "dynamic"){
        return "hahahah`''ahahaha''!";
    }
    else{
        return null;
    }
}
dy.yt = "title";
dy.styles = "background: beige;";
var n = {};
n.a = n;
dy.object = {
    a: 0,
    b: "123",
    c: undefined,
    c1: "undefined",
    d: Math,
    d1: "[object Math]",
    e: Symbol(12345),
    e1: "Symbol(fake)",
    f: function(){},
    f1: "function(){}",
    g: ()=>{},
    h: null,
    i: NaN,
    i1: "NaN",
    j: 100000000000000n,
    j1: "100000000000000n",
    k: -Infinity,
    k1: "-Infinity",
    l: {},
    m: {
        a: 1,
        b: Math,
        f: "function(){}"
    },
    n,
    o: Object.create(Math),
    p: Object.create(Math, {
        s: {
            value: 1,
            enumerable: true
        }
    })
};
var o1 = {}, o2 = {};
o1.a = o2;
o2.a = o1;
dy.object2 = o2;
dy.count = 0;
dy.dnValue = "";
dy.deValue = "default value";
setInterval(()=>{
    if(dy.name == "dynamic"){
        dy.name = "timeNow_-name-_" + new Date().getTime();
    }
    else{
        dy.name = "dynamic";
    }
},1000);
updateTime();
setInterval(()=>{
    updateTime();
}, 1000);
function updateTime(){
    const date = new Date();
    var se = "", second = date.getSeconds().toString();
    if(second.length == 0) se = "00";
    else if(second.length == 1) se = `0${second}`;
    else se = second;
    dy.time = `${date.getHours()}:${date.getMinutes()}:${se}`;
}
//Dynamic.disableDevTool();
dy.pressure = "";
function pressure(){
    for(let i = 0; i < 1000; i++){
        dy.pressure += i;
    }
}
pressure();
dy.aaaa = function(){
    return new Date().getSeconds();
}