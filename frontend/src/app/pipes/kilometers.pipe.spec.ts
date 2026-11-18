import { KilometersPipe } from './kilometers.pipe';

describe('KilometersPipe', () => {
  const pipe = new KilometersPipe();

  it('converts meters to kilometers', () => {
    expect(pipe.transform(5_250)).toBe('5.25 km');
  });

  it('uses the requested number of decimal digits', () => {
    expect(pipe.transform(5_250, 1)).toBe('5.3 km');
    expect(pipe.transform(5_250, 3)).toBe('5.250 km');
  });

  it('uses a placeholder for a missing or invalid distance', () => {
    expect(pipe.transform(null)).toBe('—');
    expect(pipe.transform(Number.NaN)).toBe('—');
  });
});
