import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-credits',
  templateUrl: './credits.page.html',
  styleUrls: ['./credits.page.scss'],
})
export class CreditsPage implements OnInit {

  credits = [
    {
      name: 'Freepik',
      url: 'https://www.flaticon.com/authors/freepik',
    },
    {
      name: 'Iconixar',
      url: 'https://www.flaticon.com/authors/iconixar',
    },
    {
      name: 'Pixel Buddha',
      url: 'https://www.flaticon.com/authors/pixel-buddha',
    },
    {
      name: 'Pixel Perfect',
      url: 'https://www.flaticon.com/authors/pixel-perfect',
    },
    {
      name: 'https://www.flaticon.com/authors/twitter',
      url: 'Twitter',
    },
  ];

  constructor() { }

  ngOnInit() {
  }

}
