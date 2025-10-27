/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AnamnesesComponent } from './Anamneses.component';

describe('AnamnesesComponent', () => {
  let component: AnamnesesComponent;
  let fixture: ComponentFixture<AnamnesesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnamnesesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnamnesesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
