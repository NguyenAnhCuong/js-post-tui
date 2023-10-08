import axiosClient from "./axiosClient"
// import:default import,name import
// export:default export,name export

export function getAllcity(params){
    const url = '/cities'
    return axiosClient.get(url,{params})
}
export function getCityById(id){
    const url = `/cities/${id}`
    return axiosClient.get(url)
}

// const citytApi = {
//     getAll(params){
//         //params:_page,_limit
//         const url = '/cities'
//         return axiosClient.get(url,{params})
//     },
//     getById(id){
//         const url = `/cities/${id}`
//         return axiosClient.get(url)
//     },
//     add(data){
//         const url = '/cities'
//         return axiosClient.post(url,data)
//     },
//     update(data){
//         const url = `/cities/${data.id}`
//         return axiosClient.patch(url,data)
//     },
//     remove(id){
//         const url = `/cities/${id}`
//         return axiosClient.delete(url)
//     },
// }
// export default studentApi
export{
    getAllcity,
    getCityById,
}