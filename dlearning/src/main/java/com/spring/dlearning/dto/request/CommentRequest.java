package com.spring.dlearning.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CommentRequest {

    @NotBlank(message = "Content cannot be empty")
    @Size(max = 300, message = "Content cannot exceed 300 characters")
    String content;
    Long parentCommentId;
    Long courseId;
}
