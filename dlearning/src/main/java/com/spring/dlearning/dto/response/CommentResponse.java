package com.spring.dlearning.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CommentResponse {
    Long id;
    String name;
    String avatar;
    String content;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;

    List<CommentResponse> replies = new ArrayList<>();
}
