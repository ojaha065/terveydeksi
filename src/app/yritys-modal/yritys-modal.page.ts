import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { AjanvarausModalPage } from '../ajanvaraus-modal/ajanvaraus-modal.page';
import { TerveydeksiService } from '../terveydeksi.service';
import { Map, tileLayer, marker, icon } from "leaflet";
import { CallNumber } from '@ionic-native/call-number/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-yritys-modal',
  templateUrl: './yritys-modal.page.html',
  styleUrls: ['./yritys-modal.page.scss']
})
export class YritysModalPage implements OnInit {
  @ViewChild("openStreetMap") mapContainer: any;
  yritys: any = this.navParams.get("yritys");

  openStreetMap: Map;

  varaaAika = async (): Promise<any> => {
    const modal = await this.modalController.create({
      component: AjanvarausModalPage,
      componentProps: {
        yritys: this.yritys
      }
    });
    modal.present();
  };

  kirjauduNappi = (): void => {
    this.router.navigateByUrl("/tabs/tab3");
    this.modalController.dismiss();
  };

  // Kun DOM on ladattu
  ionViewDidEnter(){
    // Olipas tämä OpenStreetMap muuten helppo GMapsiin verrattuna.
    // https://leafletjs.com/reference-1.4.0.html
    this.openStreetMap = new Map(this.mapContainer.nativeElement).setView([this.yritys.lat,this.yritys.lon],16);
    tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
      attribution: "Karttatiedot &copy; OpenStreetMap, CC-BY-SA, Kuvitus &copy; Mapbox",
      maxZoom: 20
    }).addTo(this.openStreetMap);

    // Markkeri
    let karttamerkki = marker([this.yritys.lat,this.yritys.lon],{
      icon: icon({
        iconSize: [25,41],
        iconAnchor: [13,41],
        iconUrl: "assets/marker-icon.png",
        shadowUrl: "assets/marker-icon.png",
        iconRetinaUrl: "assets/marker-icon-2x.png"
      }),
      title: this.yritys.nimi,
      alt: this.yritys.nimi
    });

    karttamerkki.addTo(this.openStreetMap);
  };

  soitaNyt() {
    // HUOM! Puhelinsoitto toimii muuten, mutta sitä ei kannata nyt käyttää
    // demoversiossa, jotta vältyttäisiin vahinkosoitoilta.
    //this.callNumber.callNumber(this.yritys.puhelinnumero, false).catch((error: string) => {
      //this.terveydeksi.toast(error);
    //});
    this.terveydeksi.toast("Tämä on vain demoversio, nämä eivät ole oikeita yrityksiä!");
  };

  constructor(
    public modalController: ModalController,
    private router: Router,
    public terveydeksi: TerveydeksiService,
    private navParams: NavParams,
    private callNumber: CallNumber
  ){};

  ngOnInit(){};
};
