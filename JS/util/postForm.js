import { randomNumber, setBackgroundImage, setFieldValue, setTextContent } from "./common";
import * as yup from 'yup'
import { toast } from "./toast";

const ImageSource = {
    PICSUM:'picsum',
    UPLOAD:'upload',
}

export function initPostForm({formId,defaultValues,onSubmit}){
    const form = document.getElementById(formId)
    if(!form) return
    let submitting = false

    setFormValues(form,defaultValues)

    randomImage(form)
    initRadioImageSource(form)
    initUploadImage(form)
    initValidationOnChange(form)

    form.addEventListener('submit',async (event)=>{
        event.preventDefault()
        if(submitting){
            return
        }
        //show loading/disabled button
        showLoading(form)
        submitting = true

        //get form values
        const formValues = getFormValues(form)
        formValues.id = defaultValues.id
        //valiation
        const isValid = await validatePostForm(form,formValues)
        if (isValid) await onSubmit?.(formValues)
        //alway hide loading
        hideLoading(form)
        submitting = false
    })
}
function initValidationOnChange(form){
    ['title','author'].forEach(name=>{
        const field = form.querySelector(`[name="${name}"]`)
        if (field){
            field.addEventListener('input',(event)=>{
                const newValue = event.target.value
                valiationFormField(form,{ [name]:newValue },name)
            })
        }
    })
}
function initUploadImage(form){
    const uploadImage = form.querySelector('[name="image"]')
    if(!uploadImage) return
    uploadImage.addEventListener('change',(event)=>{
        console.log(event.target.files[0]);
        //get selected file
        //preview file
        const file = event.target.files[0]
        if(file){
            const imageUrl = URL.createObjectURL(file)
            setBackgroundImage(document,'#postHeroImage',imageUrl)
            //trigger validation of upload input
            valiationFormField(form,{imageSource:ImageSource.UPLOAD,image:file,},'image')
        }
    })
}
function initRadioImageSource(form){
    const radioList = form.querySelectorAll('[name="imageSource"]')
    radioList.forEach((radio)=>{
        radio.addEventListener('change',(event)=>renderImageSourceControl(form,event.target.value))
    })
}
function renderImageSourceControl(form,selectedValue){
    const controlList = form.querySelectorAll('[data-id="imageSource"]')
    controlList.forEach((control)=>{
        control.hidden = control.dataset.imageSource !== selectedValue
    })
}
function showLoading(form){
    const button = form.querySelector('[name="submit"]')
    if (button){
        button.disabled = true
        button.textContent = 'Saving...'
    }
}
function hideLoading(form){
    const button = form.querySelector('[name="submit"]')
    if (button){
        button.disabled = false
        button.textContent = 'Save'
    }
}
function randomImage(form){
    const randombutton = document.getElementById('postChangeImage')
    if (!randombutton) return
    randombutton.addEventListener('click',()=>{
        //random ID
        //build URL
        const imageUrl = `https://picsum.photos/id/${randomNumber(1000)}/1368/400`

        //set imageURL input + background
        setFieldValue(form,'[name="imageUrl"]',imageUrl) //hidden field
        setBackgroundImage(document,'#postHeroImage',imageUrl)
        toast.success('Change Img success')
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
        imageSource:yup
            .string()
            .required('pls select an image source')
            .oneOf([ImageSource.PICSUM,ImageSource.UPLOAD],'Invalid image source'),
        imageUrl:yup
            .string()
            .when('imageSource',{
                is:ImageSource.PICSUM,
                then:yup
                    .string()
                    .required('Pls random a background image')
                    .url('pls enter a valid URL'),
        }),
        image:yup.mixed().when('imageSource',{
            is:ImageSource.UPLOAD,
            then:yup
                .mixed()
                .test('required','pls select an image to upload',(file)=> Boolean(file?.name))
                .test('max-3MB','pls select an image lower than 3MB',(file)=> {
                    const fileSize = file?.size || 0
                    const MAX_SIZE = 3 *1024*1024 // 3MB
                    return fileSize <= MAX_SIZE
                }),
            }),
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
        ['title','author','imageUrl','image'].forEach((name) => setFieldError(form,name,''))

        //start validating
        const schema = getPostSchema()
        await schema.validate(formValues,{abortEarly:false})
    } catch (error) {
        const errorLog = {}

        if (error.name === 'ValidationError' && Array.isArray(error.inner))
        for (const validationError of error.inner){
            const name = validationError.path

            //ignore if the field is already logged
            if (errorLog[name]) continue

            //set field error and mark as logged
            setFieldError(form,name,validationError.message)
            errorLog[name] = true
        }
    }
    //add was-validated class to form element
    const isValid = form.checkValidity()
    if(!isValid) form.classList.add('was-validated')
    return isValid
}
async function valiationFormField(form,formvalues,name){
    try {
        setFieldError(form,name,'')
        const schema = getPostSchema()
        await schema.validateAt(name,formvalues)
    } catch (error) {
        setFieldError(form,name,error.message)
    }
    //show validation erroe
    const field = form.querySelector(`[name="${name}"]`)
    if (field && !field.checkValidity()){
        field.parentElement.classList.add('was-validated')
    }
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
    setFieldValue(form,'[name="author"]',formValues?.author)
    setFieldValue(form,'[name="description"]',formValues?.description)
    setFieldValue(form,'[name="imageUrl"]',formValues?.imageUrl) //hidden field
    setBackgroundImage(document,'#postHeroImage',formValues?.imageUrl)
}