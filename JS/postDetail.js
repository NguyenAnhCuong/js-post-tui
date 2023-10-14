import dayjs from "dayjs";
import postApi from "./api/postApi";
import { registerLightbox, setTextContent } from "./util";

function rederPostDetail(post){
    if (!post) return

    //render title
    setTextContent(document,'#postDetailTitle',post.title)
    //render description
    setTextContent(document,'#postDetailDescription',post.description)
    //render author
    setTextContent(document,'#postDetailAuthor',post.author)
    //render updatedAt
    setTextContent(document,'#postDetailTimeSpan',dayjs(post.updatedAt).format('DD/MM/YYYY HH:mm'))
    //render heroimage
    const heroimage = document.getElementById('postHeroImage')
    if (heroimage) {
        heroimage.style.backgroundImage = `url("${post.imageUrl}")`
        heroimage.addEventListener('error',()=>{
            thumbnailElement.src = ''
        })
    }
    //render edit page link
    const editPageLink = document.getElementById('goToEditPageLink')
    if (editPageLink){
        editPageLink.href = `/editPost.html?id=${post.id}`
        // editPageLink.textContent = 'Edit Post'
        editPageLink.innerHTML = '<i class="fas fa-edit"></i>EditPost '

    }
}

(async () =>{
    try {
        registerLightbox({
            modalId : 'lightbox',
            imageSelector:'img[data-id="lightboxImg"]',
            prevSelector:'button[data-id="lightboxPrev"]',
            nextSelector:'button[data-id="lightboxNext"]',
        })
        //get post id form URL
        //fetch post detail API
        //render post detail
        const searchParams = new URLSearchParams(window.location.search)
        const postId = searchParams.get('id')
        if (!postId){
            console.log('Post not found');
            return
        }
        const post = await postApi.getById(postId)
        rederPostDetail(post)
    } catch (error) {
        console.log('fail to fetch post detail',error);
    }

})()