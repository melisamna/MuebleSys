import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalagoComponent } from './catalago.component';

describe('CatalagoComponent', () => {
  let component: CatalagoComponent;
  let fixture: ComponentFixture<CatalagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalagoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalagoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
