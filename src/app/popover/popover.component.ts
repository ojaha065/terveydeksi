import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { TerveydeksiService } from '../terveydeksi.service';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss']
})
export class PopoverComponent implements OnInit {

  constructor(public terveydeksi: TerveydeksiService,public popoverCtrl: PopoverController){};

  ngOnInit(){};
}