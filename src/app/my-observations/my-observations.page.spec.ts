import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MyObservationsPage } from './my-observations.page';

describe('MyObservationsPage', () => {
  let component: MyObservationsPage;
  let fixture: ComponentFixture<MyObservationsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyObservationsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MyObservationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
