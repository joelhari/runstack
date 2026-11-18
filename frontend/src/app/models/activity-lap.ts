export interface ActivityLap {
  id: number;
  lapIndex: number;
  startedAt: string | null;
  endedAt: string | null;
  elapsedDuration: number | null;
  timerDuration: number | null;
  distance: number | null;
  averagePace: number | null;
  averageSpeed: number | null;
  maximumSpeed: number | null;
  averageHeartRate: number | null;
  maximumHeartRate: number | null;
  averageCadence: number | null;
  maximumCadence: number | null;
  averagePower: number | null;
  maximumPower: number | null;
  calories: number | null;
  ascent: number | null;
  descent: number | null;
}
