import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudianteRegistro } from './estudiante-registro';

describe('EstudianteRegistro', () => {
  let component: EstudianteRegistro;
  let fixture: ComponentFixture<EstudianteRegistro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstudianteRegistro]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstudianteRegistro);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
