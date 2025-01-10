export interface NotifSearch {
  title: String;
  startDate: String | Number;
  endDate: String | Number;
}

export interface NotifRow {
  id?: number | undefined;
  title: string;
  content: string;
  startTime?: string;
  endTime?: string;
  updatedBy?: string;
  timeRange?: string[];
}
