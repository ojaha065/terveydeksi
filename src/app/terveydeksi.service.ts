import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Geolocation, Geoposition, PositionError, GeolocationOptions } from "@ionic-native/geolocation/ngx";

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

  loginToken: string;
  username: string;

  // Paikannustiedot
  currentLat: number;
  currentLon: number;
  paikannusvirhe: string;
  paikannusvirheDebug: string;

  haeYritykset = (): void => {
    this.http.get(`${this.apiUrl}/yritykset`).subscribe((data: object[]) => {
      // OK
      this.yritykset = data;
      console.info("Yritykset ladattu!");
      this.lajitteleLista();
      //console.log(this.yritykset);
    },(error: any) => {
      // Virhe
      console.error(error);
      // TODO: Parempi virheenkäsittely
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
          // Tämä tapahtuu myös, jos virhe johtuu salatun yhteyden puutteesta (esim. DevApissa)
          //this.paikannusvirhe = "Käyttö estetty. Paikannustiedot eivät ole käytettävissä."
          
          // Debug
            this.paikannusvirhe = null;
            // Mikkelin koordinaatit
            this.currentLat = 60.1733244;
            this.currentLon = 24.941024800000037;

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
  lajitteleLista = (): void => {
    // Lajitellaan vain, jos meillä on paikannustieto
    if(this.currentLat && this.currentLon){
      // Lasketaan jokaiselle yritykselle etäisyys nykyisestä sijainnista
      // https://stackoverflow.com/questions/365826/calculate-distance-between-2-gps-coordinates
      this.yritykset.forEach((yritys) => {
        let deltaLat = (yritys.lat - this.currentLat) * Math.PI / 180;
        let deltaLon = (yritys.lon - this.currentLon) * Math.PI / 180;

        let currentLatRadians = this.currentLat * Math.PI / 180;
        let yritysLatRadians = yritys.lat * Math.PI / 180;

        // Matka pallon pinnalla
        // Kyllä lukion matematiikaan opettaja olisi nyt ylpeä... :D
        let a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) + Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2) * Math.cos(currentLatRadians) * Math.cos(yritysLatRadians);
        let c = 2 * Math.atan2(Math.sqrt(a),Math.sqrt(1 - a));

        // Tallennetaan tulos
        yritys.distance = c * 6371; // 6371 km on maapallon säde (r)
      });

      // Sortataan lista
      this.yritykset.sort((a: any, b:any): number => {
        return a.distance - b.distance;
      });
    }
    else{
      setTimeout(this.lajitteleLista,1000); // Kokeillaan sekunin kuluttua uudelleen, jos paikannustieto silloin olisi
    }
  };

  constructor(private http: HttpClient,private geolocation: Geolocation){
    console.info("Ladataan yrityksiä...");
    this.haeYritykset(); // Haetaan yritykset heti kun service ladataan
    this.paikanna(); // Haetaan paikannustieto
  };
};