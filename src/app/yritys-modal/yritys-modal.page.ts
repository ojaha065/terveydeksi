import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { AjanvarausModalPage } from '../ajanvaraus-modal/ajanvaraus-modal.page';
import { TerveydeksiService } from '../terveydeksi.service';
import { Map, latLng, tileLayer, Layer, marker, Icon } from "leaflet";

@Component({
  selector: 'app-yritys-modal',
  templateUrl: './yritys-modal.page.html',
  styleUrls: ['./yritys-modal.page.scss']
})
export class YritysModalPage implements OnInit {
  @ViewChild("openStreetMap") mapContainer: any;
  yritys: any = this.navParams.get("yritys");

  openStreetMap: Map;

  suljeModal = (): void => {
    this.modalController.dismiss();
  };

  varaaAika = async (id: number): Promise<any> => {
    const modal = await this.modalController.create({
      component: AjanvarausModalPage,
      componentProps: {
        yritys: this.yritys
      }
    });
    modal.present();
  };

    // Kun DOM on ladattu
    ionViewDidEnter(){
      // Olipas tämä OpenStreetMap muuten helppo GMapsiin verrattuna.
      // https://leafletjs.com/reference-1.4.0.html
      this.openStreetMap = new Map(this.mapContainer.nativeElement).setView([this.yritys.lat,this.yritys.lon],16);
      tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
        attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery &copy; <a href='https://www.mapbox.com/'>Mapbox</a>",
        maxZoom: 20
      }).addTo(this.openStreetMap);

      // Markkeri
      let karttamerkki = marker([this.yritys.lat,this.yritys.lon],{
        title: this.yritys.nimi,
        alt: this.yritys.nimi
      });

      karttamerkki.options.icon.options.iconRetinaUrl = "assets/leaflet/marker-icon-2x.png";
      karttamerkki.options.icon.options.shadowUrl = "assets/leaflet/marker-shadow.png";

      karttamerkki.addTo(this.openStreetMap);
    };


  constructor(
    private modalController: ModalController,
    public terveydeksi: TerveydeksiService,
    private navParams: NavParams
  ){};

  ngOnInit(){};
};
