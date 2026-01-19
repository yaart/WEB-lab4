package yaart.s468198.labe4.controller;

import yaart.s468198.labe4.dto.AuthRequest;
import yaart.s468198.labe4.dto.AuthResponse;
import yaart.s468198.labe4.dto.ErrorResponse;
import yaart.s468198.labe4.model.User;
import yaart.s468198.labe4.service.JwtService;
import yaart.s468198.labe4.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody AuthRequest request) {
        if (userService.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse(400, "Bad Request", "Пользователь уже существует"));
        }

        User user = userService.createUser(request.getUsername(), request.getPassword());
        String token = jwtService.generateToken(user.getUsername());

        return ResponseEntity.ok(new AuthResponse(token, user.getUsername(), "Регистрация успешна"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest request) {
        return userService.findByUsername(request.getUsername())
                .filter(user -> userService.validatePassword(user, request.getPassword()))
                .map(user -> {
                    String token = jwtService.generateToken(user.getUsername());
                    return ResponseEntity.ok(new AuthResponse(token, user.getUsername(), "Вход выполнен"));
                })
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new AuthResponse(null, null, "Неверный логин или пароль")));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok().body(java.util.Map.of("message", "Выход выполнен"));
    }
}