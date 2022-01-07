import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { Repository } from 'typeorm';
import { TranslateService } from '@ngx-translate/core';

import { DbService } from '../db.service';
import { ObservationType } from '../models';

@Component({
  selector: 'app-observation-type-modal',
  templateUrl: './observation-type-modal.page.html',
  styleUrls: ['./observation-type-modal.page.scss'],
})
export class ObservationTypeModalPage implements OnInit {
  observationTypes: ObservationType[] = [];

  selectedTypeName: string = null;

  constructor(
    private dbService: DbService,
    private translateService: TranslateService,
    private modalController: ModalController,
  ) {}

  ngOnInit() {
    this.loadObservationTypes();
  }

  async loadObservationTypes() {
    this.observationTypes = await this.dbService.observationTypeGateway.getAll();
  }

  confirm() {
    if (!this.selectedTypeName) {
      window.alert(this.translateService.instant('MYOBS.SELECTTYPE'));
      return;
    }

    const selectedObservationType = this.observationTypes.find(type => type.name === this.selectedTypeName);

    this.modalController.dismiss({
      observationType: selectedObservationType,
    });
  }

  cancel() {
    this.modalController.dismiss();
  }
}
