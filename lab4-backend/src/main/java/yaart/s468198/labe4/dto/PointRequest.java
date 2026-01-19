package yaart.s468198.labe4.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PointRequest {

    @NotNull(message = "Координата X обязательна")
    private Double x;

    @NotNull(message = "Координата Y обязательна")
    private Double y;

    @NotNull(message = "Радиус R обязателен")
    private Double r;
}