// Quiz-A-Boo
// OtakQ

// Anime Quiz API Endpoints:
const mixedDifficulty = "https://opentdb.com/api.php?amount=10&category=31"
const easyDifficulty = "https://opentdb.com/api.php?amount=10&category=31&difficulty=easy"
const mediumDifficulty = "https://opentdb.com/api.php?amount=10&category=31&difficulty=medium"
const hardDifficulty = "https://opentdb.com/api.php?amount=10&category=31&difficulty=hard"

document.addEventListener('DOMContentLoaded', () => {
    chooseDifficulty()
})


function chooseDifficulty(){
    h1 = document.createElement("h1")
    h1.innerText = "Welcome to OtakQ!"
    document.body.appendChild(h1)

    renderDifficultyButtons()
}

function renderDifficultyButtons(){
    div = document.createElement("div")

    easyButton = document.createElement("button")
    easyButton.innerText = "Easy"
    easyButton.id = "button-easy"

    mediumButton = document.createElement("button")
    mediumButton.innerText = "Medium"
    mediumButton.id = "button-medium"

    hardButton = document.createElement("button")
    hardButton.innerText = "Hard"
    hardButton.id = "button-hard"

    div.appendChild(easyButton) 
    div.appendChild(mediumButton)
    div.appendChild(hardButton)

    document.body.appendChild(div)
}