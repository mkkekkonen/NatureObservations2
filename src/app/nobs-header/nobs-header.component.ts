import { Component, OnInit, Input } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-nobs-header',
  templateUrl: './nobs-header.component.html',
  styleUrls: ['./nobs-header.component.scss'],
})
export class NobsHeaderComponent implements OnInit {
  @Input('text') text: string;
  @Input('rightSideButtonIcon') rightSideButtonIcon?: string;
  @Input('rightSideButtonFunc') rightSideButtonFunc?: () => void;

  constructor(private menu: MenuController) { }

  ngOnInit() {}

  openMenu() {
    this.menu.open('menu');
  }
}
