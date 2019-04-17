import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TerveydeksiService } from '../terveydeksi.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  hae = () => {
    this.router.navigateByUrl("/tabs/tab2");
  };

  constructor(public terveydeksi: TerveydeksiService,private router: Router){};
};