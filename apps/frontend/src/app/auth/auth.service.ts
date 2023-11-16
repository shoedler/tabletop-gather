import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, shareReplay, tap } from 'rxjs';
import { LoginUserDto } from '../api/model/login-user.dto';
import { Model } from '../api/model/model.type';
import { RegisterUserDto } from '../api/model/register-user.dto';
import { UserDto } from '../api/model/user.dto';
import { AUTH_BASE_URL } from '../app.config';

type LoginResult = {
  token: string;
  expiresIn: number;
};

const LS_TOKEN_KEY = 'id_token';
const LS_EXPIRES_AT_KEY = 'expires_at';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly loginStatusSubject = new BehaviorSubject<boolean>(
    this.isLoggedIn()
  );

  public readonly loginStatus$ = this.loginStatusSubject.asObservable();

  public get loginStatus(): boolean {
    return this.loginStatusSubject.getValue();
  }

  public constructor(
    @Inject(AUTH_BASE_URL) private readonly authBaseUrl: string,
    private readonly http: HttpClient
  ) {}

  public login(loginUser: Model<LoginUserDto>): Observable<LoginResult> {
    return this.http
      .post<LoginResult>(`${this.authBaseUrl}/login`, loginUser, {
        responseType: 'json',
      })
      .pipe(
        tap((response) => this.setSession(response)),
        shareReplay(),
        tap(() => this.loginStatusSubject.next(true))
      );
  }

  public signup(registerUser: Model<RegisterUserDto>): Observable<UserDto> {
    return this.http.post<UserDto>(`${this.authBaseUrl}/signup`, registerUser, {
      responseType: 'json',
    });
  }

  public getToken(): string | null {
    return this.isLoggedIn() ? localStorage.getItem(LS_TOKEN_KEY) : null;
  }

  public logout(): void {
    localStorage.removeItem(LS_TOKEN_KEY);
    localStorage.removeItem(LS_EXPIRES_AT_KEY);
    this.loginStatusSubject.next(false);
  }

  private isLoggedIn(): boolean {
    const expiresAt = JSON.parse(
      localStorage.getItem(LS_EXPIRES_AT_KEY) || '{}'
    );

    return new Date().valueOf() < expiresAt;
  }

  private setSession(response: LoginResult): void {
    const expiresAt = new Date();
    const expiresIn = response.expiresIn / 1000; // convert ms to s
    expiresAt.setSeconds(expiresAt.getSeconds() + expiresIn);

    localStorage.setItem(LS_TOKEN_KEY, response.token);
    localStorage.setItem(
      LS_EXPIRES_AT_KEY,
      JSON.stringify(expiresAt.valueOf())
    );
  }
}
