package com.spring.dlearning.service;

import com.spring.dlearning.dto.request.AdsCreationRequest;
import com.spring.dlearning.dto.response.AdsCreationResponse;
import com.spring.dlearning.entity.Advertisement;
import com.spring.dlearning.entity.Course;
import com.spring.dlearning.entity.User;
import com.spring.dlearning.exception.AppException;
import com.spring.dlearning.exception.ErrorCode;
import com.spring.dlearning.mapper.AdsMapper;
import com.spring.dlearning.repository.AdvertisementRepository;
import com.spring.dlearning.repository.CourseRepository;
import com.spring.dlearning.repository.UserRepository;
import com.spring.dlearning.utils.SecurityUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.net.URISyntaxException;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AdvertisementService {

    AdvertisementRepository advertisementRepository;
    CourseRepository courseRepository;
    UserRepository userRepository;
    FileService fileService;
    AdsMapper adsMapper;

    public AdsCreationResponse userCreateAds(AdsCreationRequest request, MultipartFile image)
            throws URISyntaxException, IOException {

        String email = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new AppException(ErrorCode.EMAIL_INVALID));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new AppException(ErrorCode.COURSER_NOT_EXISTED));

        String imageUrl = fileService.store(image, "upload");
        request.setImage("/upload/" + imageUrl);

        Advertisement advertisement = adsMapper.toAdvertisementEntity(request, course);
        advertisement.setUser(user);
        advertisement.setImage(request.getImage());

        advertisementRepository.save(advertisement);

        return adsMapper.toAdsCreationResponse(advertisement);
    }

}
