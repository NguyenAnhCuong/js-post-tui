import axiosClient from "./api/axiosClient";
import axios from "axios";
import postApi from "./api/postApi";
async function main(){
    // const response = await axiosClient.get('/posts')
    // console.log(response);
    const queryParams ={
        _page:1,
        _limit:3,
    }
    const response = await postApi.getAll(queryParams)
    console.log(response);
    postApi.add({
        title:'',
        author:'',
        
    })
}
main()