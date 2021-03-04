import axios from 'axios';
const api = "https://jsonplaceholder.typicode.com"

export default axios.create({
  baseURL: api,
  responseType: "json"
});

// export default class Api {

//   public async getUsers (url: string) {
//   //   try {
//   //     const {data} = await apiAxio.get(url);
//   //   } catch (e) {
//   //     console.error('api (ERROR): ', e);
//   //   } finally {
//   //     return apiAxio.get(url);
//   //   }
//   // }
//     return apiAxio.get(url);
//   }
// }