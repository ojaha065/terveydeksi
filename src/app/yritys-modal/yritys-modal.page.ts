import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AjanvarausModalPage } from '../ajanvaraus-modal/ajanvaraus-modal.page';
import { TerveydeksiService } from '../terveydeksi.service';

@Component({
  selector: 'app-yritys-modal',
  templateUrl: './yritys-modal.page.html',
  styleUrls: ['./yritys-modal.page.scss']
})
export class YritysModalPage implements OnInit {

  suljeModal = (): void => {
    this.modalController.dismiss();
  };

  varaaAika = async (id: number): Promise<any> => {
    this.terveydeksi.valitunYrityksenID = id;
    const modal = await this.modalController.create({
      component: AjanvarausModalPage
    });
    modal.present();
  };


  constructor(private modalController: ModalController,private terveydeksi: TerveydeksiService){};

  ngOnInit(){};
};
