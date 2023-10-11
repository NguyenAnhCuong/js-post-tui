import axiosClient from "./api/axiosClient";
import axios from "axios";
import postApi from "./api/postApi";
import { getPagination, setTextContent, truncatText } from "./util";
import dayjs from "dayjs";
import debounce from "lodash.debounce";
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
            thumbnailElement.src = ''
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
    if (!Array.isArray(postList) ) return;
    const ulElement = document.getElementById('postList')
    if (!ulElement) return
    //clear current list
    ulElement.textContent = ''

    postList.forEach((post) =>{
        const liElement = createPostElement(post)
        ulElement.appendChild(liElement)
    })
}
function renderPagination(pagination){
    const ulPagination = document.getElementById('pagination')
    //calc totalPages
    if (!pagination | !ulPagination) return
    const {_page,_limit,_totalRows} = pagination
    const totalPages = Math.ceil(_totalRows / _limit)
    //save page and totalPage to ulPagination
    ulPagination.dataset.page = _page
    ulPagination.dataset.totalPages = totalPages

    //check if enable/disable pre/next linkd
    if (_page <= 1) ulPagination.firstElementChild?.classList.add('disabled')
    else ulPagination.firstElementChild?.classList.remove('disabled')

    if (_page >= totalPages) ulPagination.lastElementChild?.classList.add('disabled')
    else ulPagination.lastElementChild?.classList.remove('disabled')
}
async function handleFilterChange(filterName,filterValue){
    
    try {
        const url = new URL(window.location)
        url.searchParams.set(filterName,filterValue)
        if (filterName === 'title_like') url.searchParams.set('_page',1)
        history.pushState({},'',url)

        //fetch API
        //re render post list
        const {data,pagination} = await postApi.getAll(url.searchParams)
        renderPostList(data)
        renderPagination(pagination)
    } catch (error) {
        console.log('fail to catch post list',error);
    }
}

function handlePreClick(e){
    e.preventDefault()
    console.log('pre click');
    const ulPagination = getPagination()
    if (!ulPagination) return
    const page = Number.parseInt(ulPagination.dataset.page) || 1
    if (page <= 1) return

    handleFilterChange('_page',page - 1)
}
function handleNextClick(e){
    e.preventDefault()
    console.log('next click');
    const ulPagination = getPagination()
    if (!ulPagination) return
    const page = Number.parseInt(ulPagination.dataset.page) || 1
    const totalPages = ulPagination.dataset.totalPages
    if (page >= totalPages) return

    handleFilterChange('_page',page + 1)
}

function InitPagination(){
    //bind click for pre - next link
    const ulPagination = getPagination()
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
function initSearch(){
    const searchInput = document.getElementById('searchInput')
    if (!searchInput) return
    const queryParams = new URLSearchParams(window.location.search)
    if (queryParams.get('title_like')){
        searchInput.value = queryParams.get('title_like')
    }
    const debounceSearch = debounce((event)=>handleFilterChange('title_like',event.target.value),1000)
    //set default values form query params
    searchInput.addEventListener('input',debounceSearch)
}

(async () =>{
    try {
        //attach event for link
        InitPagination()
        initSearch()
        //set default pagination (_page,_limit) on URL
        initURL();
        //render post list based URL params
        const queryParams = new URLSearchParams(window.location.search)
        //set default query params if not existed
        console.log(queryParams.toString());

        const {data,pagination} = await postApi.getAll(queryParams)
        renderPostList(data)
        renderPagination(pagination)
    } catch (error) {
        console.log('get all failed:',error);
    }
    
})()