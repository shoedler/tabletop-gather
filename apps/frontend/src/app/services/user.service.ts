import { filter, map, Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { API_BASE_URL } from '../app.config';
import { JwtDto } from '../models/jwt.dto';
import { DetailPlanDto } from '../models/plan/detail-plan.dto';
import { PasswordUpdate } from '../models/user/password-update.dto';
import { UserPlanDto } from '../models/user/user-plan.dto';
import { UserUpdate } from '../models/user/user-update.dto';
import { UserDto } from '../models/user/user.dto';
import { ResponseHandler } from '../utils/response.handler';
import { Uuid } from '../utils/types';

/**
 * Service for all user related API calls.
 */
@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly usersUrl = `${this.apiBaseUrl}/users`;

  public constructor(
    @Inject(API_BASE_URL) private readonly apiBaseUrl: string,
    private readonly http: HttpClient,
    private readonly responseHandler: ResponseHandler
  ) {}

  /**
   * Gets all users.
   *
   * @returns {Observable<UserDto[]>} - The users
   */
  public getAllUsers(): Observable<UserDto[]> {
    return this.http
      .get<object[]>(this.usersUrl, {
        responseType: 'json',
        observe: 'response',
      })
      .pipe(
        this.responseHandler.handleErrorResponse(),
        filter((response) => response !== null),
        map((response) => response?.body as object[]),
        map((usersJson) =>
          usersJson.map((user: unknown) => UserDto.fromJson(user))
        )
      );
  }

  /**
   * Deletes the current authenticated user.
   *
   * @returns {Observable<Uuid>} - The id of the deleted user
   */
  public deleteMe(): Observable<Uuid> {
    return this.http
      .delete(`${this.usersUrl}/me`, {
        responseType: 'text',
        observe: 'response',
      })
      .pipe(
        this.responseHandler.handleResponse({
          successMessageOverride: `User was deleted successfully`,
          successTitleOverride: 'User deleted 👊',
        }),
        filter((response) => response !== null),
        map((response) => JSON.parse(response?.body as Uuid))
      );
  }

  /**
   * Updates the current authenticated user.
   *
   * @param {UserUpdate} user - The user to update
   * @returns {Observable<Uuid>} - The id of the updated user
   *
   */
  public updateMe(user: UserUpdate): Observable<JwtDto> {
    return this.http
      .put(`${this.usersUrl}/me`, user, {
        responseType: 'json',
        observe: 'response',
      })
      .pipe(
        this.responseHandler.handleResponse({
          successMessageOverride: `User was updated successfully`,
          successTitleOverride: 'User updated 👍',
        }),
        filter((response) => response !== null),
        map((response) => response?.body as string),
        map((jwtJson) => JwtDto.fromJson(jwtJson))
      );
  }

  /**
   * Updates the password of the current authenticated user.
   *
   * @param {PasswordUpdate} passwordUpdate - The password update
   * @returns {Observable<JwtDto>} - A new JWT object
   */
  public updateMyPassword(passwordUpdate: PasswordUpdate): Observable<JwtDto> {
    return this.http
      .put(`${this.usersUrl}/me/password`, passwordUpdate, {
        responseType: 'json',
        observe: 'response',
      })
      .pipe(
        this.responseHandler.handleResponse({
          successMessageOverride: `Password was updated successfully`,
          successTitleOverride: 'Password updated 👍',
        }),
        filter((response) => response !== null),
        map((response) => response?.body as string),
        map((jwtJson) => JwtDto.fromJson(jwtJson))
      );
  }

  /**
   * Gets the the current user from the JWT token.
   *
   * @returns {Observable<UserDto>} - An observable that emits the current user
   */
  public me(): Observable<UserDto> {
    return this.http
      .get<object>(`${this.usersUrl}/me`, {
        observe: 'response',
        responseType: 'json',
      })
      .pipe(
        this.responseHandler.handleErrorResponse(),
        filter((response) => response !== null),
        map((response) => response?.body as object),
        map((userJson) => UserDto.fromJson(userJson))
      );
  }

  /**
   * Gets all users attending a plan.
   *
   * @param {DetailPlanDto['id']} planId - The id of the plan
   * @returns {Observable<UserPlanDto[]>} - The users attending the plan
   *
   */
  public getUsersByPlanId(
    planId: DetailPlanDto['id']
  ): Observable<UserPlanDto[]> {
    return this.http
      .get<object[]>(`${this.usersUrl}/plan/${planId}`, {
        responseType: 'json',
        observe: 'response',
      })
      .pipe(
        this.responseHandler.handleErrorResponse(),
        filter((response) => response !== null),
        map((response) => response?.body as object[]),
        map((usersJson) =>
          usersJson.map((user: unknown) => UserPlanDto.fromJson(user))
        )
      );
  }
}
