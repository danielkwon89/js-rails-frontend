// Quiz-A-Boo

const easyQuiz = "https://opentdb.com/api.php?amount=10&category=31&difficulty=easy"
const mediumQuiz = "https://opentdb.com/api.php?amount=10&category=31&difficulty=medium"
const hardQuiz = "https://opentdb.com/api.php?amount=10&category=31&difficulty=hard"

const playersEndpoint = "http://localhost:3000/api/v1/players"
const scoresEndpoint = "http://localhost:3000/api/v1/scores"

document.addEventListener('DOMContentLoaded', () => {

    renderLoginForm()
})

function quizABooHeader(){

    let img = document.createElement("img")
    img.src = "img/quiz-a-boo.png"
    img.id = "img-header"
    document.body.appendChild(img)

    // set background color to #fffcf2 (same as header background)
}

function renderDifficultyHeader(){

    let quizDifficulty = sessionStorage.quizDifficulty
    
    if (quizDifficulty === "easy"){

        let img = document.createElement("img")
        img.src = "img/easy-quiz.png"
        img.id = "img-header"
        document.body.appendChild(img)

    } else if (quizDifficulty === "medium"){

        let img = document.createElement("img")
        img.src = "img/medium-quiz.png"
        img.id = "img-header"
        document.body.appendChild(img)

    } else if (quizDifficulty === "hard"){

        let img = document.createElement("img")
        img.src = "img/difficult-quiz.png"
        img.id = "img-header"
        document.body.appendChild(img)
    }
}

function renderDifficultyButtons(){

    let div = createCustomElement("div", "div-difficulty-buttons")
    div.setAttribute("class", "text-center")

    let easyButton = createCustomElement("button", "button-easy", "Easy Quiz")
    easyButton.setAttribute("class", "btn btn-success btn-lg")

    let mediumButton = createCustomElement("button", "button-medium", "Medium Quiz")
    mediumButton.setAttribute("class", "btn btn-primary btn-lg")

    let hardButton = createCustomElement("button", "button-hard", "Hard Quiz")
    hardButton.setAttribute("class", "btn btn-danger btn-lg")

    div.appendChild(easyButton)
    div.appendChild(document.createTextNode(" "))
    div.appendChild(mediumButton)
    div.appendChild(document.createTextNode(" "))
    div.appendChild(hardButton)

    document.body.appendChild(div)

    easyButton.addEventListener('click', () => {
        sessionStorage.setItem("quizDifficulty", "easy")
        fetch(easyQuiz)
        .then(res => res.json())
        .then(quiz => renderQuiz(quiz))
    })

    mediumButton.addEventListener('click', () => {
        sessionStorage.setItem("quizDifficulty", "medium")
        fetch(mediumQuiz)
        .then(res => res.json())
        .then(quiz => renderQuiz(quiz))
    })

    hardButton.addEventListener('click', () => {
        sessionStorage.setItem("quizDifficulty", "hard")
        fetch(hardQuiz)
        .then(res => res.json())
        .then(quiz => renderQuiz(quiz))
    })
}

function renderLoginForm(){

    quizABooHeader()

    let div = createCustomElement("div", "div-login")
    div.setAttribute("class", "form-group text-center")

    let form = createCustomElement("form", "form-login")
    form.setAttribute("class", "text-center")

    let h4 = createCustomElement("h4", "h4-login", "Login to Take Quiz!")

    let divRow = createCustomElement("div")
    divRow.setAttribute("class", "row justify-content-center")

    let divCol = createCustomElement("div")
    divCol.setAttribute("class", "col-md-4 text-center")

    let input = createCustomElement("input", "inputlg")
    input.setAttribute("class", "form-control")
    input.setAttribute("placeholder", "username")

    let submit = createCustomElement("button", "submit-login", "Submit")
    submit.setAttribute("type", "submit button")
    submit.setAttribute("class", "btn btn-login btn-md")

    document.body.appendChild(div)
    div.appendChild(form)
    form.appendChild(h4)
    // form.appendChild(document.createElement("br"))
    form.appendChild(divRow)
    divRow.appendChild(divCol)
    divCol.appendChild(input)
    // form.appendChild(document.createElement("br"))
    form.appendChild(submit)

    let formSubmitButton = document.getElementById("submit-login")
    formSubmitButton.addEventListener('click', (e) => {
        e.preventDefault()
        findOrCreateUser(input.value)
    })
}

