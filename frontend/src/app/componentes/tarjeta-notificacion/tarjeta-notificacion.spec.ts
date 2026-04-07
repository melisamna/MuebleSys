import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaNotificacion } from './tarjeta-notificacion';

describe('TarjetaNotificacion', () => {
  let component: TarjetaNotificacion;
  let fixture: ComponentFixture<TarjetaNotificacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarjetaNotificacion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TarjetaNotificacion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
