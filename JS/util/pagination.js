export function renderPagination(elementId,pagination){
    const ulPagination = document.getElementById(elementId)
    //calc totalPages
    if (!pagination || !ulPagination) return
    const {_page,_limit,_totalRows} = pagination
    const totalPages = Math.ceil(_totalRows / _limit)
    //save page and totalPage to ulPagination
    ulPagination.dataset.page = _page
    ulPagination.dataset.totalPages = totalPages

    //check if enable/disable pre/next linkd
    if (_page <= 1) ulPagination.firstElementChild?.classList.add('disabled')
    else ulPagination.firstElementChild?.classList.remove('disabled')

    if (_page >= totalPages) ulPagination.lastElementChild?.classList.add('disabled')
    else ulPagination.lastElementChild?.classList.remove('disabled')
}

export function InitPagination({elementId,defaultParams,onChange}){
    //bind click for pre - next link
    const ulPagination = document.getElementById(elementId)
    if (!ulPagination) return
    const preLink = ulPagination.firstElementChild?.firstElementChild
    if (preLink){
        preLink.addEventListener('click',(e)=>{
            e.preventDefault()
            console.log('pre click');
            const page = Number.parseInt(ulPagination.dataset.page) || 1
            if (page > 2) onChange?.(page - 1)
        })
    }

    const nextLink = ulPagination.lastElementChild?.lastElementChild
    if (nextLink){
        nextLink.addEventListener('click',(e)=>{
            e.preventDefault()
            console.log('next click');
            const page = Number.parseInt(ulPagination.dataset.page) || 1
            const totalPages = ulPagination.dataset.totalPages
            if (page < totalPages) onChange?.(page + 1)
        })
    }

}