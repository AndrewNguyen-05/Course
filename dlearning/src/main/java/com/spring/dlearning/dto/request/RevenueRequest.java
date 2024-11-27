package com.spring.dlearning.dto.request;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.spring.dlearning.common.PeriodType;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.format.annotation.DateTimeFormat;
import java.time.LocalDate;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RevenueRequest {

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    LocalDate startDate;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    LocalDate endDate;

    PeriodType periodType;           // Kiểu kỳ hạn (WEEK, MONTH, YEAR)
}
