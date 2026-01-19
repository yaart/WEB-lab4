package yaart.s468198.labe4.controller;

import yaart.s468198.labe4.dto.ErrorResponse;
import yaart.s468198.labe4.dto.PointRequest;
import yaart.s468198.labe4.dto.PointResponse;
import yaart.s468198.labe4.model.User;
import yaart.s468198.labe4.service.PointService;
import yaart.s468198.labe4.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/points")
@RequiredArgsConstructor
public class PointController {

    private final PointService pointService;
    private final UserService userService;

    // Допустимые значения
    private static final List<Double> VALID_X_VALUES = Arrays.asList(-4.0, -3.0, -2.0, -1.0, 0.0, 1.0, 2.0, 3.0, 4.0);
    private static final List<Double> VALID_R_VALUES = Arrays.asList(-4.0, -3.0, -2.0, -1.0, 0.0, 1.0, 2.0, 3.0, 4.0);
    private static final double MIN_Y = -3.0;
    private static final double MAX_Y = 5.0;

    @PostMapping("/check")
    public ResponseEntity<?> checkPoint(
            @Valid @RequestBody PointRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        if (!VALID_X_VALUES.contains(request.getX())) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse(400, "Validation Error",
                            "X должен быть одним из значений: " + VALID_X_VALUES));
        }

        if (request.getY() < MIN_Y || request.getY() > MAX_Y) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse(400, "Validation Error",
                            "Y должен быть в диапазоне от " + MIN_Y + " до " + MAX_Y));
        }

        if (!VALID_R_VALUES.contains(request.getR()) || request.getR() <= 0) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse(400, "Validation Error",
                            "R должен быть положительным и одним из значений: " +
                                    VALID_R_VALUES.stream().filter(r -> r > 0).toList()));
        }

        User user = userService.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        PointResponse response = pointService.checkPoint(request, user);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<PointResponse>> getUserPoints(
            @AuthenticationPrincipal UserDetails userDetails) {

        User user = userService.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(pointService.getUserPoints(user));
    }

    @DeleteMapping
    public ResponseEntity<?> clearPoints(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        pointService.clearUserPoints(user);
        return ResponseEntity.ok().body(java.util.Map.of("message", "Все точки удалены"));
    }
}
