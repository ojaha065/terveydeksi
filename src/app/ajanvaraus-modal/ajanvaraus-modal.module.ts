import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { DatePickerModule } from 'ionic4-date-picker';

import { IonicModule } from '@ionic/angular';

import { AjanvarausModalPage } from './ajanvaraus-modal.page';

const routes: Routes = [
  {
    path: '',
    component: AjanvarausModalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatePickerModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AjanvarausModalPage]
})
export class AjanvarausModalPageModule {};