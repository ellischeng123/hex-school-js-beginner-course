let toTop = document.querySelector('.toTop')

let popList =  document.querySelector('.pop-list')

let dists = Array.from(new Set(records.map(record => record.Zone)))
let distSelect = document.querySelector('#district-select')

let attractionsByDist = groupAttractionsByDist()

let resultDistTitle = document.querySelector('.result-dist')
let resultDistList = document.querySelector('.list')


distSelect.addEventListener("change", renderAttractions)

function renderAttractions(e) {
    if (e) {
        e.preventDefault()
    }

    let specifiedDist = distSelect.options[distSelect.selectedIndex].value
    let specifiedDistAttractions = attractionsByDist[specifiedDist]

    let cards = ''
    for (let i = 0; i < specifiedDistAttractions.length; i++) {
        let att = specifiedDistAttractions[i]
        cards += `<li class="card">
        <div class="pic">
            <img src="${att.Picture1}" alt="景點照">
            <h4>${att.Name}</h4>
            <p>${specifiedDist}</p>
        </div>
        <div class="info">
            <div><img src="./assets/icons_clock.png" alt="clock icon"><span>${att.Opentime}</span></div>
            <div><img src="./assets/icons_pin.png" alt="location pin icon"><span>${att.Add}</span></div>
            <div><img src="./assets/icons_phone.png" alt="phone icon"><span>${att.Tel}</span></div>
            <div class="ticket-info"><img src="./assets/icons_tag.png" alt="ticket icon"><span>${att.Ticketinfo}</span></div>
        </div>
        </li>`
    }

    resultDistTitle.textContent = specifiedDist
    resultDistList.innerHTML = cards

}

// 依行政區整理景點資料
function groupAttractionsByDist() {
    let attractions = {}
    for (let i = 0; i < records.length; i++) {
        if (attractions[records[i].Zone] === undefined) {
            attractions[records[i].Zone] = [records[i]]
        } else {
            attractions[records[i].Zone].push(records[i])
        }
    }
    return attractions
}

// 捲動至頂部
function goToTop(e) {
    e.preventDefault()
    window.scrollTo({top: 0, left: 0, behavior: "smooth"})
}

toTop.addEventListener('click', goToTop)


// 顯示熱門行政區
function renderPopularDists() {
    let popDists = ''
    for (let i = 0; i < 4; i++) {
        popDists += `<li><a href="#" class="dist dist-${i + 1}" data-dist="${dists[i]}">${dists[i]}</a></li>`
    }
    popList.innerHTML = popDists

    popList.addEventListener('click', popDistShowAttractions)
}


// 熱門行政區按鈕事件
function popDistShowAttractions(e) {
    e.preventDefault()

    if (e.target.nodeName !== 'A') {
        return
    }

    let index = dists.findIndex(dist => dist == e.target.dataset.dist)
    distSelect.selectedIndex = index + 1

    renderAttractions()
}

renderPopularDists()


// 產生行政區選項自資料集
function createOptions() {
    let options = ''
    for (let i = 0; i < dists.length; i++) {
        options += `<option value="${dists[i]}">${dists[i]}</option>`
    }
    distSelect.innerHTML = options
    renderAttractions()
}

createOptions()