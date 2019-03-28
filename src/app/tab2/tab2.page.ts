import { Component } from '@angular/core';
import { TerveydeksiService } from '../terveydeksi.service';
import { ModalController } from '@ionic/angular';
import { YritysModalPage } from '../yritys-modal/yritys-modal.page';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  avaaYritysModal = async (yritys: object): Promise<any> => {
    const modal = await this.modalController.create({
      component: YritysModalPage,
      componentProps: {
        yritys: yritys
      }
    });
    modal.present();
  };

  constructor(private terveydeksi: TerveydeksiService,private modalController: ModalController){};
};