package com.spring.dlearning.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.time.LocalDate;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AdsCreationRequest {

    @NotNull(message = "EMAIL_CONTACT_INVALID")
    String contactEmail;

    @NotNull(message = "PHONE_CONTACT_INVALID")
    String contactPhone;

    @NotNull(message = "TITLE_ADS_INVALID")
    String title;

    String image;

    String description;

    @NotNull(message = "LINK_ADS_INVALID")
    String link;

    @Future(message = "START_DATE_INVALID")
    LocalDate startDate;

    @FutureOrPresent(message = "START_END_INVALID")
    LocalDate endDate;

}
