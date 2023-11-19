import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { NbButtonModule, NbUserModule } from '@nebular/theme';
import { UserDto } from '../../models/user.dto';

@Component({
  selector: 'tg-user',
  standalone: true,
  imports: [CommonModule, NbUserModule, NbButtonModule],
  template: ` <div class="tg-flex-row">
    <nb-user
      [shape]="'round'"
      [name]="user.firstName + ' ' + user.lastName"
      [title]="'Username - ' + user.username"
    >
    </nb-user>
    <button nbButton status="danger" (click)="deleteUser.emit(user)">
      Delete
    </button>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserComponent {
  @Input() public user!: UserDto;

  @Output() public deleteUser = new EventEmitter<UserDto>();
}
