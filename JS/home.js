import postApi from "./api/postApi";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime' 
dayjs.extend(relativeTime)
import { InitPagination,initSearch,renderPostList,renderPagination} from "./util";

async function handleFilterChange(filterName,filterValue){
    
    try {
        const url = new URL(window.location)
        url.searchParams.set(filterName,filterValue)
        if (filterName === 'title_like') url.searchParams.set('_page',1)
        history.pushState({},'',url)

        //fetch API
        //re render post list
        const {data,pagination} = await postApi.getAll(url.searchParams)
        renderPostList('postList',data)
        renderPagination('pagination',pagination)
    } catch (error) {
        console.log('fail to catch post list',error);
    }
}

(async () =>{
    try {
        const url = new URL(window.location)

        //update search params if needed
        if (url.searchParams.get('_page')) url.searchParams.set('_page',1)
        if (url.searchParams.get('_limit')) url.searchParams.set('_limit',6)

        history.pushState({},'',url)
        const queryParams = url.searchParams;
        //attach event for link
        InitPagination({
            elementId:'pagination',
            defaultParams:queryParams,
            onChange:(page) =>handleFilterChange('_page',page)
        })
        initSearch({
            elementId:'searchInput',
            defaultParams:queryParams,
            onChange:(value) =>handleFilterChange('title_like',value)
        })
        //set default pagination (_page,_limit) on URL
        // const queryParams = initURL();
        //render post list based URL params
        // const queryParams = new URLSearchParams(window.location.search)
        //set default query params if not existed
        console.log(queryParams.toString());

        const {data,pagination} = await postApi.getAll(queryParams)
        renderPostList('postList',data)
        renderPagination('pagination',pagination)
    } catch (error) {
        console.log('get all failed:',error);
    }
    
})()