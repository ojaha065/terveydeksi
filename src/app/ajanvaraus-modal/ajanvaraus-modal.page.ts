import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { TerveydeksiService } from '../terveydeksi.service';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-ajanvaraus-modal',
  templateUrl: './ajanvaraus-modal.page.html',
  styleUrls: ['./ajanvaraus-modal.page.scss']
})
export class AjanvarausModalPage implements OnInit {
  yritys: any = this.navParams.get("yritys"); // Oma tietotyyppi tähän

  varaus: any = { // Oma tietotyyppi tähän
    aikaleima: null,
    klo: null,
    palveluntarjoaja: {
      id: this.yritys.id,
      nimi: this.yritys.nimi,
      osoite: `${this.yritys.katuosoite}\n${this.yritys.postinumero} ${this.yritys.postitoimipaikka}`
    },
    asiakas: null
  };

  page1: boolean = true;

  pvmValittu = (valittuPvm: Date): void => {
    //console.log(valittuPvm);
    // Tässä kohti pitäisi hakea tiedot, että onko valittuna päivänä vapaata
    this.varaus.aikaleima = valittuPvm;
  };
  varausSeuraavaNappi = (): void => {
    if(this.page1){
      this.http.get(`${this.terveydeksi.apiUrl}/omatTiedot?token=${this.terveydeksi.loginToken}`).subscribe((response: object): void => {
        // OK
        this.varaus.asiakas = response;
      },(error: HttpErrorResponse): void => {
        // Virhe
        console.error(`${error.status}: ${error.statusText}`);
      });

      let kellonaika = new Date(this.varaus.klo); // Säädetään aikaleimaa valitun kellonajan mukaan
      this.varaus.aikaleima.setHours(kellonaika.getHours(),kellonaika.getMinutes());
      this.page1 = false;
    }
    else{
      this.http.post(`${this.terveydeksi.apiUrl}/tallennaAjanvaraus`,{
        token: this.terveydeksi.loginToken,
        yritysID: this.varaus.palveluntarjoaja.id,
        timestamp: this.varaus.aikaleima.getTime() / 1000 // UNIX-aikaleima
      }).subscribe((response: HttpResponse<any>): void => {
        // OK
        this.terveydeksi.toast("Varaus tallennettu onnistuneesti.")
        this.page1 = true;
        this.modalController.dismiss();
      },(error: HttpErrorResponse): void => {
        console.error(`${error.status}: ${error.statusText}`);
        this.terveydeksi.toast(`Virhekoodi ${error.status}! Varausta ei tallennettu. Yritä myöhemmin uudelleen.`)
      });
    }
  };

  constructor(
    private terveydeksi: TerveydeksiService,
    private http: HttpClient,
    private navParams: NavParams,
    private modalController: ModalController
  ){};

  ngOnInit(){};
};
