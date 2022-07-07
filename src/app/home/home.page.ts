import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { OpenTriviaService } from '../open-trivia.service';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  /* ----- Stockage ----- */

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
  // Catégories
  categoriesSelected: Array<string> = ["all"]
  categories: Array<string>
  nbOfCat: number

  /* ----- Affichage ----- */

  // Difficultés
  diffArray = ["easy", "medium", "hard"]

  /**
   * Constructeur
   * @param toastCtrl Toast
   * @param openTriviaSrv Service OpenTrivia
   */
  constructor(private toastCtrl: ToastController, private openTriviaSrv: OpenTriviaService, private router: Router, private navCtrl: NavController) {
    this.categories = openTriviaSrv.getCategories()
  }

  ngDoCheck() {
    if(this.categoriesSelected.length > 0){
      this.nbOfCat = this.openTriviaSrv.getNumberOfCategory(this.categoriesSelected, this.difficulte)
    }
  }

  /**
   * Connexion
   */
  async begin() {
    if(this.pseudo.length >= 3 && this.diffArray.includes(this.difficulte) && this.nbQuestions > 0 && this.nbQuestions <= 1000){
      this.navigate()      
    }
    else{
      this.showToast("Formulaire invalide", 5000, 'bottom', null)
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

  navigate(){
    let catStr = ""
    this.categoriesSelected.forEach(cat => {
      catStr += cat + ","
    });
    this.router.navigate(['/content', this.pseudo, this.nbQuestions, this.difficulte, catStr.slice(0, -1)], { replaceUrl: true });
  }
}