function findOrCreateUser(username){
    fetch(playersEndpoint, 
    {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify({player: {name: username}})
    })
    .then(res => res.json())
    .then(obj => {

        let errors = document.getElementsByClassName("div-errors")

        Array.from(errors).forEach(e => e.remove())

        if (obj.errors){

            let div = document.createElement("div")
            div.setAttribute("class", "div-errors")

            let errorList = createCustomElement("ul", "ul-errors")

            div.appendChild(errorList)
            
            obj.errors.forEach(msg => {

                let errorMsg = createCustomElement("li", "li-error-message", msg)
                
                errorList.appendChild(errorMsg)

                document.body.appendChild(div)
            })

        } else {

            sessionStorage.setItem("userId", obj.data.id)
            sessionStorage.setItem("username", obj.data.attributes.name)

            let loginPage = document.getElementById("div-login")
            loginPage.remove()

            renderDifficultyButtons()
        }
    })
}

function renderQuiz(quizObj){
  
    let difficultyButtons = document.getElementById("div-difficulty-buttons")
    difficultyButtons.remove()
    let quizABooHeader = document.getElementById("img-header")
    quizABooHeader.remove()

    renderDifficultyHeader()

    let div = createCustomElement("div", "div-quiz")

    let ol = createCustomElement("ol", "ol-quiz")

    document.body.appendChild(div)
    div.appendChild(ol)

    let actualAnswers = []

    quizObj.results.forEach(questionObj => {

        let question = new Question(questionObj.question, questionObj.correct_answer, questionObj.incorrect_answers)

        let li = createCustomElement("li", "li-question", question.question)
        ol.appendChild(li)
        
        let p = createCustomElement("p", "p-correct-answer", question.correctAnswer)
        actualAnswers.push(p.innerHTML)

        let answersArr = [question.correctAnswer, ...question.incorrectAnswers].sort()
        answersArr.forEach(e => {

            let input = document.createElement("input")
            input.setAttribute("type", "radio")
            input.setAttribute("name", quizObj.results.indexOf(questionObj))
            input.setAttribute("value", e)

            let p = createCustomElement("p", "p-answer-choice", e)

            let br = document.createElement("br")

            ol.appendChild(input)
            ol.appendChild(p)
            ol.appendChild(br)
        })
        
        let br = document.createElement("br")
        ol.appendChild(br)
    })

    let buttonDiv = createCustomElement("div", "div-button")
    buttonDiv.setAttribute("class", "text-center")
    
    let submitButton = createCustomElement("button", "button-submit", "Submit")
    submitButton.setAttribute("type", "submit")
    submitButton.setAttribute("class", "btn btn-login btn-lg")

    div.appendChild(buttonDiv)
    buttonDiv.appendChild(submitButton)

    submitButton.addEventListener("click", (e) => {
        e.preventDefault()

        let submittedAnswers = []
        
        for (let i = 0; i < quizObj.results.length; i++){
            document.getElementsByName(i).forEach(e => {

                if (e.checked){
                    submittedAnswers.push({name: `${e.name}`, value: `${e.value}`})
                }
            })
        }

        let correctScore = 0

        submittedAnswers.forEach(e => {

            if (e.value === actualAnswers[e.name]){
                correctScore += 1
            }
        })

        renderQuizResults(correctScore)
    })
}

function renderQuizResults(score){
    let quizDiv = document.getElementById("div-quiz")
    quizDiv.remove()
    let quizABooHeader = document.getElementById("img-header")
    quizABooHeader.remove()

    let thankYouForPlayingHeader = document.createElement("img")
    thankYouForPlayingHeader.src = "img/thank-you-for-playing.png"
    thankYouForPlayingHeader.id = "img-header"
    document.body.appendChild(thankYouForPlayingHeader)

    let h2 = createCustomElement("h2", "h2-quiz-results", `Your Score: ${score}/10`)
    h2.setAttribute("class", "text-center")
    document.body.appendChild(h2)
    document.body.appendChild(document.createElement("br"))

    fetch(scoresEndpoint, 
    {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify({score: {score_value: score, player_id: sessionStorage.userId, quizDifficulty: sessionStorage.quizDifficulty
        }})
    }).then(() => renderLeaderboard())

}

