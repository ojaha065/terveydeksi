import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TerveydeksiService } from '../terveydeksi.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  virheteksti: string;

  username: string;
  password: string;

  kirjaudu = (): void => {
    this.http.post(`${this.terveydeksi.apiUrl}/login`,`username=${this.username}&password=${this.password}`,{
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }).subscribe((response: any): void => { // response tarvitsee oman tietotyypin
      // OK
      //console.log(response);
      if(response.statusCode === 0){
        this.terveydeksi.loginToken = response.token;
        this.terveydeksi.username = this.username;
        this.username = null;
        this.password = null;
      }
      else{
        // Väärä käyttäjätunnus ja/tai salasana
        this.virheteksti = response.status;
      }
    },(error: HttpErrorResponse) => {
      // Virhe
      console.error(error);
    });
  };
  kirjauduUlos = (): void => {
    this.terveydeksi.loginToken = null;
    this.terveydeksi.username = null;
  };

  constructor(private http: HttpClient,private terveydeksi: TerveydeksiService){};
};