// Quiz-A-Boo
// OtakQ

// Anime Quiz API Endpoints:
const mixedDifficulty = "https://opentdb.com/api.php?amount=10&category=31"
const easyDifficulty = "https://opentdb.com/api.php?amount=10&category=31&difficulty=easy"
const mediumDifficulty = "https://opentdb.com/api.php?amount=10&category=31&difficulty=medium"
const hardDifficulty = "https://opentdb.com/api.php?amount=10&category=31&difficulty=hard"

// Rails API Endpoints:
// const players =
// const scores =

document.addEventListener('DOMContentLoaded', () => {

    // Load login page
    // Once 'logged in' run a find_or_create_by in the db with the username
    // "Log in" the user then run 'chooseDifficulty' and store their user id
    // Make an API call for the question set for the difficulty chosen then render the quiz
    // Calculate and display score then run a fetch POST request to create a score associated with the user
    // Run chooseDifficulty again

    welcomeHeader()

    renderLoginForm()

    // let easyButtonClick = document.getElementById('button-easy')
    // easyButtonClick.addEventListener('click', () => {
    //     console.log("easy!")
    //     fetch(easyDifficulty)
    //     .then(res => res.json())
    //     .then(quiz => console.log(quiz))
    // })

    // let mediumButtonClick = document.getElementById('button-medium')
    // mediumButtonClick.addEventListener('click', () => {
    //     console.log("medium!")
    //     fetch(mediumDifficulty)
    //     .then(res => res.json())
    //     .then(quiz => console.log(quiz))
    // })

    // let hardButtonClick = document.getElementById('button-hard')
    // hardButtonClick.addEventListener('click', () => {
    //     console.log("hard!")
    //     fetch(hardDifficulty)
    //     .then(res => res.json())
    //     .then(quiz => console.log(quiz))
    // })

    let formSubmitButton = document.getElementById("submit-login")
    formSubmitButton.addEventListener('click', (e) => {
        e.preventDefault()
        let userInput = document.getElementById("input-login")
        findOrCreateUser(userInput.value)
    })
})

//

function welcomeHeader(){
    let h1 = document.createElement("h1")
    h1.innerText = "Welcome to OtakQ!"
    document.body.appendChild(h1)
}

function renderDifficultyButtons(){
    let div = document.createElement("div")

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

function renderQuiz(){

}

function findOrCreateUser(username){
    fetch('http://localhost:3000/api/v1/players', 
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
            sessionStorage.setItem("userId", obj.id)
            sessionStorage.setItem("username", obj.name)

            console.log(sessionStorage.userId)
            console.log(sessionStorage.username)

            let loginPage = document.getElementById("div-login")
            loginPage.remove()

            renderDifficultyButtons()
        }
    })
}

// Working fetch POST method
// fetch('http://localhost:3000/api/v1/players', 
// {method: 'POST',
// headers: {'Content-Type': 'application/json'}, 
// body: JSON.stringify({player: {name: "Jennifer"}})
// })