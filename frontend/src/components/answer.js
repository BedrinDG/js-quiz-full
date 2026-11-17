import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Auth} from "../services/auth.js";

export class Answer {
    constructor() {
        this.quiz = null;
        this.testId = sessionStorage.getItem('id');
        this.rightAnswer = null;
        this.userInfo = Auth.getUserInfo();
        this.email = localStorage.getItem('userEmail');
        this.testResult = null

        this.init();
    }

    async init() {
        if (this.testId) {
            try {
                const result = await CustomHttp.request(config.host + '/tests/' + this.testId + '/result/details?userId=' + this.userInfo.userId)

                if (result) {
                    if (result.error) {
                        throw new Error(result.error);
                    }

                    this.testResult = result;
                    this.showQuestionsAndAnswers();
                    return false;
                }
            } catch
                (error) {
                console.error(error);
            }
            // location.href = '#/';
        }
    }

    showQuestionsAndAnswers() {
        const that = this;

        document.getElementById('test-name').innerText = this.testResult.test.name;

        document.getElementById('user-data').innerText = `${this.userInfo.fullName}, ${this.email}`;

        let questionsContainer = document.getElementsByClassName('answer-test-questions')[0];

        this.testResult.test.questions.forEach((question, index) => {
            const questionBlock = document.createElement('div');
            questionBlock.className = 'answer-test-question';

            const questionName = document.createElement('div')
            questionName.className = 'question-name';
            questionName.innerHTML = '<span> Вопрос ' + (index + 1) + ': </span> ' + question.question;

            const questionVariables = document.createElement('ul');
            questionVariables.className = 'question-variables';

            question.answers.forEach(answer => {
                const answerBlock = document.createElement('li');

                const marker = document.createElement('div');
                marker.className = 'marker';

                const answerName = document.createElement('p');
                answerName.innerText = answer.answer;

                if (answer.correct !== undefined) {
                    if (answer.correct === true) {
                        answerBlock.className = 'green-text'
                        marker.className += ' marker-green'
                    } else {
                        answerBlock.className = 'red-text'
                        marker.className += ' marker-red'
                    }
                }

                answerBlock.appendChild(marker);
                answerBlock.appendChild(answerName);

                questionVariables.appendChild(answerBlock);
            })

            questionBlock.appendChild(questionName);
            questionBlock.appendChild(questionVariables);

            questionsContainer.appendChild(questionBlock);
        })
    }
}
