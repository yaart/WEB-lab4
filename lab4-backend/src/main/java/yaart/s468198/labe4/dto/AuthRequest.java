package yaart.s468198.labe4.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AuthRequest {

    @NotBlank(message = "Логин не может быть пустым")
    @Size(min = 3, max = 50, message = "Логин должен содержать от 3 до 50 символов")
    private String username;

    @NotBlank(message = "Пароль не может быть пустым")
    @Size(min = 4, max = 100, message = "Пароль должен содержать от 4 до 100 символов")
    private String password;
}