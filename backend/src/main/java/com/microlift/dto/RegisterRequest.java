package com.microlift.dto;
import com.microlift.model.User;
import lombok.*;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class RegisterRequest {
    private String fullName;
    private String email;
    private String password;
    private String phoneNumber;
    private User.Role role;
}
