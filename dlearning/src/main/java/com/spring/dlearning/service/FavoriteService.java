package com.spring.dlearning.service;

import com.spring.dlearning.dto.response.PageResponse;
import com.spring.dlearning.entity.Favorite;
import com.spring.dlearning.exception.AppException;
import com.spring.dlearning.exception.ErrorCode;
import com.spring.dlearning.repository.FavoriteRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class FavoriteService {

    FavoriteRepository favoriteRepository;

    @PreAuthorize("isAuthenticated()")
    public Favorite save (Favorite favorite) {
        return favoriteRepository.save(favorite);
    }

    public Favorite findById(Integer id) {
        return favoriteRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.FAVORITE_NOT_EXISTED));
    }

    @PreAuthorize("isAuthenticated()")
    public PageResponse<Favorite> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Favorite> favorites = favoriteRepository.findAll(pageable);

        return PageResponse.<Favorite>builder()
                .totalElements(favorites.getTotalElements())
                .totalPages(favorites.getTotalPages())
                .pageSize(favorites.getSize())
                .data(favorites.getContent().stream().toList())
                .build();
    }
}
