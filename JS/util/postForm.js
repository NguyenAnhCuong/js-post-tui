import { setBackgroundImage, setFieldValue, setTextContent } from "./common";

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
        if (!validatePostForm(form,formValues)) return
    })
}
function getTitleError(form){
    const titleElement = form.querySelector('[name="title"]')
    if (!titleElement) return
    //required
    //at least 2 words
    if (titleElement.validity.valueMissing) return 'please enter title'
    if(titleElement.value.split(' ').filter(x => !!x && x.length >= 3).length < 2){
        return 'pls enter at least 2 words'
    }
    return ''    
}


function validatePostForm(form,formValues){
    //get error
    const errors ={
        title:getTitleError(form),
    }
    //set error
    for (const key in errors){
        const element = form.querySelector(`[name="${key}"]`)
        if (element){
            element.setCustomValidity(errors[key])
            setTextContent(element.parentElement,'.invalid-feedback',errors[key])
        }
    }   
    //add was-validated class to form element
    const isValid = form.checkValidity()
    if(!isValid) form.classList.add('was-validated')
    return false
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