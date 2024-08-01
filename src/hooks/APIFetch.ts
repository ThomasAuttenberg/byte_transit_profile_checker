import axios, {type AxiosError} from "axios";

const axiosInstance = axios.create();
axiosInstance.interceptors.response.use(
  (response) => response,
  (err: AxiosError) => Promise.reject(err));

export default function APIFetch(method?:string, endpoint?:string, body?:any){
  if(endpoint === undefined){
    endpoint = "";
  }else{
    if(import.meta.env.VITE_API_URL[-1] === '/' && endpoint[0] === '/'){
      endpoint = endpoint.slice(1);
    }else{
      if(import.meta.env.VITE_API_URL[-1] !== '/' && endpoint[0] !== '/'){
        endpoint = '/'+endpoint;
      }
    }
  }
  if(method == null || method === ''){
    method = 'GET';
  }

  return axiosInstance({
    headers: {
      // remove headers
    },
    method: method,
    url: import.meta.env.VITE_API_URL + endpoint,
    responseType: "json",
    data: body,
  })
}