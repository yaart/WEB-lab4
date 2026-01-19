package yaart.s468198.labe4.service;


import yaart.s468198.labe4.dto.PointRequest;
import yaart.s468198.labe4.dto.PointResponse;
import yaart.s468198.labe4.model.Point;
import yaart.s468198.labe4.model.User;
import yaart.s468198.labe4.repository.PointRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PointService {

    private final PointRepository pointRepository;

    @Transactional
    public PointResponse checkPoint(PointRequest request, User user) {
        long startTime = System.nanoTime();

        boolean hit = isPointInArea(request.getX(), request.getY(), request.getR());

        long executionTime = System.nanoTime() - startTime;

        Point point = Point.builder()
                .x(request.getX())
                .y(request.getY())
                .r(request.getR())
                .hit(hit)
                .executionTime(executionTime)
                .user(user)
                .build();

        Point savedPoint = pointRepository.save(point);

        return toResponse(savedPoint);
    }

    public List<PointResponse> getUserPoints(User user) {
        return pointRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void clearUserPoints(User user) {
        pointRepository.deleteAllByUser(user);
    }


    private boolean isPointInArea(double x, double y, double r) {
        if (r <= 0) return false;

        boolean inRectangle = (x >= -r && x <= 0) && (y >= -r/2 && y <= 0);

        boolean inTriangle = (x >= 0 && x <= r/2) && (y <= r && y >= 0) && (y <= -2*x+ r);

        boolean inCircle = (x >= 0 && y <= 0) && (x*x + y*y <= r*r);

        return inRectangle || inTriangle || inCircle;
    }

    private PointResponse toResponse(Point point) {
        return PointResponse.builder()
                .id(point.getId())
                .x(point.getX())
                .y(point.getY())
                .r(point.getR())
                .hit(point.getHit())
                .createdAt(point.getCreatedAt())
                .executionTime(point.getExecutionTime())
                .build();
    }
}