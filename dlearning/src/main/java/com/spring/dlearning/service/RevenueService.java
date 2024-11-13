package com.spring.dlearning.service;

import com.spring.dlearning.dto.request.PeriodTypeRequest;
import com.spring.dlearning.dto.request.RevenueRequest;
import com.spring.dlearning.dto.response.RevenueDetailResponse;
import com.spring.dlearning.dto.response.RevenueResponse;
import com.spring.dlearning.entity.Payment;
import com.spring.dlearning.entity.User;
import com.spring.dlearning.exception.AppException;
import com.spring.dlearning.exception.ErrorCode;
import com.spring.dlearning.repository.PaymentRepository;
import com.spring.dlearning.repository.UserRepository;
import com.spring.dlearning.utils.PeriodType;
import com.spring.dlearning.utils.SecurityUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class RevenueService {
    PaymentRepository paymentRepository;
    UserRepository userRepository;

    public RevenueResponse totalRevenue (RevenueRequest request) {
        String email = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        LocalDateTime start;
        LocalDateTime end = LocalDateTime.now();

        if(request.getStartDate() != null && request.getEndDate() != null) {
            start = request.getStartDate().atStartOfDay();
            end = request.getEndDate().atTime(LocalTime.MAX);
        } else {
            start = switch (request.getPeriodType()) {
                case DAY -> end.toLocalDate().atStartOfDay();
                case WEEK -> end.minusDays(7);
                case MONTH -> end.minusMonths(1);
                case YEAR -> end.minusYears(1);
            };
        }
        List<Payment> payments = paymentRepository.findByUserAndDateRange(user, start, end);

        return RevenueResponse.builder()
                .startDate(start.toLocalDate())
                .endDate(end.toLocalDate())
                .periodType(request.getPeriodType())
                .totalRevenue(payments.stream().map(Payment::getPrice).reduce(BigDecimal.ZERO, BigDecimal::add))
                .build();
    }

    public List<RevenueDetailResponse> totalRevenueDetail (PeriodTypeRequest request) {
        String email = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (request.getPeriodType() == null || request.getYear() == null) {
            return null;
        }
        List<RevenueDetailResponse> revenueDetails = new ArrayList<>();
        int year = request.getYear();
        if(request.getPeriodType().equals(PeriodType.YEAR) && request.getMonth() == null) {

            for(int month  = 1; month <= 12; month ++) {
                LocalDateTime start = LocalDateTime.of(year, month, 1, 0, 0);
                LocalDateTime end = start.plusMonths(1).minusDays(1);

                List<Payment> payments = paymentRepository.findByUserAndDateRange(user, start, end);
                BigDecimal monthRevenue = payments.stream()
                        .map(Payment::getPrice)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);

                RevenueDetailResponse detailMonth = RevenueDetailResponse.builder()
                        .month(month)
                        .year(year)
                        .revenue(monthRevenue)
                        .build();
                revenueDetails.add(detailMonth);
            }
        } else if (request.getPeriodType().equals(PeriodType.YEAR)) {
            int month = request.getMonth();
            LocalDateTime start = LocalDateTime.of(year, month, 1, 0, 0);
            LocalDateTime endOfMonth = start.withDayOfMonth(start.toLocalDate().lengthOfMonth()) // xác định ngày cuối cùng trong tháng
                    .toLocalDate().atTime(23, 59, 59); // tinh toan ngày và giờ cuối cùng trong tháng(23h:59:59 ngày cuối cùng trong tháng)

            int totalWeek = (int) Math.ceil((double) endOfMonth.getDayOfMonth() / 7);
            for(int week = 1; week <= totalWeek; week ++) {
                LocalDateTime end = start.plusWeeks(1).minusSeconds(1);
                if (end.isAfter(endOfMonth)) {
                    endOfMonth = end; // Tuần cuối không vượt quá ngày cuối của tháng
                }
                List<Payment> payments = paymentRepository.findByUserAndDateRange(user, start, end);

                BigDecimal weekRevenue = payments.stream().map(Payment::getPrice)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);

                RevenueDetailResponse detailWeek = RevenueDetailResponse.builder()
                        .week(week)
                        .month(month)
                        .year(year)
                        .revenue(weekRevenue)
                        .build();

                revenueDetails.add(detailWeek);
                start = end.plusSeconds(1);
            }
        }

        return revenueDetails;
    }
}
