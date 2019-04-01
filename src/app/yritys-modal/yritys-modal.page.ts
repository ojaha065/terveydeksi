import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-yritys-modal',
  templateUrl: './yritys-modal.page.html',
  styleUrls: ['./yritys-modal.page.scss']
})
export class YritysModalPage implements OnInit {

  suljeModal() {
    this.modalController.dismiss();
  }

  constructor(private modalController: ModalController){};

  ngOnInit(){};
};
