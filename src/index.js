// Possible App Names: Quiz-A-Boo Or OtakQ

const easyQuiz = "https://opentdb.com/api.php?amount=10&category=31&difficulty=easy"
const mediumQuiz = "https://opentdb.com/api.php?amount=10&category=31&difficulty=medium"
const hardQuiz = "https://opentdb.com/api.php?amount=10&category=31&difficulty=hard"

const playersEndpoint = "http://localhost:3000/api/v1/players"
const scoresEndpoint = "http://localhost:3000/api/v1/scores"

document.addEventListener('DOMContentLoaded', () => {

    renderLoginForm()
})

function welcomeHeader(){

    let h1 = createCustomElement("h1", "h1-welcome", "Welcome to OtakQ!")
    document.body.appendChild(h1)
}

function renderDifficultyButtons(){

    let div = createCustomElement("div", "div-difficulty-buttons")

    let easyButton = createCustomElement("button", "button-easy", "Easy Quiz")

    let mediumButton = createCustomElement("button", "button-medium", "Medium Quiz")

    let hardButton = createCustomElement("button", "button-hard", "Hard Quiz")

    div.appendChild(easyButton) 
    div.appendChild(mediumButton)
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

    welcomeHeader()

    let div = createCustomElement("div", "div-login")

    let form = createCustomElement("form", "form-login")

    let label = createCustomElement("label", "label-login", "Login to Take Quiz")

    let input = createCustomElement("input", "input-login")
    input.setAttribute("placeholder", "username")

    let submit = createCustomElement("button", "submit-login", "Submit")
    submit.setAttribute("type", "submit")

    let br1 = document.createElement("br")
    let br2 = document.createElement("br")

    document.body.appendChild(div)
    div.appendChild(form)
    form.appendChild(label)
    form.appendChild(br1)
    form.appendChild(input)
    form.appendChild(br2)
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

    //
    console.log(quizObj)
    //
  
    let difficultyButtons = document.getElementById("div-difficulty-buttons")
    difficultyButtons.remove()

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

            let label = createCustomElement("label", "label-answer-choice", e)

            let br = document.createElement("br")

            ol.appendChild(input)
            ol.appendChild(label)
            ol.appendChild(br)
        })
        
        let br = document.createElement("br")
        ol.appendChild(br)
    })
    
    let submitButton = createCustomElement("button", "button-submit", "Submit")
    submitButton.setAttribute("type", "submit")
    div.appendChild(submitButton)

    submitButton.addEventListener("click", (e) => {
        e.preventDefault()

        let submittedAnswers = []
        
        for (let i = 0; i < quizObj.results.length; i++){
            document.getElementsByName(i).forEach(e => {
                if (e.checked){
                    submittedAnswers.push(e.value)
                }
            })
        }

        let correctScore = 0

        submittedAnswers.forEach(e => {
            if (e === actualAnswers[submittedAnswers.indexOf(e)]){
                correctScore += 1
            }
        })

        renderQuizResults(correctScore)
    })
}

function renderQuizResults(score){
    let quizDiv = document.getElementById("div-quiz")
    quizDiv.remove()

    let h2 = createCustomElement("h2", "h2-quiz-results", `Your Score: ${score}/10`)
    document.body.appendChild(h2)

    fetch(scoresEndpoint, 
    {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify({score: {score_value: score, player_id: sessionStorage.userId, quizDifficulty: sessionStorage.quizDifficulty
        }})
    }).then(() => renderLeaderboard())

}

function renderLeaderboard(){

    let easyDiv = createCustomElement("div", "div-easy-leaderboard")
    let easyOl = createCustomElement("ol", "ol-easy-leaderboard")
    let easyH3 = createCustomElement("h3", "h3-easy-leaderboard", "Easy Quiz Leaderboard:")
    
    easyDiv.appendChild(easyH3)
    easyDiv.appendChild(easyOl)
    document.body.appendChild(easyDiv)

    let mediumDiv = createCustomElement("div", "div-medium-leaderboard")
    let mediumOl = createCustomElement("ol", "ol-medium-leaderboard")
    let mediumH3 = createCustomElement("h3", "h3-medium-leaderboard", "Medium Quiz Leaderboard:")

    mediumDiv.appendChild(mediumH3)
    mediumDiv.appendChild(mediumOl)
    document.body.appendChild(mediumDiv)
    
    let hardDiv = createCustomElement("div", "div-hard-leaderboard")
    let hardOl = createCustomElement("ol", "ol-hard-leaderboard")
    let hardH3 = createCustomElement("h3", "h3-hard-leaderboard", "Hard Quiz Leaderboard:")

    hardDiv.appendChild(hardH3)
    hardDiv.appendChild(hardOl)
    document.body.appendChild(hardDiv)

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

        easyArr.sort((a, b) => (a.score > b.score) ? -1 : 1).slice(0, 25).forEach(e => {
            let easyList = document.getElementById("ol-easy-leaderboard")
            let li = createCustomElement("li", "li-easy-score", `${e.name}: ${e.score}/10`)
            easyList.appendChild(li)
        })

        mediumArr.sort((a, b) => (a.score > b.score) ? -1 : 1).slice(0, 25).forEach(e => {
            let mediumList = document.getElementById("ol-medium-leaderboard")
            let li = createCustomElement("li", "li-medium-score", `${e.name}: ${e.score}/10`)
            mediumList.appendChild(li)
        })

        hardArr.sort((a, b) => (a.score > b.score) ? -1 : 1).slice(0, 25).forEach(e => {
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

    let retakeQuizButton = createCustomElement("button", "button-retake-quiz", "Retake Quiz")
    document.body.appendChild(retakeQuizButton)

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