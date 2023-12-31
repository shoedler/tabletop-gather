import { CommonModule } from '@angular/common';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NbCardModule, NbSelectModule, NbThemeModule } from '@nebular/theme';
import {
  PlanEventGeneralFormComponent,
  PlanEventGeneralFormValue,
} from './plan-event-general-form.component';

describe(PlanEventGeneralFormComponent.name, () => {
  let fixture: ComponentFixture<PlanEventGeneralFormComponent>;
  let component: PlanEventGeneralFormComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        NbCardModule,
        NbSelectModule,
        NbThemeModule.forRoot(),
        NoopAnimationsModule,
        PlanEventGeneralFormComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PlanEventGeneralFormComponent);
    component = fixture.componentInstance;
    component.games = [
      {
        name: 'Test Game',
        description: 'Test Game Description',
        minPlayer: 1,
        maxPlayer: 10,
        imageUrl: 'test-url',
      },
    ];
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit form changes', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    const mockFormValue: PlanEventGeneralFormValue = {
      name: 'Game Night',
      description: 'Fun and games',
      isPrivate: false,
      playerLimit: '10',
      game: [
        {
          id: '1',
          name: 'Test Game',
          description: 'Test Game Description',
          minPlayer: 1,
          maxPlayer: 10,
          imageUrl: 'test-url',
        },
      ],
    };

    jest.spyOn(component.eventGeneralFormChange, 'emit');

    component.ngForm.setValue(mockFormValue);
    tick();

    expect(component.eventGeneralFormChange.emit).toHaveBeenCalledWith(
      component.ngForm.form
    );
  }));
});
