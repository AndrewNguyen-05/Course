package com.spring.dlearning.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.spring.dlearning.dto.request.CreationChapterRequest;
import com.spring.dlearning.dto.response.CreationChapterResponse;
import com.spring.dlearning.service.ChapterService;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import java.util.HashSet;

@SpringBootTest
@Slf4j
@AutoConfigureMockMvc(addFilters = false) // tạo mock request tới controller
class ChapterControllerTest {

    @Autowired
    private MockMvc mockMvc; // -> gọi tới Api của chúng ta

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ChapterService chapterService; // -> dùng để móc các hàm trong userService khi cần sử dụng -> MockBean

    private CreationChapterRequest request; // đầu vào -> input

    private CreationChapterResponse response;

    @BeforeEach
    public void initData() {
        // Khởi tạo dữ liệu trước khi chạy xuống các test case bên dưới
        request = CreationChapterRequest.builder()
                .courseId(10L)
                .chapterName("Spring boot 3")
                .description("RoadMap Spring boot 3 2024")
                .build();

        response = CreationChapterResponse.builder()
                .userName("Le Khanh Duc")
                .courseId(10L)
                .chapterId(10L)
                .chapterName("Spring boot 3")
                .description("RoadMap Spring boot 3 2024")
                .lessons(new HashSet<>())
                .build();
    }

    @Test
    void createChapter_validRequest_success() throws Exception {
        Mockito.when(chapterService.createChapter(ArgumentMatchers.any(CreationChapterRequest.class))).thenReturn(response);

        // Chuyển đổi request thành JSON
        String jsonRequest = objectMapper.writeValueAsString(request);

        // Gọi API và kiểm tra kết quả trả về (WHEN, THEN)
        mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/create/chapter")
                        .contentType(MediaType.APPLICATION_JSON_VALUE)
                        .content(jsonRequest))
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.jsonPath("code").value(201))
                .andExpect(MockMvcResultMatchers.jsonPath("result.courseId").value(response.getCourseId()))
                .andExpect(MockMvcResultMatchers.jsonPath("result.chapterName").value(response.getChapterName()))
                .andExpect(MockMvcResultMatchers.jsonPath("result.description").value(response.getDescription()))
                .andExpect(MockMvcResultMatchers.jsonPath("result.userName").value(response.getUserName()));
    }

}

