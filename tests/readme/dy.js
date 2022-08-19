const dy = Dynamic.new("#app");
const list = ["a","b","c"];
dy.data.items = function(){
    const result = [];
    for(let i = 0; i < list.length; i++){
        const el = document.createElement("li");
        el.textContent = list[i];
        result.push(el);
    }
    return result;
};
dy.data.inputs = "";
dy.data.count = 0;
dy.data.date = new Date().getDate();
dy.data.tomorrowDate = function(){
    if(this.date + 1 > 31) return 1;
    else return this.date + 1;
};
function processDate(data){
    if(data.date + 1 > 31) data.date = 1;
    else data.date += 1;
}
dy.addMethods({
    processDate(){
        if(this.date + 1 > 31) this.date = 1;
        else this.date += 1;
    }
});