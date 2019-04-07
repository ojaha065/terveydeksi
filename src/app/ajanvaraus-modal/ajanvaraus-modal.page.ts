import { Component, OnInit } from '@angular/core';
import { TerveydeksiService } from '../terveydeksi.service';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-ajanvaraus-modal',
  templateUrl: './ajanvaraus-modal.page.html',
  styleUrls: ['./ajanvaraus-modal.page.scss']
})
export class AjanvarausModalPage implements OnInit {
  varaus: any = { // Oma tietotyyppi tähän
    aikaleima: null,
    klo: null,
    palveluntarjoaja: null,
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

      // Säädetään aikaleimaa valitun kellonajan mukaan
      let kellonaika = new Date(this.varaus.klo);
      console.log(kellonaika);
      this.varaus.aikaleima.setHours(kellonaika.getHours(),kellonaika.getMinutes());
      this.page1 = false;
    }
    else{
      this.http.post(`${this.terveydeksi.apiUrl}/tallennaAjanvaraus`,{
        token: this.terveydeksi.loginToken,
        yritysID: this.terveydeksi.valitunYrityksenID,
        timestamp: this.varaus.aikaleima.getTime() / 1000 // UNIX-aikaleima
      }).subscribe((response: HttpResponse<any>): void => {
        // OK
        // Tässä pitäisi kertoa onnistuneesta varauksesta (esim. Toast-ilmoitus)
        this.page1 = true;
      },(error: HttpErrorResponse): void => {
        console.error(`${error.status}: ${error.statusText}`);
      });
    }
  };

  constructor(private terveydeksi: TerveydeksiService,private http: HttpClient){};

  ngOnInit(){};
};
