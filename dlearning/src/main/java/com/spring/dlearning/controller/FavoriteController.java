package com.spring.dlearning.controller;

import com.spring.dlearning.dto.response.ApiResponse;
import com.spring.dlearning.dto.response.PageResponse;
import com.spring.dlearning.entity.Favorite;
import com.spring.dlearning.service.FavoriteService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/v1")
@Slf4j
public class FavoriteController {

    FavoriteService favoriteService;

    @PostMapping("/save-favorite")
    ApiResponse<Favorite> saveFavorite (@RequestBody Favorite favorite) {
        var result = favoriteService.save(favorite);

        return ApiResponse.<Favorite>builder()
                .code(HttpStatus.CREATED.value())
                .result(result)
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

    @GetMapping("/fetch-all-favorite")
    ApiResponse<PageResponse<Favorite>> fetchAllFavorite (@RequestParam(value = "page", required = false, defaultValue = "1") int page,
                                                          @RequestParam(value = "size", required = false, defaultValue = "4")  int size) {
        var result = favoriteService.findAll(page, size);

        return ApiResponse.<PageResponse<Favorite>>builder()
                .code(HttpStatus.OK.value())
                .result(result)
                .build();
    }
}
