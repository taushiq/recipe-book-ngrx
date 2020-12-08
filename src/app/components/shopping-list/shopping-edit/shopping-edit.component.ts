import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/models/ingredient.model';
import * as ShoppingListActions from '../store/shopping.list.actions';
import * as fromShoppingList from '../store/shopping-list.reducer';
import * as fromApp from '../../../store/app.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  // @ViewChild('name', { static: false }) nameInputRef: ElementRef;
  // @ViewChild('amount', { static: false }) amountInputRef: ElementRef;
  subscription: Subscription;
  editMode = false;
  editedIngredient: Ingredient;
  @ViewChild('f' , { static: false }) myForm: NgForm;

  constructor( private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this. subscription = this.store.select('shoppingList').subscribe(stateData => {
      if(stateData.editedIngredientIndex > -1){
        this.editMode = true;
        this.editedIngredient = stateData.editedIngredient;
        this.myForm.setValue({
          name: this.editedIngredient.name,
          amount: this.editedIngredient.amount
        });
      }else{
        this.editMode = false;
      }
    });
    // this.subscription = this.slService.onStartedEditing
    // .subscribe(
    //   (index: number) => {
    //     this.editMode = true;
    //     this.editedItemIndex = index;
    //     this.editedIngredient = this.slService.getIngredient(index);
    //     this.myForm.setValue({
    //       name: this.editedIngredient.name,
    //       amount: this.editedIngredient.amount
    //     });
    //   }
    // );
  }

  onSubmit(form: NgForm): void{
    const value = form.value;
    // const name = this.nameInputRef.nativeElement.value;
    // const amount = this.amountInputRef.nativeElement.value;
    let ingredient = new Ingredient(value.name , value.amount)
    if(this.editMode){
      // this.slService.updateIngredient(this.editedItemIndex , ingredient);
      this.store.dispatch(new ShoppingListActions.UpdateIngredient(ingredient));
    }else{
      //this.slService.addIngredient(ingredient);
      this.store.dispatch(new ShoppingListActions.AddIngredient(ingredient));
    }
    this.editMode = false;
    form.reset();
  }

  onClear(){
    this.editMode = false;
    this.myForm.reset();
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  onDelete(){
    //this.slService.deleteIngredient(this.editedItemIndex);
    this.store.dispatch(new ShoppingListActions.DeleteIngredient());
    this.onClear();
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }


}
