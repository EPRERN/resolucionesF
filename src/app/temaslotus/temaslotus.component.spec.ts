/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TemaslotusComponent } from './temaslotus.component';

describe('TemaslotusComponent', () => {
  let component: TemaslotusComponent;
  let fixture: ComponentFixture<TemaslotusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemaslotusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemaslotusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
