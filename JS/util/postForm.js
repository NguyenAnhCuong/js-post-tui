import { setBackgroundImage, setFieldValue } from "./common";

export function initPostForm({formId,defaultValues,onSubmit}){
    const form = document.getElementById(formId)
    if(!form) return

    console.log('form',form);
    setFormValues(defaultValues)
}

function setFormValues(form,formValues){
    setFieldValue(form,'[name="title"]',formValues?.title)
    setFieldValue(form,'[name="description"]',formValues?.description)
    setFieldValue(form,'[name="author"]',formValues?.author)
    setFieldValue(form,'[name="imageUrl"]',formValues?.imageUrl) //hidden field
    setBackgroundImage(document,'#postHeroImage',formValues?.imageUrl)
}