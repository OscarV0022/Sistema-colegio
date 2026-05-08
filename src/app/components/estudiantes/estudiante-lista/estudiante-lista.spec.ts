import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudianteLista } from './estudiante-lista';

describe('EstudianteLista', () => {
  let component: EstudianteLista;
  let fixture: ComponentFixture<EstudianteLista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstudianteLista]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstudianteLista);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
