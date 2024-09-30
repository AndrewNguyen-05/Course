package com.spring.dlearning.dto.response;

import com.spring.dlearning.utils.AdsStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AdsCreationResponse {

    Long id;
    String contactEmail;
    String contactPhone;
    String title;
    String description;
    String imageUrl;
    String link;
    LocalDate startDate;
    LocalDate endDate;
    BigDecimal priceAds;
    AdsStatus status;
    LocalDateTime createAt;
}
