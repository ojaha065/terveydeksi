import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { TerveydeksiService } from '../terveydeksi.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-ajanvaraus-modal',
  templateUrl: './ajanvaraus-modal.page.html',
  styleUrls: ['./ajanvaraus-modal.page.scss']
})
export class AjanvarausModalPage implements OnInit {
  yritys: any = this.navParams.get("yritys"); // Oma tietotyyppi tähän
  today: Date = new Date();

  varaus: any = { // Oma tietotyyppi tähän
    valittuDate: null,
    valittuDatePinta: null,
    klo: null,
    palveluntarjoaja: {
      id: this.yritys.id,
      nimi: this.yritys.nimi,
      osoite: `${this.yritys.katuosoite}\n${this.yritys.postinumero} ${this.yritys.postitoimipaikka}`
    },
    asiakas: null
  };

  page1: boolean = true;
  seuraavaNappiDisabloitu: boolean = false;

  pvmValittu = (valittuPvm: Date): void => {
    //console.log(valittuPvm);
    // Tässä kohti pitäisi hakea tiedot, että onko valittuna päivänä vapaata
    this.varaus.valittuDate = valittuPvm;
    this.varaus.valittuDatePinta = `${valittuPvm.getDate()}.${valittuPvm.getMonth()}.${valittuPvm.getFullYear()}`;
  };
  varausSeuraavaNappi = (): void => {
    this.seuraavaNappiDisabloitu = true;
    if(this.page1){
      this.http.get(`${this.terveydeksi.apiUrl}/omatTiedot?token=${this.terveydeksi.loginToken}`).subscribe((response: object): void => {
        // OK
        this.varaus.asiakas = response[0];
        this.page1 = false;
        this.seuraavaNappiDisabloitu = false;
      },(error: HttpErrorResponse): void => {
        // Virhe
        this.terveydeksi.toast(`Virhekoodi ${error.status}! Yritä myöhemmin uudelleen.`)
        console.error(`${error.status}: ${error.statusText}`);
        this.seuraavaNappiDisabloitu = false;
      });

      let kellonaika = new Date(this.varaus.klo); // Säädetään aikaleimaa valitun kellonajan mukaan
      this.varaus.valittuDate.setHours(kellonaika.getHours(),kellonaika.getMinutes());
    }
    else{
      this.http.post(`${this.terveydeksi.apiUrl}/tallennaAjanvaraus`,{
        token: this.terveydeksi.loginToken,
        yritysID: this.varaus.palveluntarjoaja.id,
        timestamp: this.varaus.valittuDate.getTime() / 1000 // UNIX-aikaleima
      }).subscribe((): void => {
        // OK
        this.terveydeksi.toast("Varaus tallennettu onnistuneesti.")
        this.page1 = true;
        this.modalController.dismiss();
      },(error: HttpErrorResponse): void => {
        console.error(`${error.status}: ${error.statusText}`);
        this.terveydeksi.toast(`Virhekoodi ${error.status}! Varausta ei tallennettu. Yritä myöhemmin uudelleen.`);
        this.seuraavaNappiDisabloitu = false;
      });
    }
  };

  constructor(
    private modalController: ModalController,
    private terveydeksi: TerveydeksiService,
    private http: HttpClient,
    private navParams: NavParams,
  ){};

  ngOnInit(){};
};
