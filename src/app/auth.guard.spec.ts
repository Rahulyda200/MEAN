import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,  
        RouterTestingModule      
      ],
      providers: [AuthGuard],
    });

    guard = TestBed.inject(AuthGuard); 
    router = TestBed.inject(Router);   
  });

  it('should be created', () => {
    expect(guard).toBeTruthy(); 
  });

 
});
