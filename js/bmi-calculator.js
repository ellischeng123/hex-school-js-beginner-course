let form = document.querySelector("#myform")
let heightElement = document.querySelector("#height")
let weightElement = document.querySelector("#weight")
let button = document.querySelector(".submit")
let clearButton = document.querySelector(".clear")
let deleteButton = document.querySelector(".delete")
let title = document.querySelector(".title")
let results = document.querySelector(".results")



function init () {
    let records = JSON.parse(localStorage.getItem("records")) || []
    for (let i = 0; i < records.length; i++) {
        showResult(
            records[i].weight,
            records[i].height,
            records[i].bmi,
            records[i].dateString,
            i
        )
    }
}

function calculateBMI(e) {
    e.preventDefault()

    let height = parseFloat(heightElement.value)
    let heightInMeter = height / 100
    let weight = parseFloat(weightElement.value)
    let records = JSON.parse(localStorage.getItem("records")) || []


    if (isNaN(height) || isNaN(weight)) {
        alert("身高或體重需要輸入數字")
        return
    }

    if (height === 0 || weight ===0) {
        alert("身高或體重不可為 0")
        return
    }

    let bmi = (weight / Math.pow(heightInMeter, 2)).toFixed(2)
    let date = new Date()
    let dateString = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`

    let bmiRating = showResult(weight, height, bmi, dateString, records.length)
    saveResult(weight, height, bmi, dateString)
    
    changeButton(bmi, bmiRating)
}

function changeButton(bmi, bmiRating) {
    let titleClass = `${bmiRating[0]}-title`
    title.textContent = bmiRating[1]
    title.classList.add(titleClass, 'show')
    button.innerHTML = `<h4>${bmi}</h4><p>BMI</p>`
    button.classList.add("submit-result", titleClass, `${bmiRating[0]}-button`)
    button.addEventListener("click", resetButton)
    button.removeEventListener("click", calculateBMI)
}

function resetButton(e) {
    if (e) {
        e.preventDefault()
    }
    button.innerHTML = "看結果"
    button.className = "submit"
    title.textContent = ""
    form.reset()
    button.removeEventListener("click", resetButton)
    button.addEventListener("click", calculateBMI)
}


function showResult(weight, height, bmi, dateString, index) {
    let result = document.createElement("div")
    let bmiRating = rateBMI(bmi)

    result.classList.add("result")
    result.dataset.index = index.toString()
    result.innerHTML = `<div class="summary ${bmiRating[0]}"></div>
    <h3>${bmiRating[1]}</h3>
    <div class="status">
        <div class="item">
            <h4>BMI</h4>
            <p>${bmi}</p>
        </div>
        <div class="item">
            <h4>weight</h4>
            <p>${weight}kg</p>
        </div>
        <div class="item">
            <h4>height</h4>
            <p>${height}cm</p>
        </div>
    </div>
    <p class="date">${dateString}</p>
    <i class="fa-solid fa-delete-left delete"></i>`
    results.appendChild(result)
    return bmiRating
}

function saveResult(weight, height, bmi, dateString) {
    let records = JSON.parse(localStorage.getItem("records")) || []
    records.push({
        "weight": weight,
        "height": height,
        "bmi": bmi,
        "dateString": dateString
    })
    localStorage.setItem("records", JSON.stringify(records))
}


function rateBMI(bmi) {
    if (bmi < 18.5) {
        return ["underweight", "過輕"]
    } else if (bmi < 25) {
        return ["ideal", "理想"]
    } else if (bmi < 30) {
        return ["overweight", "過重"]
    } else if (bmi < 35) {
        return ["obese-c1", "輕度肥胖"]
    } else if (bmi < 40) {
        return ["obese-c2", "中度肥胖"]
    } else {
        return ["obese-c3", "重度肥胖"]
    }
}

function clearHistory(e) {
    e.preventDefault()
    localStorage.removeItem("records")
    results.innerHTML = ""
    resetButton()
}

function deleteRecord(e) {
    e.preventDefault()
    if (e.target.nodeName !== "I") {
        return
    }
    
    let record = e.target.parentElement

    record.remove()

    let records = JSON.parse(localStorage.getItem("records"))
    records.splice(record.dataset.index, 1)
    localStorage.setItem("records", JSON.stringify(records))
    resetButton()
}

button.addEventListener("click", calculateBMI)
clearButton.addEventListener("click", clearHistory)
results.addEventListener("click", deleteRecord)
init()