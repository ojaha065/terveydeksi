import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TerveydeksiService } from '../terveydeksi.service';
import { Subscription } from 'rxjs';
import { Platform, NavController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  // Palaa etusivulle
  subscription: Subscription;
  ionViewDidEnter(){
    // Palaa etusivulle back-buttonilla
    this.subscription = this.platform.backButton.subscribe((): void => {
      this.navController.navigateRoot("/");
    });
  };
  ionViewWillLeave(){
    this.subscription.unsubscribe();
  };

  virheteksti: string;

  username: string;
  password: string;

  nappiDisabloitu: boolean = false;

  kirjaudu = (): void => {
    this.nappiDisabloitu = true;
    this.terveydeksi.lataus().then((): void => {
      this.http.post(`${this.terveydeksi.apiUrl}/login`,`username=${this.username}&password=${this.password}`,{
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }).subscribe((response: any): void => { // response tarvitsee oman tietotyypin
        // OK
        //console.log(response);
        if(response.statusCode === 0){
          this.virheteksti = null;
          this.terveydeksi.loginToken = response.token;
          this.terveydeksi.username = this.username;
          this.username = null;
          this.password = null;
          this.terveydeksi.toast("Kirjautuminen onnistui!");
        }
        else{
          // Väärä käyttäjätunnus ja/tai salasana
          this.virheteksti = response.status;
        }
        this.nappiDisabloitu = false;
        this.terveydeksi.suljeLataus();
      },(error: HttpErrorResponse) => {
        // Virhe
        console.error(error);
        this.nappiDisabloitu = false;
        this.terveydeksi.suljeLataus();
      });
    });
  };
  kirjauduUlos = (): void => {
    this.terveydeksi.loginToken = null;
    this.terveydeksi.username = null;
    this.terveydeksi.toast("Sinut kirjattiin ulos.");
  };

  constructor(
    public terveydeksi: TerveydeksiService,
    private http: HttpClient,
    private platform: Platform,
    private navController: NavController
  ){};
};