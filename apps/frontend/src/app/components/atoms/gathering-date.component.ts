import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DateTimeGathering } from '../../models/gathering/date-time-gathering.dto';
import { DetailGathering } from '../../models/gathering/detail-gathering.dto';
import { Gathering } from '../../models/gathering/gathering.dto';
import { get24HourTime, getDateCHFormat } from '../../utils/date.utility';

@Component({
  standalone: true,
  selector: 'tg-gathering-date',
  imports: [DatePipe],
  template: ` {{ getDateString(date) }} at {{ getTimeString(date) }} `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GatheringDateComponent {
  @Input({ required: true }) public date!:
    | Date
    | Gathering
    | DetailGathering
    | DateTimeGathering;

  public getDateString(data: typeof this.date) {
    if (data instanceof Date) return getDateCHFormat(data);
    if (typeof data.date === 'string')
      return getDateCHFormat(new Date(data.date));
    return getDateCHFormat(data.date);
  }

  public getTimeString(data: typeof this.date) {
    if (data instanceof Date) return get24HourTime(data);
    return data.startTime;
  }
}
