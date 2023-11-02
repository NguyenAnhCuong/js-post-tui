import postApi from "./api/postApi";
import { initPostForm, toast } from "./util";

function removeUnusedField(formValues){
    const payload = {...formValues}
    //imageSource = 'picsum'->remove image
    //imageSOurce = 'upload'->remove imageUrl
    if(payload.imageSource === 'upload'){
        delete payload.imageUrl
    }else{
        delete payload.image
    }
    //remove imageSource
    delete payload.imageSource
    if(!payload.id) delete payload.id

    return payload
}
function jsonToFormData(jsonObject){
    const formdata = new FormData()
    for (const key in jsonObject){
        formdata.set(key,jsonObject[key])
    }

    return formdata
}

async function handlePostFormSubmit(formValues){
    try {
        const payload = removeUnusedField(formValues)
        const formData = jsonToFormData(payload)
        console.log('submit from parent',{formValues,payload});
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
        const savePost = formValues.id? await postApi.updateFormdata(formData) : await postApi.addFormdata(formData)
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