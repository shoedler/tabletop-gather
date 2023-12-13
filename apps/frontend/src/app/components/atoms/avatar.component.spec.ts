import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AvatarComponent } from './avatar.component';
import { User } from '../../models/user/user.dto';

describe('AvatarComponent', () => {
  let component: AvatarComponent;
  let fixture: ComponentFixture<AvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvatarComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    // Add fixture.detectChanges() after setting the user property
    component.user = { username: 'johndoe', firstName: 'John', lastName: 'Doe', email: 'johndoe@test.com' };
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display user initials', () => {
    const testUser: User = { username: 'johndoe', firstName: 'John', lastName: 'Doe', email: 'johndoe@test.com' };
    component.user = testUser;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.initials')?.textContent).toContain('JD');
  });
});
