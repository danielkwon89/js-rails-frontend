// Possible App Names: Quiz-A-Boo Or OtakQ

const easyQuiz = "https://opentdb.com/api.php?amount=10&category=31&difficulty=easy"
const mediumQuiz = "https://opentdb.com/api.php?amount=10&category=31&difficulty=medium"
const hardQuiz = "https://opentdb.com/api.php?amount=10&category=31&difficulty=hard"

const playersEndpoint = "http://localhost:3000/api/v1/players"
const scoresEndpoint = "http://localhost:3000/api/v1/scores"

document.addEventListener('DOMContentLoaded', () => {

    welcomeHeader()

    renderLoginForm()

    let formSubmitButton = document.getElementById("submit-login")
    formSubmitButton.addEventListener('click', (e) => {
        e.preventDefault()
        let userInput = document.getElementById("input-login")
        findOrCreateUser(userInput.value)
    })
})

function welcomeHeader(){
    let h1 = document.createElement("h1")
    h1.innerText = "Welcome to OtakQ!"
    document.body.appendChild(h1)
}

function renderDifficultyButtons(){
    let div = document.createElement("div")
    div.id = "div-difficulty-buttons"

    let easyButton = document.createElement("button")
    easyButton.innerText = "Easy"
    easyButton.id = "button-easy"

    let mediumButton = document.createElement("button")
    mediumButton.innerText = "Medium"
    mediumButton.id = "button-medium"

    let hardButton = document.createElement("button")
    hardButton.innerText = "Hard"
    hardButton.id = "button-hard"

    div.appendChild(easyButton) 
    div.appendChild(mediumButton)
    div.appendChild(hardButton)

    document.body.appendChild(div)

    let easyButtonClick = document.getElementById('button-easy')
    easyButtonClick.addEventListener('click', () => {
        sessionStorage.setItem("quizDifficulty", "easy")
        console.log(sessionStorage.quizDifficulty)
        fetch(easyQuiz)
        .then(res => res.json())
        .then(quiz => renderQuiz(quiz))
    })

    let mediumButtonClick = document.getElementById('button-medium')
    mediumButtonClick.addEventListener('click', () => {
        sessionStorage.setItem("quizDifficulty", "medium")
        console.log(sessionStorage.quizDifficulty)
        fetch(mediumQuiz)
        .then(res => res.json())
        .then(quiz => renderQuiz(quiz))
    })

    let hardButtonClick = document.getElementById('button-hard')
    hardButtonClick.addEventListener('click', () => {
        sessionStorage.setItem("quizDifficulty", "hard")
        console.log(sessionStorage.quizDifficulty)
        fetch(hardQuiz)
        .then(res => res.json())
        .then(quiz => renderQuiz(quiz))
    })
}

function renderLoginForm(){
    let div = document.createElement("div")
    div.id = "div-login"
    
    let form = document.createElement("form")
    form.id = "form-login"

    let label = document.createElement("label")
    label.id = "label-login"
    label.innerText = "Login to Take Quiz:"

    let input = document.createElement("input")
    input.id = "input-login"
    input.setAttribute("placeholder", "username")

    let submit = document.createElement("input")
    submit.id = "submit-login"
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
}

// let formSubmitButton = document.getElementById("submit-login")
// formSubmitButton.addEventListener('click' () => 
// console.log("submit button clicked"))

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
            let errorList = document.createElement("ul")
            errorList.id = "ul-errors"

            div.appendChild(errorList)
            
            obj.errors.forEach(msg => {
                let errorMsg = document.createElement("li")
                errorMsg.innerText = msg
                
                errorList.appendChild(errorMsg)

                document.body.appendChild(div)
            })
        } else {

            sessionStorage.setItem("userId", obj.data.id)
            sessionStorage.setItem("username", obj.data.attributes.name)

            console.log(sessionStorage.userId)
            console.log(sessionStorage.username)

            let loginPage = document.getElementById("div-login")
            loginPage.remove()

            renderDifficultyButtons()
        }
    })
}

