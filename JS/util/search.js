import debounce from "lodash.debounce"
//pure function - dump funtion
export function initSearch({elementId,defaultParams,onChange}){
    const searchInput = document.getElementById(elementId)
    if (!searchInput) return
    if (defaultParams && defaultParams.get('title_like')){
        searchInput.value = defaultParams.get('title_like')
    }
    const debounceSearch = debounce((event)=>onChange?.(event.target.value),1000)
    //set default values form query params
    searchInput.addEventListener('input',debounceSearch)
}