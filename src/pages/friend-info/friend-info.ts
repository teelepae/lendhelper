import { Component } from '@angular/core';
import {NavController, NavParams, AlertController} from 'ionic-angular';
import { DatePicker } from '@ionic-native/date-picker';
import {NoteServiceProvider} from '../../providers/note-service/note-service';
import {Validators, FormGroup, FormBuilder} from '@angular/forms';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { SocialSharing } from '@ionic-native/social-sharing';
import {SettingsPage} from '../settings/settings';

@Component({
  selector: 'page-friend-info',
  templateUrl: 'friend-info.html'
})
export class FriendInfoPage {
  formGroup: FormGroup;
  private headerColor: string = "secondary";
  private note: any;
  private madeBefore: boolean = false;
  private userCurrency: string = "";
  private deadline: boolean = true;
  private maxDate: string = new Date().toISOString();
  private minDate: string = new Date().toISOString();

  SettingsPage: any;

  constructor(public navCtrl: NavController, private datePicker: DatePicker, private noteService: NoteServiceProvider, private builder: FormBuilder,
              private navParams: NavParams, private alertCtrl: AlertController, private localNotifications: LocalNotifications,
            private socialSharing: SocialSharing) {
              
    this.SettingsPage = SettingsPage;
    this.formGroup = this.builder.group({
      name: '',
      type: '',
      descript: '',
      date: new Date().toISOString(),
      icon: '',
      amount: '',
      notify: ''
    });

    this.note = navParams.get('note');
    if(this.note) {
      this.formGroup.controls['type'].setValue(this.note.type);
      this.formGroup.controls['name'].setValue(this.note.name);
      this.formGroup.controls['descript'].setValue(this.note.descript);
      this.formGroup.controls['date'].setValue(this.note.date);
      this.formGroup.controls['icon'].setValue(this.note.icon);
      this.formGroup.controls['amount'].setValue(this.note.amount);
      if(this.note.notify){
        this.deadline = true;
        this.formGroup.controls['notify'].setValue(this.note.notify);
      }
      if(!this.note.notify){
        this.deadline = false;
      }
      if(this.note.type === "Borrowed"){
        this.headerColor = "blue";
      }
      if(this.note.type === "Loaned"){
        this.headerColor = "red";
      }
      this.madeBefore = true;

    }else{
      this.formGroup.controls['type'].setValue("Borrowed");
      this.formGroup.controls['icon'].setValue("Other");
    }

  }
  ionViewWillEnter(){
    this.noteService.getCurrency().then(res => {
      if(res){
        this.userCurrency = res;
      }else{
        this.userCurrency = "EUR";
      }
    });
  }

  changeCurrency(){
    let alert = this.alertCtrl.create({
      title: 'Currency',
      message: 'Do you want to change currency?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Confirm',
          handler: () => {
            this.navCtrl.push(this.SettingsPage);
          }
        }
      ]
    });
    alert.present();
  }

  descRequired(){
    this.formGroup.get("amount").setValidators(null);
    this.formGroup.get("descript").setValidators([Validators.required]);
    this.formGroup.controls["amount"].updateValueAndValidity();
    this.formGroup.controls["descript"].updateValueAndValidity();
  }
  descNotRequired(){
    this.formGroup.get("descript").setValidators(null);
    this.formGroup.get("amount").setValidators([Validators.required]);
    this.formGroup.controls["descript"].updateValueAndValidity();
    this.formGroup.controls["amount"].updateValueAndValidity();
  }

  saveForm(){
    if(this.note == null){
      let reminderString = "";
      let objInRecuest = this.formGroup.value.descript;
      if(this.formGroup.value.descript == "" || this.formGroup.value.descript == undefined){
        objInRecuest = this.formGroup.value.amount + " " + this.userCurrency;
      }
      if(this.formGroup.value.type == "Borrowed"){
        this.noteService.saveBorrowedNote(this.formGroup.value);
        this.noteService.saveNote(this.formGroup.value);
        reminderString += "I took: " + objInRecuest + "\nFrom: " + this.formGroup.value.name;
      }
      if(this.formGroup.value.type == "Loaned"){
        this.noteService.saveLoanedNote(this.formGroup.value);
        this.noteService.saveNote(this.formGroup.value);
        reminderString += "I gave: " + objInRecuest + "\nTo: " + this.formGroup.value.name;
      }

      this.localNotifications.schedule({
        text: reminderString,
        trigger: {at: new Date (this.formGroup.value.notify)},
        led: 'FF0000',
        sound: null
     });
    }else{
      //replace this.note with a new note from the data update
      //how to check if before was borrowed and now loanded...where it should go?
      if(this.formGroup.value.type == "Borrowed"){
        this.noteService.updateBorrowedNote(this.formGroup.value, this.note);
        //if this.note.type was loaned then delete it from loaned list
        this.noteService.updateNote(this.formGroup.value, this.note);
      }
      if(this.formGroup.value.type == "Loaned"){
        this.noteService.updateLoanedNote(this.formGroup.value, this.note);
        //if this.note.type was borrowed then delete it from borrowed list
        this.noteService.updateNote(this.formGroup.value, this.note);
      }
    }
    //saveBorroedNote
    //saveLoandedNote    - check the type and save separately
    this.navCtrl.pop();
  }

  shareNote(){
    let date = this.note.date.split('T')[0];
    let sharableString = "Date: "+  date +  "\n";
    let objInRecuest = this.note.descript;
    if(this.note.descript == "" || this.note.descript == undefined){
      objInRecuest = this.note.amount + " " + this.userCurrency;
    }

    if(this.note.type == "Borrowed" ){
      sharableString += "I took: " + objInRecuest + "\nFrom: " + this.note.name;
    }else{
      sharableString += "I gave: " + objInRecuest + "\nTo: " + this.note.name;
    }
    sharableString += "\n\n\nNote generated with LendHelper";
    this.socialSharing.share(sharableString, null, null, null);

  }

  deleteItem(){
    let alert = this.alertCtrl.create({
      title: 'Remove this note',
      message: 'Are you sure want to delete this note?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Confirm',
          handler: () => {
            this.noteService.deleteItem(this.note);
            this.navCtrl.pop();
          }
        }
      ]
    });
    alert.present();
  }
    

}
