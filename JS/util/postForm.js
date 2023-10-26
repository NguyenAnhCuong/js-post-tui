import { setBackgroundImage, setFieldValue, setTextContent } from "./common";
import * as yup from 'yup'
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
function getPostSchema(){
    return yup.object().shape({
        title:yup.string().required('pls enter title'),
        author:yup
            .string()
            .required('pls enter author')
            .test(
                'at least 2 words',
                'pls enter at least 2 words',
                (value) =>value.split(' ').filter(x => !!x && x.length >= 3).length >= 2),
        description:yup.string(),
    })
}
function setFieldError(form,name,error){
    const element = form.querySelector(`[name="${name}"]`)
    if (element){
        element.setCustomValidity(error)
        setTextContent(element.parentElement,'.invalid-feedback',error)
    }
}

async function validatePostForm(form,formValues){ 
    try {
        //reset previous error
        ['title','author'].forEach(name => setFieldError(form,name,''))

        //start validating
        const schema = getPostSchema()
        await schema.validate(formValues,{abortEarly:false})
    } catch (error) {
        console.log(error.name);
        console.log(error.inner);
        const errorLog = {}

        if (error.name === 'ValidationError' && Array.isArray(error.inner))
        for (const valiation of error.inner){
            const name = valiation.path

            //ignore if the field is already logged
            if (errorLog[name]) continue

            //set field error and mark as logged
            setFieldError(form,name,valiation.message)
            errorLog[name] = true
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