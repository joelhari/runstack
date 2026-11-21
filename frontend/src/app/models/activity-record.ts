export interface AggregatedValue {
  average: number | null;
  minimum: number | null;
  maximum: number | null;
  count: number;
}

export interface AggregatedActivityRecord {
  x: number;
  sourceRecordCount: number;
  latitude: AggregatedValue;
  longitude: AggregatedValue;
  altitude: AggregatedValue;
  heartRate: AggregatedValue;
  speed: AggregatedValue;
  distance: AggregatedValue;
  cadence: AggregatedValue;
  power: AggregatedValue;
  temperature: AggregatedValue;
  verticalOscillation: AggregatedValue;
  groundContactTimeMs: AggregatedValue;
  respirationRate: AggregatedValue;
}

export type AggregatedActivityRecordValueField = Exclude<
  keyof AggregatedActivityRecord,
  'x' | 'sourceRecordCount'
>;

export interface AggregatedActivityRecords {
  axis: 'distance' | 'time';
  from: number;
  to: number;
  bucketWidth: number;
  sourceRecordCount: number;
  points: AggregatedActivityRecord[];
}
