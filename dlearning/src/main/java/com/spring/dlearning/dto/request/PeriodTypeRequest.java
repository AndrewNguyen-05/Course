package com.spring.dlearning.dto.request;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.spring.dlearning.common.PeriodType;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PeriodTypeRequest {
    Integer year;
    Integer month;
    PeriodType periodType;
}
