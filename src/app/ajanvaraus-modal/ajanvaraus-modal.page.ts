import { Component, OnInit } from '@angular/core';
import { TerveydeksiService } from '../terveydeksi.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-ajanvaraus-modal',
  templateUrl: './ajanvaraus-modal.page.html',
  styleUrls: ['./ajanvaraus-modal.page.scss'],
})
export class AjanvarausModalPage implements OnInit {
  varaus: any = { // Oma tietotyyppi tähän
    pvm: null,
    klo: null,
    palveluntarjoaja: null,
    asiakas: null
  };

  page1: boolean = true;

  pvmValittu = (valittuPvm: Date): void => {
    //console.log(valittuPvm);
    // Tässä kohti pitäisi hakea tiedot, että onko valittuna päivänä vapaata
    this.varaus.pvm = valittuPvm;
  };
  varausSeuraavaNappi = (): void => {
    this.http.get(`${this.terveydeksi.apiUrl}/omatTiedot?token=${this.terveydeksi.loginToken}`).subscribe((response: object) => {
      // OK
      this.varaus.asiakas = response;
    },(error: any) => {
      // Virhe
      console.error(error);
    });

    this.page1 = false;
  };

  constructor(private terveydeksi: TerveydeksiService,private http: HttpClient){};

  ngOnInit() {};
};
