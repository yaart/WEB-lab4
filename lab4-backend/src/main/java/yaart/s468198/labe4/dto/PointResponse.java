package yaart.s468198.labe4.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class PointResponse {
    private Long id;
    private Double x;
    private Double y;
    private Double r;
    private Boolean hit;
    private LocalDateTime createdAt;
    private Long executionTime;
}