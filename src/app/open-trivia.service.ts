import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Question } from './question';
import questionsFr from './_files/openquizzdb.json';

@Injectable({
  providedIn: 'root'
})
export class OpenTriviaService {

  baseUrl: string = "https://opentdb.com/api.php"

  constructor(private http: HttpClient) { }

  getQuestions(nb: number, difficult: string){
    return new Promise((resolve, reject) => {
      let result = []
    
      // Q1
      const q1 = new Question()
      q1.category = "Entertainment: Japanese Anime & Manga"
      q1.type = "multiple"
      q1.difficulty = "easy"
      q1.question = "In 'Fairy Tail', what is the nickname of Natsu Dragneel?"
      q1.correct_answer = "The Salamander"
      q1.incorrect_answers = ["The Dragon Slayer", "The Dragon", "The Demon"]
      result.push(q1)

      // Q2
      const q2 = new Question()
      q2.category = "Entertainment: Video Games"
      q2.type = "boolean"
      q2.difficulty = "medium"
      q2.question = "'Return to Castle Wolfenstein' was the only game of the Wolfenstein series where you don't play as William 'B.J.' Blazkowicz."
      q2.correct_answer = "False"
      q2.incorrect_answers = ["True"]
      result.push(q2)

      resolve(result);
    })
  }

  async getQuestionsAPI(nb: number, difficult: string) {
    let result: any;
    try {
      result = await this.http.get(this.baseUrl + "?amount=" + nb + "&difficulty=" + difficult + "&category=27").toPromise();
    } catch (error) {
      console.log(error);
    }
    let questionList = result.results
    return questionList;
  }

  getQuestionsFr(nb: number, difficult: string, category: Array<string>) {
    let result: any = []
    let idList: Array<number> = []
    let nbOfCat = this.getNumberOfCategory(category, difficult)
    if(nb > nbOfCat){
      nb = nbOfCat
    }
    while(idList.length < nb){
      let rand = this.randomIntFromInterval(1, questionsFr.length)
      if(!idList.includes(rand)){
        let q = questionsFr[rand - 1]
        if(difficult == this.getDifficulty(q.difficulte) && (category[0] == "all" || category.includes(q.theme))){
          result.push(q)
          idList.push(rand)
        }
      }
    }

    // Create object
    let finalResult: any = []
    result.forEach(element => {
      const q = new Question()
      q.category = element.theme
      q.difficulty = this.getDifficulty(element.difficulte)
      q.question = element.question
      q.type = "multiple"
      q.correct_answer = element.prop1
      q.incorrect_answers = [element.prop2, element.prop3, element.prop4]
      finalResult.push(q)
    })

    return finalResult
  }

  getCategories() {
    let categories = []
    questionsFr.forEach(element => {
      if(!categories.includes(element.theme)){
        categories.push(element.theme)
      }
    });
    categories.sort((a, b) => a.localeCompare(b))
    return categories
  }

  getNumberOfCategory(category: Array<string>, difficulty: string){
    if(category[0] != "all"){
      var i = 0
      category.forEach(c => {
        questionsFr.forEach(q => {
          if(q.theme == c && this.getDifficulty(q.difficulte) == difficulty){
            i++
          }
        })
      });
      return i
    }
    else{
      return 1000
    }
  }

  randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  getDifficulty(difficulty: string){
    switch(difficulty){
      case '1':
        return "easy"
      case '2':
        return "medium"
      default:
        return "hard"
    }
  }
}
