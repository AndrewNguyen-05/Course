package com.spring.dlearning.mapper;

import com.spring.dlearning.dto.request.AdsCreationRequest;
import com.spring.dlearning.dto.response.AdsApproveResponse;
import com.spring.dlearning.dto.response.AdsCreationResponse;
import com.spring.dlearning.entity.Advertisement;
import com.spring.dlearning.repository.AdvertisementRepository;
import com.spring.dlearning.repository.UserRepository;
import com.spring.dlearning.utils.AdsStatus;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Component
public class AdsMapper {

    AdvertisementRepository advertisementRepository;
    UserRepository userRepository;

    public AdsMapper(AdvertisementRepository advertisementRepository, UserRepository userRepository) {
        this.advertisementRepository = advertisementRepository;
        this.userRepository = userRepository;
    }

    public Advertisement toAdvertisementEntity(AdsCreationRequest request) {

        return Advertisement.builder()
                .contactEmail(request.getContactEmail())
                .contactPhone(request.getContactPhone())
                .title(request.getTitle())
                .image(request.getImage())
                .link(request.getLink())
                .description(request.getDescription())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .price(totalOfMoneyAds(request.getStartDate(), request.getEndDate()))
                .approvalStatus(AdsStatus.PENDING)
                .build();
    }

    public AdsCreationResponse toAdsCreationResponse(Advertisement advertisement) {
        return AdsCreationResponse.builder()
                .id(advertisement.getId())
                .contactEmail(advertisement.getContactEmail())
                .contactPhone(advertisement.getContactPhone())
                .title(advertisement.getTitle())
                .description(advertisement.getDescription())
                .startDate(advertisement.getStartDate())
                .endDate(advertisement.getEndDate())
                .priceAds(totalOfMoneyAds(advertisement.getStartDate(), advertisement.getEndDate()))
                .imageUrl(advertisement.getImage())
                .link(advertisement.getLink())
                .status(advertisement.getApprovalStatus())
                .createAt(advertisement.getCreatedAt())
                .build();
    }

    public AdsApproveResponse toAdsApproveResponse(Advertisement advertisement) {
        return AdsApproveResponse.builder()
                .id(advertisement.getId())
                .contactEmail(advertisement.getContactEmail())
                .contactPhone(advertisement.getContactPhone())
                .title(advertisement.getTitle())
                .description(advertisement.getDescription())
                .link(advertisement.getLink())
                .imageUrl(advertisement.getImage())
                .startDate(advertisement.getStartDate())
                .endDate(advertisement.getEndDate())
                .priceAds(totalOfMoneyAds(advertisement.getStartDate(), advertisement.getEndDate()))
                .status(advertisement.getApprovalStatus())
                .build();
    }

    private BigDecimal totalOfMoneyAds (LocalDate startDate, LocalDate endDate){
        long totalDay = ChronoUnit.DAYS.between(startDate, endDate);

        BigDecimal dailyRate  = BigDecimal.valueOf(100000);

        return dailyRate.multiply(BigDecimal.valueOf(totalDay));
    }
}
