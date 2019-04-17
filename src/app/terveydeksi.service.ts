import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Geolocation, Geoposition, PositionError, GeolocationOptions } from "@ionic-native/geolocation/ngx";
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class TerveydeksiService {
  apiUrl: string = "https://terveydeksi.azurewebsites.net";

  geolocationOptions: GeolocationOptions = {
    enableHighAccuracy: true,
    // Debug
      timeout: 5000,
      maximumAge: 0
    // Production
      //timeout: 60000,
      //maximumAge: 1200000
  };

  // TODO: yritykset-ominaisuudelle voisi määrittää oman tietotyypin.
  // Eli sen tietotyyppi olisikin yritys[] eikä any[].
  // Uusi tietotyyppi pitää luoda sen perusteella mitä REST-api palauttaa.
  // Kirjointin määrittelyn REST-apin repoon. T: Jani
  yritykset: any[];
  httpVirhe: string;

  loginToken: string;
  username: string;

  // Paikannustiedot
  currentLat: number;
  currentLon: number;
  paikannusvirhe: string;
  paikannusvirheDebug: string;

  hakulause: string;

  // Tietojen latausilmoitus
  lataus = async (): Promise<any> => {
    const loading = await this.loadingCtrl.create({
      spinner: "bubbles",
      message: "Ladataan...",
      translucent: true
    });
    await loading.present();
  };
  suljeLataus = (): void => {
    this.loadingCtrl.dismiss();
  };

  // Haetaan yritykset
  haeYritykset = (): void => {
    this.http.get(`${this.apiUrl}/yritykset`).subscribe((data: object[]) => {
      // OK
      this.httpVirhe = null;
      this.yritykset = data;
      this.lajitteleLista();
      this.suljeLataus();
      //console.log(this.yritykset);
    },(error: HttpErrorResponse) => {
      // Virhe
      console.error(error);
      this.httpVirhe = `Voi ei! Jokin meni pieleen yrittäessäni etsiä alueesi palveluntarjoajia. Yritäthän myöhemmin uudelleen? (Virhekoodi: ${error.status})`;
      this.suljeLataus();
    });
  };
  // Paikannetaan käyttäjä ja tallenna nykyinen sijainti
  paikanna = (): void => {
    this.geolocation.getCurrentPosition(this.geolocationOptions).then((result: Geoposition): void => {
      // OK
      this.paikannusvirheDebug = null;
      this.currentLat = result.coords.latitude;
      this.currentLon = result.coords.longitude;

    }).catch((error: PositionError): void => {
      // Virhe
      this.paikannusvirheDebug = error.message;
      switch(error.code){
        case 1:
          // EXPECTED ERROR
          // Tämä tapahtuu myös, jos virhe johtuu salatun yhteyden puutteesta (esim. DevApissa)
          this.paikannusvirhe = "Käyttö estetty. Paikannustiedot eivät ole käytettävissä."
          break;
        case 2:
          this.paikannusvirhe = "Paikannustiedot eivät ole käytettävissä.";
          break;
        case 3:
          this.paikannusvirhe = "Aikakatkaisu. Paikannustiedot eivät ole käytettävissä.";
          break;
        default:
          this.paikannusvirhe = "Määrittämätön virhe. Paikannustiedot eivät ole käytettävissä.";
      }
    });
  };
  lajitteleLista = (vainGPS?: boolean): void => {
    // Jos meillä on hakulause, niin piilotetaan kaikki sen ulkopuoliset
    if(this.hakulause && !vainGPS){
      // TODO
    }

    // Lajitellaan sijainnin mukaan vain, jos meillä on paikannustieto
    if(this.currentLat && this.currentLon){
      // Lasketaan jokaiselle yritykselle etäisyys nykyisestä sijainnista
      // https://stackoverflow.com/questions/365826/calculate-distance-between-2-gps-coordinates
      this.yritykset.forEach((yritys): void => {
        let deltaLat: number = (yritys.lat - this.currentLat) * Math.PI / 180;
        let deltaLon: number = (yritys.lon - this.currentLon) * Math.PI / 180;

        let currentLatRadians: number = this.currentLat * Math.PI / 180;
        let yritysLatRadians: number = yritys.lat * Math.PI / 180;

        // Matka pallon pinnalla
        // Kyllä lukion matematiikan opettaja olisi nyt ylpeä... :D
        let a: number = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) + Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2) * Math.cos(currentLatRadians) * Math.cos(yritysLatRadians);
        let c: number = 2 * Math.atan2(Math.sqrt(a),Math.sqrt(1 - a));

        // Tallennetaan tulos
        yritys.distance = c * 6371; // 6371 km on maapallon säde (r)
      });

      // Sortataan lista
      this.yritykset.sort((a: any, b:any): number => {
        return a.distance - b.distance;
      });
    }
    else{
      setTimeout(this.lajitteleLista.bind(true),1000); // Kokeillaan sekunin kuluttua uudelleen, jos paikannustieto silloin olisi
    }
  };

  constructor(
    private http: HttpClient,
    private geolocation: Geolocation,
    private loadingCtrl: LoadingController
  ){
    this.lataus().then(() => {
      // Lataus valmis
      this.haeYritykset(); // Haetaan yritykset
      this.paikanna(); // Haetaan paikannustieto
    });
  };
};