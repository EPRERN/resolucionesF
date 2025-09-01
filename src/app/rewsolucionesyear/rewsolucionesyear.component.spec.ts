/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RewsolucionesyearComponent } from './rewsolucionesyear.component';

describe('RewsolucionesyearComponent', () => {
  let component: RewsolucionesyearComponent;
  let fixture: ComponentFixture<RewsolucionesyearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RewsolucionesyearComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RewsolucionesyearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
