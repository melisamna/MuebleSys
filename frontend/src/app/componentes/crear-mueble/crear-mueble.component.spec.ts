import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearMuebleComponent } from './crear-mueble.component';

describe('CrearMuebleComponent', () => {
  let component: CrearMuebleComponent;
  let fixture: ComponentFixture<CrearMuebleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearMuebleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearMuebleComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
