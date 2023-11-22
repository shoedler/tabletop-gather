package tabletop.gather.backend.unit.user;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import tabletop.gather.backend.jwt.JwtDto;
import tabletop.gather.backend.jwt.JwtService;
import tabletop.gather.backend.user.*;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

public class UserResourceTest {

  @InjectMocks
  private UserResource userResource;

  @Mock
  private UserService userService;

  @Mock
  private JwtService jwtService;

  @BeforeEach
  public void init() {
    MockitoAnnotations.openMocks(this);
  }

  @Test
  public void testGetAllUsers() {
    UserDto userDto1 = new UserDto();
    UserDto userDto2 = new UserDto();
    when(userService.findAll()).thenReturn(List.of(userDto1, userDto2));

    ResponseEntity<List<UserDto>> response = userResource.getAllUsers();

    assertEquals(HttpStatus.OK, response.getStatusCode());
    assertEquals(List.of(userDto1, userDto2), response.getBody());
  }

  @Test
  public void testGetUser() {
    UUID id = UUID.randomUUID();
    UserDto userDto = new UserDto();
    when(userService.get(id)).thenReturn(userDto);

    ResponseEntity<UserDto> response = userResource.getUser(id);

    assertEquals(HttpStatus.OK, response.getStatusCode());
    assertEquals(userDto, response.getBody());
  }

  @Test
  public void testUpdateAuthenticatedUser() {
    String token = "token";
    UserUpdateDto userUpdateDto = new UserUpdateDto();
    UserDto userDto = new UserDto();
    User user = new User();
    when(jwtService.extractUsername(token)).thenReturn(userDto.getEmail());
    when(userService.getByEmail(userDto.getEmail())).thenReturn(userDto);
    when(userService.update(userDto.getId(), userUpdateDto, userDto.getEmail())).thenReturn(user);
    when(jwtService.generateToken(user)).thenReturn("newToken");
    when(jwtService.getExpirationTime()).thenReturn(3600L);

    ResponseEntity<JwtDto> response = userResource.updateAuthenticatedUser(token, userUpdateDto);

    assertEquals(HttpStatus.OK, response.getStatusCode());
    assertEquals("newToken", response.getBody().getToken());
    assertEquals(3600L, response.getBody().getExpiresIn());
  }

  @Test
  public void testDeleteAuthenticatedUser() {
    String token = "token";
    UserDto userDto = new UserDto();
    when(jwtService.extractUsername(token)).thenReturn(userDto.getEmail());
    when(userService.getByEmail(userDto.getEmail())).thenReturn(userDto);

    ResponseEntity<Void> response = userResource.deleteAuthenticatedUser(token);

    assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
  }

  @Test
  public void testGetAuthenticatedUser() {
    String token = "token";
    UserDto userDto = new UserDto();
    when(jwtService.extractUsername(token)).thenReturn(userDto.getEmail());
    when(userService.getByEmail(userDto.getEmail())).thenReturn(userDto);

    ResponseEntity<UserDto> response = userResource.getAuthenticatedUser(token);

    assertEquals(HttpStatus.OK, response.getStatusCode());
    assertEquals(userDto, response.getBody());
  }

  @Test
  public void testUpdatePassword() {
    String token = "token";
    PasswordUpdateDto passwordUpdateDto = new PasswordUpdateDto();
    UserDto userDto = new UserDto();
    User user = new User();
    when(jwtService.extractUsername(token)).thenReturn(userDto.getEmail());
    when(userService.getByEmail(userDto.getEmail())).thenReturn(userDto);
    when(userService.updatePassword(userDto.getId(), passwordUpdateDto)).thenReturn(user);
    when(jwtService.generateToken(user)).thenReturn("newToken");
    when(jwtService.getExpirationTime()).thenReturn(3600L);

    ResponseEntity<JwtDto> response = userResource.updatePassword(passwordUpdateDto, token);

    assertEquals(HttpStatus.OK, response.getStatusCode());
    assertEquals("newToken", response.getBody().getToken());
    assertEquals(3600L, response.getBody().getExpiresIn());
  }
}