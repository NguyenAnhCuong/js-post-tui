import postApi from "./api/postApi";
import { initPostForm, toast } from "./util";

async function handlePostFormSubmit(formValues){
    console.log('submit from parent',formValues);
    try {
        //check add//edit mode
        //s1:based on search params(check id)
        //s2:check id in formvalues
        //call api
        // let savePost = null
        // if (formValues.id){
        //     savePost = await postApi.update(formValues)
        // }else{
        //     savePost = await postApi.add(formValues)
        // }
        const savePost = formValues.id? await postApi.update(formValues) : await postApi.add(formValues)
        //show success message
        toast.success('Save Post success fully')
        //redirect to detail page
        setTimeout(()=>{
            window.location.assign(`/postDetail.html?id=${savePost.id}`)
        },2000)
    } catch (error) {
        console.log('fail to save post',error);
        toast.error('Failed to Save Post',error)
    }
}

(async()=>{
    try {
        const searchParams = new URLSearchParams(window.location.search);
        const postID = searchParams.get('id')

        const defaultValues = Boolean(postID)? await postApi.getById(postID): {
            title : '',
            description:'',
            author : '',
            imageUrl:'',
        }
        console.log('id',postID);
        console.log('mode',postID? 'edit' : 'add');
        console.log('defaultValues',defaultValues);

        initPostForm({
            formId:'postForm',
            defaultValues,
            onSubmit: handlePostFormSubmit,
        })
    } catch (error) {
        console.log('fail to fetch post details',error);
    }
})()