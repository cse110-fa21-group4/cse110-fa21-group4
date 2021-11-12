export class genericFetch_c {
   constructor(input) {
      this.options = input;
      this.data = {};
   }

   static async genericFetch_f(input) {
      await axios.request(input.options).then(function (response) {
         input.data = response.data;
      }).catch(function (error) {
         console.log(error);
      })
   }
}