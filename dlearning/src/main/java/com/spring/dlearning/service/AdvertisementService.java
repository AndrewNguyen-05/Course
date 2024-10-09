package com.spring.dlearning.service;

import com.spring.dlearning.dto.event.NotificationEvent;
import com.spring.dlearning.dto.request.AdsApproveRequest;
import com.spring.dlearning.dto.request.AdsCreationRequest;
import com.spring.dlearning.dto.response.AdsApproveResponse;
import com.spring.dlearning.dto.response.AdsCreationResponse;
import com.spring.dlearning.dto.response.PageResponse;
import com.spring.dlearning.entity.Advertisement;
import com.spring.dlearning.entity.User;
import com.spring.dlearning.exception.AppException;
import com.spring.dlearning.exception.ErrorCode;
import com.spring.dlearning.mapper.AdsMapper;
import com.spring.dlearning.repository.AdvertisementRepository;
import com.spring.dlearning.repository.UserRepository;
import com.spring.dlearning.utils.AdsStatus;
import com.spring.dlearning.utils.SecurityUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AdvertisementService {

    AdvertisementRepository advertisementRepository;
    UserRepository userRepository;
    CloudinaryService cloudinaryService;
    AdsMapper adsMapper;
    KafkaTemplate<String, Object> kafkaTemplate;

    public AdsCreationResponse userCreateAds(AdsCreationRequest request, MultipartFile image)
    {
        String email = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new AppException(ErrorCode.EMAIL_INVALID));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        String imageUrl = cloudinaryService.uploadImage(image);
        request.setImage(imageUrl);

        Advertisement advertisement = adsMapper.toAdvertisementEntity(request);
        advertisement.setUser(user);
        advertisement.setImage(request.getImage());

        advertisementRepository.save(advertisement);

        return adsMapper.toAdsCreationResponse(advertisement);
    }

    public AdsApproveResponse approveAds(AdsApproveRequest request) {
        Advertisement advertisement = advertisementRepository.findById(request.getId())
                .orElseThrow(() -> new AppException(ErrorCode.ADVERTISEMENT_ID_INVALID));

        advertisement.setApprovalStatus(AdsStatus.AWAITING_PAYMENT);
        advertisementRepository.save(advertisement);

        NotificationEvent event = NotificationEvent.builder()
                .channel("Ads")
                .recipient(advertisement.getContactEmail())
                .templateCode("info-ads")
                .subject("Congratulations! Your ad has been approved.")
                .body("Congratulations, your ad titled '" + advertisement.getTitle() + "' has been approved.")
                .build();

        kafkaTemplate.send("notification-delivery", event);

        return adsMapper.toAdsApproveResponse(advertisement);
    }

    @PreAuthorize("isAuthenticated()")
    public PageResponse<AdsCreationResponse> getAdsByCurrentLogin(int page, int size){
        String email = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new AppException(ErrorCode.EMAIL_INVALID));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Pageable pageable = PageRequest.of(page - 1, size);

        Page<Advertisement> advertisements = advertisementRepository
                .findAdvertisementByUserId(user.getId(), pageable);

        return PageResponse.<AdsCreationResponse>builder()
                .currentPage(page)
                .pageSize(pageable.getPageSize())
                .totalPages(advertisements.getTotalPages())
                .totalElements(advertisements.getTotalElements())
                .data(advertisements.getContent().stream()
                        .map(adsMapper::toAdsCreationResponse).toList())
                .build();
    }

}
