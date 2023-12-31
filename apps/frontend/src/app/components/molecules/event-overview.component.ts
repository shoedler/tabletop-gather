import { DatePipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { GameDto } from '../../models/game/game.dto';
import { DetailPlan } from '../../models/plan/detail-plan.dto';
import { OverviewPlan } from '../../models/plan/overview-plan.dto';
import { GatheringDatePipe } from '../../pipes/gathering-date.pipe';
import { LabelComponent } from '../atoms/label.component';
import { LazyImageComponent } from '../atoms/lazy-image.component';
import { PlanEventFormValue } from '../pages/plan-event.component';

@Component({
  standalone: true,
  selector: 'tg-event-overview',
  imports: [
    NgIf,
    NgFor,
    DatePipe,
    LabelComponent,
    LazyImageComponent,
    GatheringDatePipe,
  ],
  template: `
    <div class="tg-p-1">
      <div>
        <p class="label">Title</p>
        <p class="tg-pt-1">{{ plan.name }}</p>
        <p class="tg-pt-2 label">Event Info</p>
        <p class="tg-pt-1">{{ plan.description }}</p>
        <p class="tg-pt-2 label">Visibility</p>
        <p class="tg-pt-1">{{ plan.isPrivate ? 'Private' : 'Public' }}</p>
      </div>

      <div class="tg-mt-2" *ngIf="showOptions">
        <p class="label">Options</p>
        <div class="tg-pt-1">
          <p *ngFor="let gathering of mapGatheringsFromFormValue(plan)">
            {{ gathering | gatheringDate }}
          </p>
        </div>
      </div>

      <div class="tg-mt-2">
        <p class="label">Player Limit</p>
        <p class="tg-pt-1">{{ plan.playerLimit }}</p>
      </div>

      <div class="tg-mt-2" *ngIf="mapGameFromFormValue(plan.game) as game">
        <p class="label">Game</p>
        <div class="tg-pt-1 tg-flex-row tg-justify-start">
          <tg-lazy-image [src]="game.imageUrl" class="tg-mr-1"></tg-lazy-image>
          <p class="tg-p-1">{{ game.name }}</p>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventOverviewComponent {
  @Input() public showOptions = true;
  @Input({ required: true }) public plan!:
    | PlanEventFormValue
    | OverviewPlan
    | DetailPlan;

  public mapGameFromFormValue(
    game: PlanEventFormValue['game'] | OverviewPlan['game'] | DetailPlan['game']
  ): GameDto | undefined {
    return Array.isArray(game) ? game[0] : game;
  }

  public mapGatheringsFromFormValue(
    plan: PlanEventFormValue | OverviewPlan | DetailPlan
  ): Date[] {
    const gatheringProp: keyof DetailPlan = 'gatherings';

    const gatherings =
      gatheringProp in plan ? plan[gatheringProp] : plan.gatheringDtos;

    return gatherings.map((gathering) =>
      gathering instanceof Date ? gathering : gathering.date
    );
  }
}
