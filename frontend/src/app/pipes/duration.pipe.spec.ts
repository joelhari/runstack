import { DurationPipe } from './duration.pipe';

describe('DurationPipe', () => {
  const pipe = new DurationPipe();

  it('formats milliseconds as minutes and seconds', () => {
    expect(pipe.transform(365_000)).toBe('06:05');
  });

  it('includes hours for durations of at least one hour', () => {
    expect(pipe.transform(3_723_000)).toBe('01:02:03');
  });

  it('can always include hours', () => {
    expect(pipe.transform(1_800_000, true)).toBe('00:30:00');
  });

  it('rounds milliseconds to the nearest second', () => {
    expect(pipe.transform(359_600)).toBe('06:00');
  });

  it('uses a placeholder for missing or invalid durations', () => {
    expect(pipe.transform(null)).toBe('—');
    expect(pipe.transform(Number.NaN)).toBe('—');
    expect(pipe.transform(-1)).toBe('—');
  });
});
