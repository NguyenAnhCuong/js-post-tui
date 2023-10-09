import axiosClient from "./api/axiosClient";
import axios from "axios";
import postApi from "./api/postApi";
import { setTextContent, truncatText } from "./util";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime' 
dayjs.extend(relativeTime)

async function main(){
    // const response = await axiosClient.get('/posts')
    // console.log(response);
    // const queryParams ={
    //     _page:1,
    //     _limit:3,
    // }
    // const response = await postApi.getAll(queryParams)
    // console.log(response);
    // postApi.add({
    //     title:'',
    //     author:'',
        
    // })
    try {
        const queryParams ={
        _page:1,
        _limit:3,
        }
        const data = await postApi.getAll(queryParams)
        console.log(data);
    } catch (error) {
        console.log('get all failed:',error);
    }
    
}
function createPostElement(post){
    try {
        if (!post) return
    //find and clone template
    const postTemplate = document.getElementById('postTemplate')
    if (!postTemplate) return
    const liElement = postTemplate.content.firstElementChild.cloneNode(true)
    if (!liElement) return
    
    //update title,description,author,thumnail
    // const titleElement = liElement.querySelector('[data-id="title"]')
    // if (titleElement) titleElement.textContent = post.title;
    setTextContent(liElement,'[data-id="title"]',post.title)
    setTextContent(liElement,'[data-id="description"]',truncatText(post.description,100))
    setTextContent(liElement,'[data-id="author"]',post.author)

    // const descriptionElement = liElement.querySelector('[data-id="description"]')
    // if (descriptionElement) descriptionElement.textContent = post.description

    // const authorElement = liElement.querySelector('[data-id="author"]')
    // if (authorElement) authorElement.textContent = post.author
    // console.log('time',dayjs(post.updatedAy).fromNow());
    setTextContent(liElement,'[data-id="timeSpan"]',` - ${dayjs(post.updatedAy).fromNow()}`)

    const thumbnailElement = liElement.querySelector('[data-id="thumbnail"]')
    if (thumbnailElement) {
        thumbnailElement.src = post.imageUrl
        thumbnailElement.addEventListener('error',()=>{
            thumbnailElement.src = 'https://via.placeholder.com'
        })
    }
    
    //attach event

    return liElement;
    } catch (error) {
        console.log('failed to create post item',error);
    }

}

function renderPostList(postList){
    console.log({postList});
    if (!Array.isArray(postList) || postList.length === 0 ) return;
    const ulElement = document.getElementById('postList')
    if (!ulElement) return
    postList.forEach((post) =>{
        const liElement = createPostElement(post)
        ulElement.appendChild(liElement)
    })
}
function handleFilterChange(filterName,filterValue){
    
    const url = new URL(window.location)
    url.searchParams.set(filterName,filterValue)
    history.pushState({},'',url)

}

function handlePreClick(e){
    e.preventDefault()

}
function handleNextClick(e){
    e.preventDefault()

}

function InitPagination(){
    //bind click for pre - next link
    const ulPagination = document.getElementById('pagination')
    if (!ulPagination) return
    const preLink = ulPagination.firstElementChild?.firstElementChild
    if (preLink){
        preLink.addEventListener('click',handlePreClick)
    }

    const nextLink = ulPagination.lastElementChild?.lastElementChild
    if (nextLink){
        nextLink.addEventListener('click',handleNextClick)
    }

}
function initURL(){
    const url = new URL(window.location)

    //update search params if needed
    if (url.searchParams.get('_page')) url.searchParams.set('_page',1)
    if (url.searchParams.get('_limit')) url.searchParams.set('_limit',6)

    history.pushState({},'',url)

}

(async () =>{
    try {
        InitPagination()
        initURL();

        const queryParams = new URLSearchParams(window.location.search)
        //set default query params if not existed
        console.log(queryParams.toString());

        const {data,pagination} = await postApi.getAll(queryParams)
        renderPostList(data)
    } catch (error) {
        console.log('get all failed:',error);
    }
    
})()