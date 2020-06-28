import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import {HttpClient} from '@angular/common/http';
import 'rxjs/add/operator/map'
import { NoteServiceProvider } from '../../providers/note-service/note-service';
import { SocialSharing } from '@ionic-native/social-sharing';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  private currencies: string = "";
  private currency: string = "";
  private ifExists: string = "";
  private currObj: Object;
  private popularCurrencies = ['EUR', 'USD', 'JPY', 'CHF', 'other'];
  constructor(public navCtrl: NavController, public http: HttpClient, private noteService: NoteServiceProvider,
     private alertCtrl: AlertController, private socialSharing: SocialSharing, private iab: InAppBrowser) {
    this.getJSon().subscribe((data) =>
      this.currObj = data
    );
    this.noteService.getCurrency().then(res => {
      if(res){
        if(res != 'EUR' && res != 'USD' && res != 'JPY' && res != 'CHF'){
        this.currency = res;
        this.popularCurrencies.unshift(this.currency);
        }else{
          this.currency = res;
        }
      }else{
        this.currency = "EUR";
      }
    });
  }

  checkCurrency(){
   if(this.currObj.hasOwnProperty(this.currencies)){
      this.ifExists = this.currObj[this.currencies];
   }
  }

  saveCurrency(){
    if(this.ifExists == ""){

        let alert = this.alertCtrl.create({
          title: 'Are you sure?',
          message: 'Do you want to use this as a currency?',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                console.log('Cancel clicked');
              }
            },
            {
              text: 'Confirm',
              handler: () => {
                this.noteService.setCurrency(this.currencies);
                this.popularCurrencies.unshift(this.currencies);
                this.currency = this.currencies;
              }
            }
          ]
        });
        alert.present();
      
    }else{
      if(this.currencies != 'EUR' && this.currencies != 'USD' && this.currencies != 'JPY' && this.currencies != 'CHF'){
        this.noteService.setCurrency(this.currencies);
        this.popularCurrencies.unshift(this.currencies);
        this.currency = this.currencies;
        }else{
          this.noteService.setCurrency(this.currencies);
          this.currency = this.currencies;
        }
   
    }
  }
  saveSelectedCurrency(){
    if(this.currency !== 'other'){
    this.noteService.setCurrency(this.currency);
    }
  }
 
  getJSon(){
    return this.http.get("assets/data/currencies.json").map((data) => {
      return data;
    });
  }

  shareFeedback(){
    this.socialSharing.shareViaEmail(null, null, ['lendhelper@hotmail.com']);
  }

  privacyPolicy(){
    const browser = this.iab.create('https://www.iubenda.com/privacy-policy/97250589/full-legal',"_blank","location=no");
    browser.show();
    }
}
