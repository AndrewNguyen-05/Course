package com.spring.dlearning.controller;

import com.spring.dlearning.dto.response.ApiResponse;
import com.spring.dlearning.dto.response.FavoriteResponse;
import com.spring.dlearning.dto.response.PageResponse;
import com.spring.dlearning.entity.Favorite;
import com.spring.dlearning.service.FavoriteService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/v1")
@Slf4j
public class FavoriteController {

    FavoriteService favoriteService;

    @PostMapping("/save-favorite")
    ApiResponse<Void> saveFavorite (@RequestParam Long id) {
         favoriteService.createFavorite(id);

        return ApiResponse.<Void>builder()
                .code(HttpStatus.CREATED.value())
                .message("Save Favorite Successfully")
                .build();
    }

    @GetMapping("/favorite/{id}")
    ApiResponse<Favorite> getFavorite (@PathVariable Integer id) {
        var result = favoriteService.findById(id);

        return ApiResponse.<Favorite>builder()
                .code(HttpStatus.OK.value())
                .result(result)
                .build();
    }

    @GetMapping("/fetch-all-favorites")
    ApiResponse<PageResponse<FavoriteResponse>> fetchAllFavorite (@RequestParam(value = "page", required = false, defaultValue = "1") int page,
                                                                  @RequestParam(value = "size", required = false, defaultValue = "6")  int size) {
        var result = favoriteService.findAllByUserCurrent(page, size);

        return ApiResponse.<PageResponse<FavoriteResponse>>builder()
                .code(HttpStatus.OK.value())
                .result(result)
                .build();
    }

}
