import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ActivityService } from '../../services/activity.service';
import { ActivitiesPage } from './activities.page';

describe('ActivitiesPage', () => {
  let component: ActivitiesPage;
  let fixture: ComponentFixture<ActivitiesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivitiesPage],
      providers: [
        provideRouter([]),
        {
          provide: ActivityService,
          useValue: { getAll: () => of([]), upload: () => of({}) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivitiesPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
