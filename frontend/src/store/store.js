import { defineStore } from "pinia";
import { ref } from "vue";

export const usePruebasStores = defineStore("x-token", ()=>{
    let token = ref("")
    function setToken(tk){
        token.value = tk
        
    }

    return{
        token , setToken
    }
},{
 persist:true
})