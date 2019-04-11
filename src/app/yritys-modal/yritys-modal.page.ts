import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
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

  openStreetMap: Map;

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

    // Kun DOM on ladattu
    ionViewDidEnter(){
      // Olipas tämä OpenStreetMap muuten helppo GMapsiin verrattuna.
      // https://leafletjs.com/reference-1.4.0.html
      // TODO: keskitä kartta juuri tähän yritykseen
      this.openStreetMap = new Map(this.mapContainer.nativeElement).setView([this.terveydeksi.currentLat || 60.1733244,this.terveydeksi.currentLon || 24.941024800000037],13);
      tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
        attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery &copy; <a href='https://www.mapbox.com/'>Mapbox</a>",
        maxZoom: 18
      }).addTo(this.openStreetMap);
    };

  constructor(private modalController: ModalController,private terveydeksi: TerveydeksiService){};

  ngOnInit(){};
};
