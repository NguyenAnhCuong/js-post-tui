import { setTextContent, truncatText } from "./common";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime' 
dayjs.extend(relativeTime)

export function createPostElement(post){
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
    setTextContent(liElement,'[data-id="timeSpan"]',` - ${dayjs(post.updatedAt).fromNow()}`)

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

export function renderPostList(elementId,postList){
    console.log({postList});
    if (!Array.isArray(postList) ) return;
    const ulElement = document.getElementById(elementId)
    if (!ulElement) return
    //clear current list
    ulElement.textContent = ''

    postList.forEach((post) =>{
        const liElement = createPostElement(post)
        ulElement.appendChild(liElement)
    })
}