function renderQuiz(quizObj){

    let difficultyButtons = document.getElementById("div-difficulty-buttons")
    difficultyButtons.remove()

    let div = document.createElement("div")
    div.id = "div-quiz"

    let ol = document.createElement("ol")
    ol.id = "ol-quiz"

    document.body.appendChild(div)
    div.appendChild(ol)

    let actualAnswers = []

    quizObj.results.forEach(questionObj => {
        let li = document.createElement("li")
        li.innerHTML = questionObj.question
        ol.appendChild(li)

        let p = document.createElement("p")
        p.innerHTML = questionObj.correct_answer
        actualAnswers.push(p.innerHTML)

        let answersArr = [questionObj.correct_answer, ...questionObj.incorrect_answers].sort()
        answersArr.forEach(e => {
            // let form = document.createElement("form")
            // form.id = array index + 1

            let input = document.createElement("input")
            input.setAttribute("type", "radio")
            input.setAttribute("name", quizObj.results.indexOf(questionObj))
            input.setAttribute("value", e)

            let label = document.createElement("label")
            label.innerHTML = e

            // form.appendChild(input)
            // form.appendChild(label)
            // ol.appendChild(form)

            let br = document.createElement("br")

            ol.appendChild(input)
            ol.appendChild(label)
            ol.appendChild(br)
        })
        
        let br = document.createElement("br")
        ol.appendChild(br)
    })
    
    let submitButton = document.createElement("button")
    submitButton.setAttribute("type", "submit")
    submitButton.innerHTML = "Submit"
    div.appendChild(submitButton)

    submitButton.addEventListener("click", (e) => {
        e.preventDefault

        let submittedAnswers = []
        
        for (let i = 0; i < quizObj.results.length; i++){
            document.getElementsByName(i).forEach(e => {
                if (e.checked){
                    submittedAnswers.push(e.value)
                    // console.log(submittedAnswers)
                    // console.log(actualAnswers)
                }
            })
        }

        let correctScore = 0

        submittedAnswers.forEach(e => {
            if (e === actualAnswers[submittedAnswers.indexOf(e)]){
                correctScore += 1
            }
        })

        console.log(correctScore)
        renderQuizResults(correctScore)
    })
}

function renderQuizResults(score){
    let quizDiv = document.getElementById("div-quiz")
    quizDiv.remove()

    let h2 = document.createElement("h2")
    h2.innerHTML = `Your Score: ${score}/10`
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

    let easyLeaderboard = document.createElement("div")
    easyLeaderboard.id = "easy-leaderboard-div"
    let easyOl = document.createElement("ol")
    easyOl.id = "easy-leaderboard-ol"
    let easyH3 = document.createElement("h3")
    easyH3.innerHTML = "Easy Quiz Leaderboard:"
    easyLeaderboard.appendChild(easyH3)
    easyLeaderboard.appendChild(easyOl)
    document.body.appendChild(easyLeaderboard)

    let mediumLeaderboard = document.createElement("div")
    mediumLeaderboard.id = "medium-leaderboard-div"
    let mediumOl = document.createElement("ol")
    mediumOl.id = "medium-leaderboard-ol"
    let mediumH3 = document.createElement("h3")
    mediumH3.innerHTML = "Medium Quiz Leaderboard:"
    mediumLeaderboard.appendChild(mediumH3)
    mediumLeaderboard.appendChild(mediumOl)
    document.body.appendChild(mediumLeaderboard)
    
    let hardLeaderboard = document.createElement("div")
    hardLeaderboard.id = "hard-leaderboard-div"
    let hardOl = document.createElement("ol")
    hardOl.id = "hard-leaderboard-ol"
    let hardH3 = document.createElement("h3")
    hardH3.innerHTML = "Hard Quiz Leaderboard:"
    hardLeaderboard.appendChild(hardH3)
    hardLeaderboard.appendChild(hardOl)
    document.body.appendChild(hardLeaderboard)

    let easyArr = []
    let mediumArr = []
    let hardArr = []

    fetch("http://localhost:3000/api/v1/scores")
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
            let li = document.createElement("li")
            li.innerHTML = `${e.name}: ${e.score}/10`
            let easyList = document.getElementById("easy-leaderboard-ol")
            easyList.appendChild(li)
        })

        mediumArr.sort((a, b) => (a.score > b.score) ? -1 : 1).slice(0, 25).forEach(e => {
            let li = document.createElement("li")
            li.innerHTML = `${e.name}: ${e.score}/10`
            let mediumList = document.getElementById("medium-leaderboard-ol")
            mediumList.appendChild(li)
        })

        hardArr.sort((a, b) => (a.score > b.score) ? -1 : 1).slice(0, 25).forEach(e => {
            let li = document.createElement("li")
            li.innerHTML = `${e.name}: ${e.score}/10`
            let hardList = document.getElementById("hard-leaderboard-ol")
            hardList.appendChild(li)
        })

        // add button with click eventlistener which clears page (function) then renders difficulty buttons

        let retakeQuizButton = document.createElement("button")
        retakeQuizButton.id = "retake-quiz-button"
        retakeQuizButton.innerHTML = "Retake Quiz"
        document.body.appendChild(retakeQuizButton)

        retakeQuizButton.addEventListener("click", () => {
            clearPage()
            renderDifficultyButtons()
        })

        // renderDifficultyButtons()

        // create button to get back to choose quiz difficulty page
        // add timer functionality and sort scores by score first then lowest time elapsed
    })

    // clearPage()
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