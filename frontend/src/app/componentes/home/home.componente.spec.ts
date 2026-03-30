import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponente } from './home.componente';

describe('HomeComponente', () => {
  let component: HomeComponente;
  let fixture: ComponentFixture<HomeComponente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponente);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
