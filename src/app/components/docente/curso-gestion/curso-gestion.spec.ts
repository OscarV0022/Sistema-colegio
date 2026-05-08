import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursoGestion } from './curso-gestion';

describe('CursoGestion', () => {
  let component: CursoGestion;
  let fixture: ComponentFixture<CursoGestion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CursoGestion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CursoGestion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
