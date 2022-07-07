import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { OpenTriviaService } from '../open-trivia.service';
import { Question } from '../question';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-content',
  templateUrl: './content.page.html',
  styleUrls: ['./content.page.scss'],
})
export class ContentPage implements OnInit {

  // Pseudo utilisateur
  pseudo: string = ""
  // Difficulté choisie
  difficulte: string = "easy"
  // Toggle
  remember: boolean
  // Score
  score: number = 0
  // Nb de question
  nbQuestions: number = 10
  // Timer
  timer: number = 15
  // Category
  category: Array<string>

  /* ----- Affichage ----- */

  // Image
  wait: string = "https://images.ladepeche.fr/api/v1/images/view/5efadc823e454630dc028ca5/large/image.jpg?v=1"
  non = "https://c.tenor.com/iPPLJM-iQ-8AAAAC/julien-lepers-c-est-non.gif"
  oui = "https://c.tenor.com/K6nCU-HZwvMAAAAC/lepers-oui.gif"
  imageQuestion: string = this.wait
  // Bouton suivant
  isNextVisible: boolean = false
  // Difficultés
  diffArray = ["easy", "medium", "hard"]
  // Classes des boutons
  answerBtnClass1: string = 'btn-secondary'
  answerBtnClass2: string = 'btn-secondary'
  answerBtnClass3: string = 'btn-secondary'
  answerBtnClass4: string = 'btn-secondary'
  // En attente du choix de l'utlisateur
  isWaitAnswer: boolean = true
  // ProgressBar
  progressValue: number = 0
  isProgress: boolean = true
  progressColor: string = "success"
  progressSave: number = 0

  /* ----- Question ----- */

  // Liste des questions
  questionList: any
  // Numero de la question en cours
  currentQuestion: number = 1
  // Question
  question: Question

  /* ----- Réponses ----- */

  // Liste des réponses
  answers: Array<string>
  // Réponse selectionnée
  answerId: number
  // Numero de la bonne reponse
  correctAnswer: number
  // Nombre de bonnes réponse
  successAnswers: number = 0

  /**
   * Constructeur
   * @param toastCtrl Toast
   * @param openTriviaSrv Service OpenTrivia
   */
  constructor(private activatedRoute: ActivatedRoute, private toastCtrl: ToastController, private openTriviaSrv: OpenTriviaService, private router: Router) {

   }

  ngOnInit() {
    // Reset
    this.successAnswers = 0
    this.currentQuestion = 1
    this.score = 0
    // Get params
    this.pseudo = this.activatedRoute.snapshot.params.pseudo
    this.nbQuestions = this.activatedRoute.snapshot.params.nbQuestions
    this.difficulte = this.activatedRoute.snapshot.params.difficulty
    this.category = this.activatedRoute.snapshot.params.category.split(",")
    console.log(this.category)
    // Get questions
    this.getQuestions(this.nbQuestions, this.difficulte, this.category)
    // Set timer
    switch(this.difficulte){
      case "easy":
        this.timer = 15
        break
      case "medium":
        this.timer = 15
        break
      case "hard":
        this.timer = 15
        break
    }
    // Show first question
    this.showQuestion(this.currentQuestion)
  }

  navigate(){
    let catStr = ""
    this.category.forEach(cat => {
      catStr += cat + ","
    });
    this.router.navigate(['/score', this.pseudo, this.score, this.nbQuestions, this.timer, this.successAnswers, this.difficulte, catStr.slice(0, -1)]);
  }

  /**
   * Choix réponse
   * @param id Id de la réponse
   */
   answer(id: number) {
    if(this.isWaitAnswer){
      this.isNextVisible = true
      this.answerId = id
      this.setAnswersBtnClass(id)
    }
  }

