import { AsyncPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NbSpinnerModule } from '@nebular/theme';
import {
  Observable,
  Subject,
  concatMap,
  debounceTime,
  finalize,
  of,
} from 'rxjs';
import { Game, GameDto } from '../../models/game/game.dto';
import { GameService } from '../../services/game.service';
import { SearchInputComponent } from '../atoms/search-input.component';
import { GameCardComponent } from '../molecules/game-card.component';

@Component({
  standalone: true,
  selector: 'tg-add-to-collection',
  imports: [
    FormsModule,
    GameCardComponent,
    AsyncPipe,
    NgForOf,
    NgIf,
    NbSpinnerModule,
    NgClass,
    SearchInputComponent,
  ],
  template: `
    <ng-container>
      <tg-search-input
        class="tg-full-width tg-mb-4 tg-block"
        ngModel
        id="search"
        name="search"
        icon="search"
        placeholder="Search for a game"
        (searchInput)="handleSearchInput($event)"
      ></tg-search-input>
      <ng-container *ngFor="let game of (filteredOptions$ | async) || []">
        <tg-game-card
          [game]="game"
          [actionButton]="{ icon: 'plus', status: 'primary' }"
          (actionButtonClicked)="handleAddToCollection($event)"
        ></tg-game-card>
      </ng-container>
      <ng-container *ngIf="isLoading">
        <nb-spinner
          [ngClass]="{ 'tg-relative': (filteredOptions$ | async)?.length }"
          status="primary"
          size="large"
        ></nb-spinner>
      </ng-container>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddToCollectionComponent {
  public searchInput = '';
  public filteredOptions$!: Observable<Game[]>;

  protected isLoading = false;

  private games: GameDto[] = [];
  private currentPage = 0;
  private searchInput$ = new Subject<string>();

  public constructor(
    private readonly gameService: GameService,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.searchInput$
      .pipe(debounceTime(300)) // Adjust the debounce time as needed
      .subscribe((searchInput: string) => {
        this.searchInput = searchInput;
        this.games = [];
        this.currentPage = 0;
        this.loadGames();
      });

    this.loadGames();
  }

  @HostListener('window:scroll', ['$event'])
  private onScroll(): void {
    const windowHeight =
      'innerHeight' in window
        ? window.innerHeight
        : document.documentElement.offsetHeight;
    const body = document.body,
      html = document.documentElement;
    const docHeight = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
    const windowBottom = windowHeight + window.pageYOffset;

    if (windowBottom >= docHeight - 1) {
      this.loadGames();
    }
  }

  private loadGames(): void {
    if (this.isLoading) {
      return;
    }

    this.isLoading = true;

    this.gameService
      .getAllGames(this.searchInput, this.currentPage)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        }),
        concatMap((newGames) => {
          this.games.push(...newGames);
          this.currentPage++;
          return of(this.games);
        })
      )
      .subscribe(() => {
        this.filteredOptions$ = of(this.games);
      });
  }

  public handleSearchInput(searchInput: string) {
    this.searchInput$.next(searchInput);
  }

  public handleAddToCollection(game: GameDto) {
    this.gameService.addGameToCollection(game.id).subscribe();
  }
}
