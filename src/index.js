// Quiz-A-Boo
// OtakQ

// Anime Quiz API Endpoints:
const mixedDifficulty = "https://opentdb.com/api.php?amount=10&category=31"
const easyDifficulty = "https://opentdb.com/api.php?amount=10&category=31&difficulty=easy"
const mediumDifficulty = "https://opentdb.com/api.php?amount=10&category=31&difficulty=medium"
const hardDifficulty = "https://opentdb.com/api.php?amount=10&category=31&difficulty=hard"

document.addEventListener('DOMContentLoaded', () => {
    chooseDifficulty()

    let easyButtonClick = document.getElementById('button-easy')
    easyButtonClick.addEventListener('click', () => {
        console.log("easy!")
    })

    let mediumButtonClick = document.getElementById('button-medium')
    mediumButtonClick.addEventListener('click', () => {
        console.log("medium!")
    })

    let hardButtonClick = document.getElementById('button-hard')
    hardButtonClick.addEventListener('click', () => {
        console.log("hard!")
    })
})

function chooseDifficulty(){
    let h1 = document.createElement("h1")
    h1.innerText = "Welcome to OtakQ!"
    document.body.appendChild(h1)

    renderDifficultyButtons()
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

function renderQuiz(){

}