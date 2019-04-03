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
  // Eli sen tietotyyppi olisikin yritys[] eikä object[].
  // Uusi tietotyyppi pitää luoda sen perusteella mitä REST-api palauttaa.
  // Kirjointin määrittelyn REST-apin repoon. T: Jani
  yritykset: object[];

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
    this.geolocation.getCurrentPosition(this.geolocationOptions).then((result: Geoposition) => {
      // OK
      this.paikannusvirheDebug = null;
      this.currentLat = result.coords.latitude;
      this.currentLon = result.coords.longitude;

    }).catch((error: PositionError) => {
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
    // Tässä pitäisi lajitella lista
  };

  constructor(private http: HttpClient,private geolocation: Geolocation){
    console.info("Ladataan yrityksiä...");
    this.haeYritykset(); // Haetaan yritykset heti kun service ladataan
    this.paikanna(); // Haetaan paikannustieto
  };
};