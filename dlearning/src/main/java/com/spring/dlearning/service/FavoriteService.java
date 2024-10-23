package com.spring.dlearning.service;

import com.spring.dlearning.dto.request.FavoriteRequest;
import com.spring.dlearning.dto.response.FavoriteResponse;
import com.spring.dlearning.dto.response.PageResponse;
import com.spring.dlearning.entity.Course;
import com.spring.dlearning.entity.Favorite;
import com.spring.dlearning.entity.User;
import com.spring.dlearning.exception.AppException;
import com.spring.dlearning.exception.ErrorCode;
import com.spring.dlearning.mapper.FavoriteMapper;
import com.spring.dlearning.repository.CourseRepository;
import com.spring.dlearning.repository.FavoriteRepository;
import com.spring.dlearning.repository.UserRepository;
import com.spring.dlearning.utils.SecurityUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class FavoriteService {

    FavoriteRepository favoriteRepository;
    UserRepository userRepository;
    CourseRepository courseRepository;
    FavoriteMapper favoriteMapper;

    @PreAuthorize("isAuthenticated()")
    public void createFavorite (FavoriteRequest request) {
        String email = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new AppException(ErrorCode.EMAIL_INVALID));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Course course = courseRepository.findById(request.getId())
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_EXISTED));

        boolean isAlreadyFavorite = favoriteRepository.existsByUserAndCourse(user, course);
        if (isAlreadyFavorite) {
            throw new AppException(ErrorCode.ALREADY_IN_FAVORITES);
        }

        Favorite favorite = Favorite.builder()
                .user(user)
                .course(course)
                .build();

        favoriteRepository.save(favorite);
    }

    public Favorite findById(Integer id) {
        if ( id <= 0 ){
            throw new AppException(ErrorCode.INVALID_PATH_VARIABLE_ID);
        }
        return favoriteRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.FAVORITE_NOT_EXISTED));
    }

    @PreAuthorize("isAuthenticated()")
    public PageResponse<FavoriteResponse> findAllByUserCurrent(int page, int size) {

        String email = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new AppException(ErrorCode.EMAIL_INVALID));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Favorite> favorites = favoriteRepository.findByUser(user, pageable);

        return PageResponse.<FavoriteResponse>builder()
                .currentPage(page)
                .pageSize(favorites.getSize())
                .totalPages(favorites.getTotalPages())
                .totalElements(favorites.getTotalElements())
                .data(favorites.getContent().stream().map(favoriteMapper::toFavoriteResponse).toList())
                .build();
    }

    @Transactional
    @PreAuthorize("isAuthenticated()")
    public void deleteFavorite(Integer favoriteId){
        if ( favoriteId <= 0 ){
            throw new AppException(ErrorCode.INVALID_PATH_VARIABLE_ID);
        }

        String email = SecurityUtils.getCurrentUserLogin()
                        .orElseThrow(() -> new AppException(ErrorCode.EMAIL_INVALID));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        List<Favorite> favorites = favoriteRepository.findByUser(user);

        Favorite favoriteToDelete = favorites.stream()
                .filter(f -> Objects.equals(f.getId(), favoriteId))
                .findFirst()
                .orElseThrow(() -> new AppException(ErrorCode.FAVORITE_NOT_FOUND));

        favoriteRepository.delete(favoriteToDelete);
    }

}
