package com.spring.dlearning.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateCommentRequest {

    @NotBlank(message = "CONTENT_COMMENT_INVALID")
    @Size( max = 500, message = "CONTENT_INVALID")
    String content;
}
