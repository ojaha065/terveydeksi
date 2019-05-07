import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Geolocation, Geoposition, PositionError, GeolocationOptions } from "@ionic-native/geolocation/ngx";
import { LoadingController, Platform, ToastController } from '@ionic/angular';
import { SQLite, SQLiteObject} from "@ionic-native/sqlite/ngx";

@Injectable({
  providedIn: 'root'
})
export class TerveydeksiService {
  apiUrl: string = "https://terveydeksi.azurewebsites.net";

  geolocationOptions: GeolocationOptions = {
    enableHighAccuracy: true,
    // Debug
      //timeout: 5000,
      //maximumAge: 0
    // Production
      timeout: 60000,
      maximumAge: 1200000
  };

  yritykset: any[];
  piilotetutYritykset: any[] = [];
  httpVirhe: string;
  db: SQLiteObject; // Tietokantayhteys

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
      message: "Ladataan...(Tämä voi kestää hetken #blameAzure)",
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

      // Varmistetaan, että joka paikannuskerralla sijainti on hieman eri, jotta kartta toimii oikein
      // Huono ratkaisu, mutta toimii.
      this.currentLat += Math.random() * 0.0001;

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
    // Palautetaan kaikki yritykset näkyviin
    if(!vainGPS){
      this.piilotetutYritykset.forEach((yritys) => {
        this.yritykset.push(yritys);
      });
      this.piilotetutYritykset = [];
    }

    // Jos meillä on hakulause, niin piilotetaan kaikki sen ulkopuoliset
    // Muutoin näytetään kaikki
    if(this.hakulause && !vainGPS){
      let hakulauseUpper: string = this.hakulause.toUpperCase();
      // For-looppi on "takeperin", jotta yritysten poistaminen ei vaikuta indekseihin
      for(let i: number = this.yritykset.length - 1;i >= 0;i--){
        if(!(this.yritykset[i].postitoimipaikka.toUpperCase() === hakulauseUpper)){
          this.piilotetutYritykset.push(this.yritykset[i]);
          this.yritykset.splice(i,1);
        }
      }
    }

    // Lajitellaan sijainnin mukaan vain, jos meillä on paikannustieto
    if(this.currentLat && this.currentLon){
      // Lasketaan jokaiselle yritykselle etäisyys nykyisestä sijainnista
      // https://stackoverflow.com/questions/365826/calculate-distance-between-2-gps-coordinates
      this.yritykset.forEach((yritys: any): void => {
        let deltaLat: number = (yritys.lat - this.currentLat) * Math.PI / 180;
        let deltaLon: number = (yritys.lon - this.currentLon) * Math.PI / 180;

        let currentLatRadians: number = this.currentLat * Math.PI / 180;
        let yritysLatRadians: number = yritys.lat * Math.PI / 180;

        // Matka pallon pinnalla
        // Kyllä lukion matematiikan opettaja olisi nyt ylpeä... :D
        // Ja minä olin väärässä siinä, että ei näitä ikinä oikeasti tarvitse missään...
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
      // Kokeillaan sekunin kuluttua uudelleen, jos paikannustieto silloin olisi
      setTimeout(() => {
        this.lajitteleLista(true);
      },1000);
    }
  }; // LajitteleLista loppuu

  // Toastaa viestejä
  toast = async(message: string): Promise<any> => {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: "bottom"
    });
    toast.present();
  };

  //SQLite
  tietokantayhteys = async (): Promise<any> => {
    if(!this.db){
      try{   
        this.db = await this.sqlite.create({
          name: "data.db",
          location: "default"
        });   
        if(this.db){
          //await this.db.executeSql("DROP TABLE IF EXISTS userinfo;",[]);
          await this.db.executeSql("CREATE TABLE IF NOT EXISTS userinfo(token TEXT,username TEXT);",[]);
          let result = await this.db.executeSql("SELECT * FROM userinfo;",[]);
          if(result.rows.length > 0){
            let rivi: any = result.rows.item(0);
            this.loginToken = rivi.token;
            this.username = rivi.username;
            this.toast(`Tervetuloa takaisin, ${this.username}`)
          }
        }
      }
      catch(error){
        this.toast(error.message);
      }
    }
  };
  tallennaKirjautuminen = async (uloskirjautuminen: boolean): Promise<any> => {
    if(this.db){
      try {
        if(uloskirjautuminen){
          await this.db.executeSql("DELETE FROM userinfo;", []); // Tyhjentää koko taulun
        }
        else{
          await this.db.executeSql("INSERT INTO userinfo VALUES (?,?);",[this.loginToken,this.username]);
        }
      }
      catch(error){
        this.toast(error.message);
      }
    }
  };

  constructor(
    private http: HttpClient,
    private geolocation: Geolocation,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private platform: Platform,
    private sqlite: SQLite
  ){
    this.platform.ready().then((): void => {
      this.lataus().then(() => {
        // Lataus valmis
        if(this.platform.is("android") || this.platform.is("cordova")){ // Ei turhaan yritetä avata tietokantayhteyttä selainympäristössä
          this.tietokantayhteys();
        }
        this.haeYritykset(); // Haetaan yritykset
        this.paikanna(); // Haetaan paikannustieto
      });
    }).catch((error: Error) => {
      console.error(error);
    });
  };
};