function renderLeaderboard(){

    let divContainer = createCustomElement("div")
    divContainer.setAttribute("class", "container")

    let divRow = createCustomElement("div")
    divRow.setAttribute("class", "row")

    document.body.appendChild(divContainer)
    divContainer.appendChild(divRow)

    let easyDiv = createCustomElement("div", "div-easy-leaderboard")
    easyDiv.setAttribute("class", "col")
    let easyOl = createCustomElement("ol", "ol-easy-leaderboard")
    let easyImg = createCustomElement("img", "img-easy-leaderboard")
    easyImg.setAttribute("src", "img/easy-leaderboard.png")
    easyImg.setAttribute("class", "w-100")
    
    easyDiv.appendChild(easyImg)
    easyDiv.appendChild(easyOl)
    divRow.appendChild(easyDiv)

    let mediumDiv = createCustomElement("div", "div-medium-leaderboard")
    mediumDiv.setAttribute("class", "col")
    let mediumOl = createCustomElement("ol", "ol-medium-leaderboard")
    let mediumImg = createCustomElement("img", "img-medium-leaderboard")
    mediumImg.setAttribute("src", "img/medium-leaderboard.png")
    mediumImg.setAttribute("class", "w-100")

    mediumDiv.appendChild(mediumImg)
    mediumDiv.appendChild(mediumOl)
    divRow.appendChild(mediumDiv)
    
    let hardDiv = createCustomElement("div", "div-hard-leaderboard")
    hardDiv.setAttribute("class", "col")
    let hardOl = createCustomElement("ol", "ol-hard-leaderboard")
    let hardImg = createCustomElement("img", "img-hard-leaderboard")
    hardImg.setAttribute("src", "img/hard-leaderboard.png")
    hardImg.setAttribute("class", "w-100")

    hardDiv.appendChild(hardImg)
    hardDiv.appendChild(hardOl)
    divRow.appendChild(hardDiv)

    let easyArr = []
    let mediumArr = []
    let hardArr = []

    fetch(scoresEndpoint)
    .then(res => res.json())
    .then(data => {
        data.data.forEach(e => {

            if (e.attributes.quizDifficulty === "easy"){
                easyArr.push({name: e.attributes.player.name, score: e.attributes.score_value})
            } else if (e.attributes.quizDifficulty === "medium"){
                mediumArr.push({name: e.attributes.player.name, score: e.attributes.score_value})
            } else if (e.attributes.quizDifficulty === "hard"){
                hardArr.push({name: e.attributes.player.name, score: e.attributes.score_value})
            }
            
        })

        easyArr.sort((a, b) => (a.score > b.score) ? -1 : 1).slice(0, 15).forEach(e => {
            let easyList = document.getElementById("ol-easy-leaderboard")
            let li = createCustomElement("li", "li-easy-score", `${e.name}: ${e.score}/10`)
            easyList.appendChild(li)
        })

        mediumArr.sort((a, b) => (a.score > b.score) ? -1 : 1).slice(0, 15).forEach(e => {
            let mediumList = document.getElementById("ol-medium-leaderboard")
            let li = createCustomElement("li", "li-medium-score", `${e.name}: ${e.score}/10`)
            mediumList.appendChild(li)
        })

        hardArr.sort((a, b) => (a.score > b.score) ? -1 : 1).slice(0, 15).forEach(e => {
            let hardList = document.getElementById("ol-hard-leaderboard")
            let li = createCustomElement("li", "li-hard-score", `${e.name}: ${e.score}/10`)
            hardList.appendChild(li)
        })

        renderRetakeQuizButton()
    })

}

function clearPage(){
    let divs = document.body.getElementsByTagName("div")
    Array.from(divs).forEach(e => e.remove())

    // let h1s = document.body.getElementsByTagName("h1")
    // Array.from(h1s).forEach(e => e.remove())

    let h2s = document.body.getElementsByTagName("h2")
    Array.from(h2s).forEach(e => e.remove())

    let buttons = document.body.getElementsByTagName("button")
    Array.from(buttons).forEach(e => e.remove())
}

function renderRetakeQuizButton(){

    let buttonDiv = createCustomElement("div", "div-button")
    buttonDiv.setAttribute("class", "text-center")

    let retakeQuizButton = createCustomElement("button", "button-retake-quiz", "Retake Quiz")
    retakeQuizButton.setAttribute("class", "btn btn-login btn-lg")

    document.body.appendChild(buttonDiv)
    buttonDiv.appendChild(retakeQuizButton)

    retakeQuizButton.addEventListener("click", () => {
        clearPage()
        renderDifficultyButtons()
    })
}

function createCustomElement(tagName, tagId = "", innerHTML = ""){
    let element = document.createElement(tagName)
    if (tagId) element.id = tagId
    if (innerHTML) element.innerHTML = innerHTML
    return element
}