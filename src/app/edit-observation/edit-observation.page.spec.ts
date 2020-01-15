import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditObservationPage } from './edit-observation.page';

describe('EditObservationPage', () => {
  let component: EditObservationPage;
  let fixture: ComponentFixture<EditObservationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditObservationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditObservationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
