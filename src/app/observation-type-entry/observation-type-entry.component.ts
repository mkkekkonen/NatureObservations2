import { Component, OnInit, Input } from '@angular/core';

import { ObservationType } from '../models';

@Component({
  selector: 'app-observation-type-entry',
  templateUrl: './observation-type-entry.component.html',
  styleUrls: ['./observation-type-entry.component.scss'],
})
export class ObservationTypeEntryComponent implements OnInit {
  @Input('observationType') observationType: ObservationType;

  constructor() { }

  ngOnInit() {}

}
