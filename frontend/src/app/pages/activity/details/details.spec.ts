import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Details } from './details';

describe('Details', () => {
  let component: Details;
  let fixture: ComponentFixture<Details>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Details],
    }).compileComponents();

    fixture = TestBed.createComponent(Details);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('activity', {
      id: 1,
      name: 'Morning run',
      date: '2026-11-18',
      distance: 5,
      duration: 1_800_000,
      averagePace: 360_000,
    });
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the activity summary', () => {
    fixture.detectChanges();
    const values = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('dd'),
      (element) => element.textContent?.trim(),
    );

    expect(values).toEqual(['5 km', '00:30:00', '06:00']);
  });
});
