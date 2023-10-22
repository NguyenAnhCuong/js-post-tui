import { setBackgroundImage, setFieldValue } from "./common";

export function initPostForm({formId,defaultValues,onSubmit}){
    const form = document.getElementById(formId)
    if(!form) return

    console.log('form',form);
    setFormValues(form,defaultValues)
    form.addEventListener('submit',(event)=>{
        event.preventDefault()
        //get form values
        const formValues = getFormValues(form)
        console.log(formValues);
        //valiation

    })
}

function getFormValues(form){
    const formvalues={}
    //s1
    // ['title','author','description','imgaeUrl'].forEach(name=>{
    //     const field = form.querySelector(`[name ="${name}"]`)
    //     if (field) values[name] = field.values
    // })
    //s2
    const data = new FormData(form)
    for(const [key,value] of data){
        formvalues[key] = value
    }

    return formvalues
}

function setFormValues(form,formValues){
    setFieldValue(form,'[name="title"]',formValues?.title)
    setFieldValue(form,'[name="description"]',formValues?.description)
    setFieldValue(form,'[name="author"]',formValues?.author)
    setFieldValue(form,'[name="imageUrl"]',formValues?.imageUrl) //hidden field
    setBackgroundImage(document,'#postHeroImage',formValues?.imageUrl)
}