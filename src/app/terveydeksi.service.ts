import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class TerveydeksiService {
  apiUrl: string = "https://terveydeksi.azurewebsites.net";

  // TODO: yritykset-ominaisuudelle voisi määrittää oman tietotyypin.
  // Eli sen tietotyyppi olisikin yritys[] eikä object[].
  // Uusi tietotyyppi pitää luoda sen perusteella mitä REST-api palauttaa.
  // Kirjointin määrittelyn REST-apin repoon. T: Jani
  yritykset: object[];

  loginToken: string;
  username: string;

  haeYritykset = (): void => {
    this.http.get(`${this.apiUrl}/yritykset`).subscribe((data: object[]) => {
      // OK
      this.yritykset = data;
      console.info("Yritykset ladattu!");
      //console.log(this.yritykset);
    },(error: any) => {
      // Virhe
      console.error(error);
      // TODO: Parempi virheenkäsittely
    });
  };

  constructor(private http: HttpClient){
    console.info("Ladataan yrityksiä...");
    this.haeYritykset(); // Haetaan yritykset heti kun service ladataan
  };
};