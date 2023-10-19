export function setTextContent(parent,selector,text){
    if (!parent) return
    const element = parent.querySelector(selector)
    if (element) element.textContent = text;

}
export function truncatText(text,maxlength){
    if ( text.length <= maxlength) return text
    return `${text.slice(0,maxlength - 1)}…`
}

export function setFieldValue(form,selector,value){
    if (!form) return
    const field = form.querySelector(selector)
    if (field) field.textContent = value;

}

export function setBackgroundImage(parent,selector,imageUrl){
    if (!parent) return
    const element = parent.querySelector(selector)
    if (element) element.style.backgroundImage = `url(${imageUrl})`;

}