import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViewObservationPage } from './view-observation.page';

describe('ViewObservationPage', () => {
  let component: ViewObservationPage;
  let fixture: ComponentFixture<ViewObservationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewObservationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewObservationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
