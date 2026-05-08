import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudianteAsignacion } from './estudiante-asignacion';

describe('EstudianteAsignacion', () => {
  let component: EstudianteAsignacion;
  let fixture: ComponentFixture<EstudianteAsignacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstudianteAsignacion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstudianteAsignacion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
