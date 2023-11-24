import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { NbButtonModule, NbCardModule, NbIconModule } from '@nebular/theme';
import { OverviewPlanDto } from '../../models/overview-plan.dto';

@Component({
  standalone: true,
  selector: 'tg-event-card',
  imports: [NgIf, NbCardModule, NbButtonModule, NbIconModule],
  template: `
    <nb-card>
      <nb-card-header>
        <div class="tg-flex-row tg-justify-between">
          <div class="tg-flex-col tg-align-start">
            <p class="caption-2">
              {{ overviewPlanDto.gatheringDates.join(', ') }}
            </p>
            {{ overviewPlanDto.name }}
            <p class="caption-2">by {{ overviewPlanDto.ownerName }}</p>
          </div>
          <nb-icon
            icon="lock-outline"
            status="warning"
            *ngIf="overviewPlanDto.isPrivate"
          ></nb-icon>
        </div>
      </nb-card-header>
      <nb-card-body>
        {{ overviewPlanDto.description }}
      </nb-card-body>
      <nb-card-footer>
        <div class="tg-flex-row tg-justify-end">
          <button
            nbButton
            *ngIf="isOwner"
            ghost
            status="danger"
            shape="semi-round"
            (click)="deleteClicked.emit()"
          >
            <nb-icon icon="trash-2-outline"></nb-icon>
          </button>
          <div class="tg-m-1"></div>
          <button
            nbButton
            ghost
            status="primary"
            shape="semi-round"
            (click)="viewClicked.emit()"
          >
            <nb-icon icon="arrow-forward-outline"></nb-icon>
          </button>
        </div>
      </nb-card-footer>
    </nb-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventCardComponent {
  @Input({ required: true }) public overviewPlanDto!: OverviewPlanDto;
  @Input() public isOwner = false;

  @Output() public viewClicked: EventEmitter<void> = new EventEmitter();
  @Output()
  public deleteClicked: EventEmitter<void> = new EventEmitter();
}
