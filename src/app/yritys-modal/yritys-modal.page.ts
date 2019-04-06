import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AjanvarausModalPage } from '../ajanvaraus-modal/ajanvaraus-modal.page';

@Component({
  selector: 'app-yritys-modal',
  templateUrl: './yritys-modal.page.html',
  styleUrls: ['./yritys-modal.page.scss']
})
export class YritysModalPage implements OnInit {

  suljeModal = (): void => {
    this.modalController.dismiss();
  };

  varaaAika = async (): Promise<any> => {
    const modal = await this.modalController.create({
      component: AjanvarausModalPage
    });
    modal.present();
  };


  constructor(private modalController: ModalController){};

  ngOnInit(){};
};
