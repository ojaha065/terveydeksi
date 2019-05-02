import { Component, ViewChild } from '@angular/core';
import { TerveydeksiService } from '../terveydeksi.service';
import { ModalController, Platform, NavController, PopoverController } from '@ionic/angular';
import { YritysModalPage } from '../yritys-modal/yritys-modal.page';
import { Map, tileLayer, marker, icon } from "leaflet";
import { Subscription } from 'rxjs';
import { PopoverComponent } from '../popover/popover.component';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  subscription: Subscription;
  mapInterval: any;
  yritysModalAuki: boolean = false;
  ylapalkki: boolean = false;
  ionViewWillLeave(){
    this.subscription.unsubscribe();
    if(this.mapInterval){
      clearInterval(this.mapInterval);
    }
  };

  // Haetaan elementti sivulta
  @ViewChild("openStreetMap") mapContainer: any;

  openStreetMap: Map;
  lastGeolocationLat: number;
  hakulauseMuisti: string;
  locateButtonPainettu: boolean = false;

  // Tätä käytetään vain yläpalkin kentässä, ns. "virallinen" hakulause on servicessä.
  hakulause: string;

  avaaYritysModal = async (yritys: object): Promise<any> => {
    const modal = await this.modalController.create({
      component: YritysModalPage,
      componentProps: {
        yritys: yritys
      }
    });
    this.yritysModalAuki = true;
    modal.onDidDismiss().then((): void => {
      this.yritysModalAuki = false;
    });
    modal.present();
  };

  showAll = (): void => {
    this.terveydeksi.hakulause = null;
    this.terveydeksi.lajitteleLista();
  };

  // Kun DOM on ladattu
  ionViewDidEnter(){
    // Palaa etusivulle back-buttonilla
    this.subscription = this.platform.backButton.subscribe((): void => {
      if(this.yritysModalAuki){
        this.navController.pop();
      }
      else{
        this.navController.navigateRoot("/");
      }
    });

    // Olipas tämä OpenStreetMap muuten helppo GMapsiin verrattuna.
    // https://leafletjs.com/reference-1.4.0.html
    if(!this.openStreetMap){
      this.openStreetMap = new Map(this.mapContainer.nativeElement).setView([this.terveydeksi.currentLat || 60.1733244,this.terveydeksi.currentLon || 24.941024800000037],13);
      this.lastGeolocationLat = this.terveydeksi.currentLat || 60.1733244;
      tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
        attribution: "Karttatiedot &copy; OpenStreetMap, CC-BY-SA, Kuvitus &copy; Mapbox",
        maxZoom: 18
      }).addTo(this.openStreetMap);
      this.mapInterval = setInterval(this.updateMap,2500);
      setTimeout(this.lataaYritystenMerkit,2000);
    }
    else{
      // Kartta on jo olemassa, aloitetaan vain päivitys-looppi
      this.mapInterval = setInterval(this.updateMap,2500);
    }

    this.ylapalkki = false;
    this.hakulause = this.terveydeksi.hakulause;
  }; // ionViewDidEnter loppuu

  lataaYritystenMerkit = (bugfix?: boolean): void => {
    if(this.terveydeksi.yritykset){
      // Yritykset on jo ladattu
      this.terveydeksi[bugfix ? "piilotetutYritykset" : "yritykset"].forEach((yritys: any) => {
        let thisMarker = marker([yritys.lat,yritys.lon],{
          // Markerin asetukset
          icon: icon({
            iconSize: [25,41],
            iconAnchor: [13,41],
            iconUrl: "assets/marker-icon.png",
            shadowUrl: "assets/marker-icon.png"
          }),
          title: yritys.nimi,
          alt: yritys.nimi,
          riseOnHover: true
        });
        thisMarker.addTo(this.openStreetMap);
        thisMarker.on("click",() => {
          this.avaaYritysModal(yritys);
        });
      });
      if(!bugfix){
        this.lataaYritystenMerkit(true);
      }
    }
    else{
      // Yrityksiä ei ole vielä ladattu
      setTimeout(this.lataaYritystenMerkit,1000);
    }
  };
  updateMap = (): void => {
    // Siirretään kartta haettuun kaupunkiin
    if(this.terveydeksi.hakulause && this.hakulauseMuisti !== this.terveydeksi.hakulause && this.terveydeksi.yritykset[0]){
      this.hakulauseMuisti = this.terveydeksi.hakulause;
      this.openStreetMap.flyTo([this.terveydeksi.yritykset[0].lat,this.terveydeksi.yritykset[0].lon],12);
    }
    else if((!this.terveydeksi.hakulause || this.locateButtonPainettu) && this.lastGeolocationLat !== this.terveydeksi.currentLat){
      // Sijainti on muuttunut
      this.locateButtonPainettu = false;
      this.lastGeolocationLat = this.terveydeksi.currentLat;
      this.openStreetMap.flyTo([this.terveydeksi.currentLat || 60.1733244,this.terveydeksi.currentLon || 24.941024800000037]);
      this.terveydeksi.lajitteleLista();
    }
  };
  locateButton = (): void => {
    this.locateButtonPainettu = true;
    this.terveydeksi.paikanna();
    this.lastGeolocationLat = -1;
  };

  toggleHaku = (): void => {
    this.ylapalkki = !this.ylapalkki;
  };
  hae = (): void => {
    this.terveydeksi.hakulause = this.hakulause;
    this.terveydeksi.lajitteleLista();
    this.ylapalkki = false;
  };
  
  //Popover suodatin
  avaaPopover = async (): Promise<any> => {
    const popover = await this.popoverCtrl.create({
      component: PopoverComponent,
      translucent: false
    });
    popover.present();
  };

  constructor(
    public terveydeksi: TerveydeksiService,
    private modalController: ModalController,
    private platform: Platform,
    private navController: NavController,
    private popoverCtrl: PopoverController
  ){};
};