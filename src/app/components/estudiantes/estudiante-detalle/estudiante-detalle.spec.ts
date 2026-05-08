import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudianteDetalle } from './estudiante-detalle';

describe('EstudianteDetalle', () => {
  let component: EstudianteDetalle;
  let fixture: ComponentFixture<EstudianteDetalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstudianteDetalle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstudianteDetalle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
