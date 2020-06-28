import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {FriendInfoPage} from '../friend-info/friend-info';
import {SettingsPage} from '../settings/settings';
import {NoteServiceProvider} from '../../providers/note-service/note-service';
import {Storage} from '@ionic/storage';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  AddNew: any;
  SettingsPage: any;
  FriendInfoPage: any;
  BorrowedPage: any;
  LoanedPage: any;
  currency = "";
  notes: Promise<any>;
   helpingArray: any;

  constructor( private storage: Storage, public navCtrl: NavController, private noteService: NoteServiceProvider) {
    this.AddNew = FriendInfoPage;
    this.SettingsPage = SettingsPage;
    this.FriendInfoPage = FriendInfoPage;
  }
  ionViewWillEnter(){
    this.notes = this.getAllNotes();
    this.getCurrentCurrency();
  }
  getCurrentCurrency(){
    this.noteService.getCurrency().then(res => {
      if(res){
        this.currency = res;
      }else{
        this.currency = "EUR";
      }
    });
  }
  openSettingsPage(){
    this.navCtrl.push(this.SettingsPage);
  }
  openBorrowedPage(){
    this.navCtrl.push(this.BorrowedPage);
  }
  openLoanedPage(){
    this.navCtrl.push(this.LoanedPage);
  }
  getAllNotes(){
    return this.noteService.getAllNotes();
  }
  showDetails(note){
    this.navCtrl.push(this.FriendInfoPage, {note});
  }
  initializeItems(): any {
    this.notes = this.getAllNotes();
  }
  getItems(ev: any) {
    this.initializeItems();
    const val = ev.target.value;

    if (val && val.trim() != '') {
     this.notes = this.storage.get('notes').then(
      (getNotes)=>{
        this.helpingArray = getNotes == null ? [] : getNotes;
          Promise.all(getNotes).then( 
          this.helpingArray = getNotes.filter((note) => {
           return(note.name.toLowerCase().indexOf(val.toLowerCase()) > -1 || note.descript.toLowerCase().indexOf(val.toLowerCase()) > -1);
        
          }));
           return this.helpingArray;
      }
    );
    }
  }


}
