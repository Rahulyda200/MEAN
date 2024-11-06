import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImojiComponent } from './imoji.component';

describe('ImojiComponent', () => {
  let component: ImojiComponent;
  let fixture: ComponentFixture<ImojiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImojiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImojiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
