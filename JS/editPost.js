import postApi from "./api/postApi";
import { initPostForm } from "./util";

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
            onSubmit:(formValues) =>console.log('submit',formValues),
        })
    } catch (error) {
        console.log('fail to fetch post details',error);
    }
})()