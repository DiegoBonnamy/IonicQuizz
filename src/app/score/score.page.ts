import { Component, OnInit } from '@angular/core';
import { Question } from '../question';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-score',
  templateUrl: './score.page.html',
  styleUrls: ['./score.page.scss'],
})
export class ScorePage implements OnInit {

  /* ----- Stockage ----- */

  // Pseudo utilisateur
  pseudo: string = ""
  // Score
  score: number = 0
  // Nb de question
  nbQuestions: number = 10
  // Timer
  timer: number = 15
  // Navigate
  difficulty: string
  catStr: string

  /* ----- Affichage ----- */

  // Images
  wait = "https://images.ladepeche.fr/api/v1/images/view/5efadc823e454630dc028ca5/large/image.jpg?v=1"
  non = "https://c.tenor.com/iPPLJM-iQ-8AAAAC/julien-lepers-c-est-non.gif"
  oui = "https://c.tenor.com/K6nCU-HZwvMAAAAC/lepers-oui.gif"
  feneant = "https://c.tenor.com/ChYgKIudPjwAAAAM/you-i-choose-you.gif"
  unPoint = "https://c.tenor.com/tVcsll5usEkAAAAM/questions-pour-un-champion-julien-lepers.gif"
  troisPoints = "https://c.tenor.com/oln-0ezj6TYAAAAM/lepers-julien.gif"
  biip = "https://www.yzgeneration.com/wp-content/uploads/2015/12/Julien-Lepers-1.gif"
  tesVire = "https://c.tenor.com/IaBB2VZ40-kAAAAM/vir%C3%A9-renvoy%C3%A9.gif"
  tuSors = "https://c.tenor.com/f3vxb461tyMAAAAC/julien-lepers.gif"
  bienJoue = "https://c.tenor.com/OtJRlY48rXAAAAAC/bien-joue.gif"
  ouais = "https://thumbs.gfycat.com/EuphoricAridLadybug-max-1mb.gif"
  vieuxBiip = "https://c.tenor.com/jrUUhECpNnIAAAAM/julien-lepers-con.gif"
  noob = "https://lyon.citycrunch.fr/wp-content/uploads/sites/3/2016/06/tumblr_nj1safipka1rb2l1co1_400.gif"
  navrant = "https://c.tenor.com/6nmsDjSNNXwAAAAM/navrant-france3.gif"
  imageScore = "https://faimdevoyages.com/assets/uploads/2016/03/julien-lepers-faim-de-voyages.gif"
  imageFin = ""

  /* ----- Réponses ----- */

  // Nombre de bonnes réponse
  successAnswers: number = 0

  constructor(private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    // Get params
    this.pseudo = this.activatedRoute.snapshot.params.pseudo
    this.score = this.activatedRoute.snapshot.params.score
    this.nbQuestions = this.activatedRoute.snapshot.params.nbQuestions
    this.timer = this.activatedRoute.snapshot.params.timer
    this.successAnswers = this.activatedRoute.snapshot.params.successAnswers
    this.difficulty = this.activatedRoute.snapshot.params.difficulty
    this.catStr = this.activatedRoute.snapshot.params.category
    // Set images
    switch(Number(this.successAnswers)){
      case 0:
        this.imageFin = this.biip
        break
      case 1:
        this.imageFin = this.vieuxBiip
        break
      case 2:
        this.imageFin = this.tesVire
        break
      case 3:
        this.imageFin = this.noob
        break
      case 4:
        this.imageFin = this.tuSors
        break
      case 5:
        this.imageFin = this.feneant
        break
      case 6:
        this.imageFin = this.navrant
        break
      case 7:
        this.imageFin = this.oui
        break
      case 8:
        this.imageFin = this.bienJoue
        break
      case 9:
        this.imageFin = this.non
        break
      case 10:
        this.imageFin = this.ouais
        break
    }
  }

  navigate_home(){
    this.router.navigate(['/home'], { replaceUrl: true });
  }

  navigate_content(){
    this.router.navigate(['/content', this.pseudo, this.nbQuestions, this.difficulty, this.catStr], { replaceUrl: true });
  }

  home(){
    this.navigate_home()
  }

  replay() {
    this.navigate_content()
  }

}
