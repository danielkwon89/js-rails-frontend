class Question {
    constructor(question, correctAnswer, incorrectAnswers){
        this.question = question
        this.correctAnswer = correctAnswer
        this.incorrectAnswers = incorrectAnswers
    }

    question(){
        return this.question
    }

    correctAnswer(){
        return this.correctAnswer
    }

    incorrectAnswers(){
        return this.incorrectAnswers
    }
}