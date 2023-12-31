package tabletop.gather.backend.auth;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import tabletop.gather.backend.user.User;
import tabletop.gather.backend.user.UserDto;
import tabletop.gather.backend.user.UserRepository;
import tabletop.gather.backend.user.UserService;
import tabletop.gather.backend.util.NotFoundException;

@Service
public class AuthenticationService {
  private final UserRepository userRepository;

  private final UserService userService;

  private final AuthenticationManager authenticationManager;

  private final PasswordEncoder passwordEncoder;

  public AuthenticationService(
      UserRepository userRepository,
      UserService userService,
      AuthenticationManager authenticationManager,
      PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.userService = userService;
    this.authenticationManager = authenticationManager;
    this.passwordEncoder = passwordEncoder;
  }

  public boolean isEmailTaken(String email) {
    return userRepository.findByEmail(email).isPresent();
  }

  public UserDto signup(RegisterUserDto input) {
    User user = new User();
    user.setUsername(input.getUsername());
    user.setFirstName(input.getFirstName());
    user.setLastName(input.getLastName());
    user.setEmail(input.getEmail());
    user.setPasswordHash(passwordEncoder.encode(input.getPassword()));

    userRepository.save(user);
    return this.userService.mapToDto(user, new UserDto());
  }

  public User authenticate(LoginUserDto input) {
    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(input.getEmail(), input.getPassword()));

    return userRepository.findByEmail(input.getEmail()).orElseThrow(NotFoundException::new);
  }

  public void verifyEmailPassword(String email, String password) {
    User user =
        userRepository
            .findByEmail(email)
            .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));
    if (!passwordEncoder.matches(password, user.getPasswordHash())) {
      throw new BadCredentialsException("Invalid credentials");
    }
  }
}
