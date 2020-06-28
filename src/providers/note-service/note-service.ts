import { Injectable } from '@angular/core';
import {Storage} from '@ionic/storage';

@Injectable()
export class NoteServiceProvider {

  private notes = [];
  private loanedNotes = [];
  private borrowedNotes = [];
  private oldNote;

  constructor(private storage: Storage) {
  }

  setCurrency(currency){
    this.storage.remove('currency');
    this.storage.set('currency', currency);
  }

  getCurrency(){
    return this.storage.get('currency');
  }

  saveNote(note){
    this.notes.push(note);
    this.storage.set('notes', this.notes);

  }

  deleteItem(note){
    this.notes = this.notes.filter(s => s !== note);
    this.storage.set('notes', this.notes);
  }

  updateNote(note, previousNote){
    //replace previousNote with note
   //this.oldNote =  this.notes.find(n => n == previousNote);
   this.oldNote = this.notes.map(obj =>{ if(obj == previousNote){return note}else{return obj}});
   this.storage.set('notes', this.oldNote);

  }
  updateBorrowedNote(note, previousNote){
    this.storage.set(previousNote.key, note);
  }
  updateLoanedNote(note, previousNote){
    this.storage.set(previousNote.key, note);

  }

  saveBorrowedNote(note){
    this.borrowedNotes.push(note);
    this.storage.set('borrowed-notes', this.borrowedNotes);

  }

  saveLoanedNote(note){
    this.loanedNotes.push(note);
    this.storage.set('loaned-notes', this.loanedNotes);

  }


  getAllNotes(){
    return this.storage.get('notes').then(
      (notes)=>{
        this.notes = notes == null ? [] : notes;
        return [...this.notes];
      }
    );
  }

  getAllBorrowedNotes(){
    return this.storage.get('borrowed-notes').then(
      (borrowedNotes)=>{
        this.borrowedNotes = borrowedNotes == null ? [] : borrowedNotes;
        return [...this.borrowedNotes];
      }
    );

  }

  getAllLoanedNotes(){
    return this.storage.get('loaned-notes').then(
      (loanedNotes)=>{
        this.loanedNotes = loanedNotes == null ? [] : loanedNotes;
        return [...this.loanedNotes];
      }
    );
  }
}
