package com.spring.dlearning.service;

import com.spring.dlearning.constant.PredefinedRole;
import com.spring.dlearning.dto.request.CommentLessonRequest;
import com.spring.dlearning.dto.request.LessonCreationRequest;
import com.spring.dlearning.dto.response.CommentLessonResponse;
import com.spring.dlearning.dto.response.LessonCreationResponse;
import com.spring.dlearning.entity.*;
import com.spring.dlearning.exception.AppException;
import com.spring.dlearning.exception.ErrorCode;
import com.spring.dlearning.mapper.LessonMapper;
import com.spring.dlearning.repository.*;
import com.spring.dlearning.utils.SecurityUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class LessonService {

    LessonRepository lessonRepository;
    ChapterRepository chapterRepository;
    CourseRepository courseRepository;
    CloudinaryService cloudinaryService;
    UserRepository userRepository;
    ReviewRepository reviewRepository;
    BannedWordsService bannedWordsService;
    LessonMapper lessonMapper;

    @Transactional
    @PreAuthorize("isAuthenticated() and hasAuthority('TEACHER')")
    public LessonCreationResponse createLesson(LessonCreationRequest request, MultipartFile video)
            throws IOException {
        var email = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new AppException(ErrorCode.EMAIL_INVALID));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if(! Objects.equals(user.getRole().getName(), PredefinedRole.TEACHER_ROLE)){
            throw new AppException(ErrorCode.ACCESSDENIED);
        }

        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_EXISTED));

        Chapter chapter = chapterRepository.findById(request.getChapterId())
                .orElseThrow(() -> new AppException(ErrorCode.CHAPTER_NOT_EXIST));

        String videoUrl = cloudinaryService.uploadVideoChunked(video, "courses").get("url").toString();

        Lesson lesson = Lesson.builder()
                .chapter(chapter)
                .lessonName(request.getLessonName())
                .description(request.getDescription())
                .videoUrl(videoUrl)
                .build();

        lessonRepository.save(lesson);

        return LessonCreationResponse.builder()
                .courseId(course.getId())
                .chapterId(chapter.getId())
                .lessonId(lesson.getId())
                .lessonName(request.getLessonName())
                .videoUrl(lesson.getVideoUrl())
                .lessonDescription(lesson.getDescription())
                .build();
    }

    @PreAuthorize("isAuthenticated()")
    public List<CommentLessonResponse> getCommentByLesson(Long lessonId) {
        return reviewRepository.findByLessonId(lessonId)
                .stream().map(lessonMapper::toCommentLessonResponse).toList();
    }

    @PreAuthorize("isAuthenticated()")
    public CommentLessonResponse addCommentLesson(CommentLessonRequest request){
            var email = SecurityUtils.getCurrentUserLogin()
                    .orElseThrow(() -> new AppException(ErrorCode.EMAIL_INVALID));

            var user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

            var course = courseRepository.findById(request.getCourseId())
                    .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_EXISTED));

            var chapter = chapterRepository.findById(request.getChapterId())
                    .orElseThrow(() -> new AppException(ErrorCode.CHAPTER_NOT_EXIST));

            Lesson lesson = lessonRepository.findById(request.getLessonId())
                    .orElseThrow(() -> new AppException(ErrorCode.LESSON_NOT_EXIST));

            Review parentReview = null;
            if(request.getParentReviewId() != null){
                parentReview = reviewRepository.findById(request.getParentReviewId())
                        .orElseThrow(() -> new AppException(ErrorCode.PARENT_COMMENT_NOT_EXISTED));
            }

            if ((request.getContent() == null || request.getContent().isEmpty())) {
                throw new AppException(ErrorCode.INVALID_COMMENT_CONTENT);
            }

            if(bannedWordsService.containsBannedWords(request.getContent())){
                throw new AppException(ErrorCode.INVALID_COMMENT_CONTENT);
            }

            Review review = Review.builder()
                    .course(course)
                    .chapter(chapter)
                    .lesson(lesson)
                    .user(user)
                    .content(request.getContent())
                    .parentReview(parentReview)
                    .build();

            reviewRepository.save(review);

            return lessonMapper.toCommentLessonResponse(review);
    }

    @PreAuthorize("isAuthenticated()")
    public void deleteCommentLesson(Long reviewId) {
        if ( reviewId <= 0 ){
            throw new AppException(ErrorCode.INVALID_PATH_VARIABLE_ID);
        }
        var email = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new AppException(ErrorCode.EMAIL_INVALID));

        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_EXISTED));

        if (!Objects.equals(user.getId(), review.getUser().getId())) {
            throw new AppException(ErrorCode.ACCESSDENIED);
        }
        review.setLesson(null);
        review.setContent(null);
        reviewRepository.save(review);
    }
}
