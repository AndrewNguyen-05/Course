package com.spring.dlearning.service;

import com.spring.dlearning.dto.request.AdsApproveRequest;
import com.spring.dlearning.dto.request.AdsCreationRequest;
import com.spring.dlearning.dto.response.AdsApproveResponse;
import com.spring.dlearning.dto.response.AdsCreationResponse;
import com.spring.dlearning.entity.Advertisement;
import com.spring.dlearning.entity.User;
import com.spring.dlearning.exception.AppException;
import com.spring.dlearning.exception.ErrorCode;
import com.spring.dlearning.mapper.AdsMapper;
import com.spring.dlearning.repository.AdvertisementRepository;
import com.spring.dlearning.repository.UserRepository;
import com.spring.dlearning.utils.AdsStatus;
import com.spring.dlearning.utils.SecurityUtils;
import jakarta.mail.MessagingException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.UnsupportedEncodingException;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AdvertisementService {

    AdvertisementRepository advertisementRepository;
    UserRepository userRepository;
    CloudinaryService cloudinaryService;
    AdsMapper adsMapper;
    EmailService emailService;

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


    public AdsApproveResponse approveAds(AdsApproveRequest request)
            throws MessagingException, UnsupportedEncodingException {

        Advertisement advertisement = advertisementRepository.findById(request.getId())
                .orElseThrow(() -> new AppException(ErrorCode.ADVERTISEMENT_ID_INVALID));

        advertisement.setApprovalStatus(AdsStatus.AWAITING_PAYMENT);
        advertisementRepository.save(advertisement);

        emailService.confirmAdvertisement(advertisement.getContactEmail(), advertisement);

        return adsMapper.toAdsApproveResponse(advertisement);
    }

}
