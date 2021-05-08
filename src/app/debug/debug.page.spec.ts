import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DebugPage } from './debug.page';

describe('DebugPage', () => {
  let component: DebugPage;
  let fixture: ComponentFixture<DebugPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DebugPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DebugPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
