package com.spring.dlearning.dto.response;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class OutboundFacebookResponse {
    String id;
    String email;
    String firstName;
    String lastName;
    String name;
    PictureData picture;

    @Data
    @FieldDefaults(level = AccessLevel.PRIVATE)
    @JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
    public static class PictureData {
        Picture picture;

        @Data
        @FieldDefaults(level = AccessLevel.PRIVATE)
        @JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
        public static class Picture {
            String url;
        }
    }
}