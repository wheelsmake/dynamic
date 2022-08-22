Vue.createApp({
    data(){
        return{
            className: "red",
            list: ["a","b","c"],
            inputs: "",
            count: 0,
            date: new Date().getDate()
        }
    },
    methods: {
        processDate(){
            if(this.date + 1 > 31) this.date = 1;
            else this.date += 1;
        }
    }
}).mount("#app");