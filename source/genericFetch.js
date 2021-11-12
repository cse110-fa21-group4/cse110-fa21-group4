export class genericFetchClass {
    constructor(input) {
        this.options = input;
        this.data = {};
    }

    static async genericFetchFunc(input) {
        await axios.request(input.options).then(function (response) {
            input.data = response.data;
        }).catch(function (error) {
            console.log(error);
        })
    }
}