import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaMueblesComponent } from './tabla-muebles.component';

describe('TablaMueblesComponent', () => {
  let component: TablaMueblesComponent;
  let fixture: ComponentFixture<TablaMueblesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaMueblesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaMueblesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
