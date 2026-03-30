import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponente } from './header.componente';

describe('HeaderComponente', () => {
  let component: HeaderComponente;
  let fixture: ComponentFixture<HeaderComponente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponente);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
