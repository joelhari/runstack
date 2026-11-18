import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivityService } from './activity.service';

describe('ActivityService', () => {
  let service: ActivityService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ActivityService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('posts the file to the activity endpoint', () => {
    const file = new File(['activity'], 'activity.fit');

    service.upload(file).subscribe();

    const request = httpTesting.expectOne('http://localhost:8080/api/v1/activity');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toBeInstanceOf(FormData);
    expect((request.request.body as FormData).get('file')).toBe(file);
    request.flush({});
  });

  it('gets all activities from the activity endpoint', () => {
    service.getAll().subscribe();

    const request = httpTesting.expectOne('http://localhost:8080/api/v1/activity');
    expect(request.request.method).toBe('GET');
    request.flush([]);
  });

  it('gets an activity by id from the activity endpoint', () => {
    service.getById(42).subscribe();

    const request = httpTesting.expectOne('http://localhost:8080/api/v1/activity/42');
    expect(request.request.method).toBe('GET');
    request.flush({});
  });
});
