import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ObservationTypeModalPage } from './observation-type-modal.page';

describe('ObservationTypeModalPage', () => {
  let component: ObservationTypeModalPage;
  let fixture: ComponentFixture<ObservationTypeModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObservationTypeModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ObservationTypeModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