  /**
   * Change la couleur des boutons en fonction du contexte
   * @param id Id du bouton à modifier (0 pour reset)
   */
   setAnswersBtnClass(id: number){
    // Si le joueur n'a pas encore répondu
    if(this.isWaitAnswer){
      this.answerBtnClass1 = 'btn-secondary'
      this.answerBtnClass2 = 'btn-secondary'
      this.answerBtnClass3 = 'btn-secondary'
      this.answerBtnClass4 = 'btn-secondary'
      switch(id){
        case 1:
          this.answerBtnClass1 = 'btn-selected'
          break
        case 2:
          this.answerBtnClass2 = 'btn-selected'
          break
        case 3:
          this.answerBtnClass3 = 'btn-selected'
          break
        case 4:
          this.answerBtnClass4 = 'btn-selected'
          break
      }
    }
    // Affichage résultat
    else{
      this.answerBtnClass1 = 'btn-danger'
      this.answerBtnClass2 = 'btn-danger'
      this.answerBtnClass3 = 'btn-danger'
      this.answerBtnClass4 = 'btn-danger'
      switch(this.correctAnswer){
        case 1:
          this.answerBtnClass1 = 'btn-success'
          break
        case 2:
          this.answerBtnClass2 = 'btn-success'
          break
        case 3:
          this.answerBtnClass3 = 'btn-success'
          break
        case 4:
          this.answerBtnClass4 = 'btn-success'
          break
      }
    }
  }

  /**
   * Affichage d'un toast
   * @param message Message du toast
   */
   async showToast(message: string, duration: number, position: any, color: string) {
    const toast = await this.toastCtrl.create({
      'message': message,
      'duration': duration,
      'position': position,
      'color': color
    });
    toast.present();
  }

  /**
   * Récupération de la liste de questions
   * @param nb Nombre de question à récupérer
   * @param difficult Niveau de difficulté
   */
   getQuestions(nb: number, difficult: string, category: Array<string>){
    //this.questionList = await this.openTriviaSrv.getQuestionsAPI(nb,difficult)
    this.questionList = this.openTriviaSrv.getQuestionsFr(nb, difficult, category)
  }

  /**
   * Affichage de la question et des réponses sur l'interface
   * @param id Id de la question à afficher
   */
   showQuestion(id: number){
    if(id <= this.questionList.length){
      this.setProgress(this.timer)

      this.question = this.questionList[id - 1]

      // Liste des réponse
      let answerList = this.question.incorrect_answers
      answerList.push(this.question.correct_answer)

      let shuffledAnswerList = answerList.sort(function () {
        return Math.random() - 0.5;
      });

      // Détermination de l'id de la bonne réponse
      var i = 1
      shuffledAnswerList.forEach(element => {
        if(element == this.question.correct_answer){
          this.correctAnswer = i
        }
        i++
      });

      // Set liste réponses
      this.answers = shuffledAnswerList
    }
    else{
      this.navigate()
    }
  }

  /**
   * Test si la réponse est correcte
   */
  async checkQuestion(){
    this.stopProgress()
    this.isNextVisible = false
    if(this.correctAnswer == this.answerId){
      this.imageQuestion = this.oui
      this.score = this.score + (this.timer - this.progressSave + 1)
      this.showToast("+ " + (this.timer - this.progressSave + 1) + " pts", 2000, 'top', "success")
      this.successAnswers++
    }
    else{
      this.imageQuestion = this.non
      this.showToast("+ 0 pt", 2000, 'top', "danger")
    }
    this.isWaitAnswer = false
    this.setAnswersBtnClass(this.correctAnswer)
    //this.setProgress(5)
    await this.delay(5000);
    this.nextQuestion()
  }

  /**
   * Passe à la question suivante
   */
  nextQuestion(){
    this.isWaitAnswer = true
    this.imageQuestion = this.wait
    this.setAnswersBtnClass(0)
    this.currentQuestion++
    this.showQuestion(this.currentQuestion)
  }

  /**
   * Lance un délai d'attente
   * @param ms Temps d'attente
   */
  delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  /**
   * Affichage de la progressBar
   * @param time Temps
   */
  async setProgress(time: number){
    this.progressValue = 0
    this.isProgress = true
    var timeleft = time;
    this.progressColor = "success"

    let middleTime = Math.round(time / 2)
    let quarterTime = Math.round(time / 5)

    while(timeleft > 0){
      if(this.isProgress){
        if(timeleft <= middleTime && timeleft > quarterTime){
          this.progressColor = "warning"
        }
        if(timeleft <= quarterTime){
          this.progressColor = "danger"
        }
        this.progressValue = (time - timeleft) / time
        timeleft = timeleft - 0.1
        await this.delay(100)
      }
      else{
        break
      }
    }

    if(this.isProgress){
      this.answerId = 0
      this.progressSave = time
      this.checkQuestion()
    }
  }

  /**
   * Stop la bar de progression
   */
  stopProgress(){
    this.progressSave = Math.round(this.progressValue * 10)
    this.progressValue = 0
    this.isProgress = false
  }
}
