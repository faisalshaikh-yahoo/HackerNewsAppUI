import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Router, RouterEvent, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoaderComponent } from './components/loader/loader.component';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let routerEvents$: Subject<RouterEvent>;
  let mockRouter: any;

  beforeEach(async () => {
    routerEvents$ = new Subject<RouterEvent>();
    mockRouter = {
      events: routerEvents$.asObservable()
    };

    await TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [AppComponent, NavbarComponent, LoaderComponent],
      providers: [
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the AppComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should set loading to true on NavigationStart', () => {
    routerEvents$.next(new NavigationStart(1, '/test'));
    expect(component.loading).toBeTrue();
  });

  it('should set loading to false after NavigationEnd with delay', (done) => {
    component.loading = true;
    routerEvents$.next(new NavigationEnd(1, '/test', '/test'));

    setTimeout(() => {
      expect(component.loading).toBeFalse();
      done();
    }, 350); // slight buffer above the 300ms timeout
  });

  it('should set loading to false after NavigationCancel with delay', (done) => {
    component.loading = true;
    routerEvents$.next(new NavigationCancel(1, '/test', 'cancel'));

    setTimeout(() => {
      expect(component.loading).toBeFalse();
      done();
    }, 350);
  });

  it('should set loading to false after NavigationError with delay', (done) => {
    component.loading = true;
    routerEvents$.next(new NavigationError(1, '/test', new Error('Error')));

    setTimeout(() => {
      expect(component.loading).toBeFalse();
      done();
    }, 350);
  });
});
