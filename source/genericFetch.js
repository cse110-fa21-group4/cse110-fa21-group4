export class genericFetch_c {
    data={};
    constructor(input){
        this.options = input;
    }

    static async genericFetch_f(input) {
        await axios.request(input.options).then(function(response){
            input.data= response.data;
        }).catch(function(error){
            console.log(error);
        })
    }
}