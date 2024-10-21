package com.spring.dlearning.service;

import com.spring.dlearning.dto.request.ReviewLessonRequest;
import com.spring.dlearning.dto.request.UpdateReviewLessonRequest;
import com.spring.dlearning.dto.request.UpdateReviewRequest;
import com.spring.dlearning.dto.response.DeleteCommentResponse;
import com.spring.dlearning.dto.response.ReviewLessonResponse;
import com.spring.dlearning.dto.response.UpdateReviewResponse;
import com.spring.dlearning.entity.*;
import com.spring.dlearning.exception.AppException;
import com.spring.dlearning.exception.ErrorCode;
import com.spring.dlearning.mapper.ReviewMapper;
import com.spring.dlearning.repository.*;
import com.spring.dlearning.utils.SecurityUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ReviewLessonService {

    UserRepository userRepository;
    ReviewRepository reviewRepository;
    ReviewMapper reviewMapper;
    CourseRepository courseRepository;
    ChapterRepository chapterRepository;
    LessonRepository lessonRepository;
    BannedWordsService bannedWordsService;

    public List<ReviewLessonResponse> getReviewLessonByCourse(Long courseId, Long chapterId, Long lessonId) {
        List<Review> allReviews = reviewRepository.findByCourseIdAndChapterIdAndLessonId(courseId, chapterId, lessonId);
        return allReviews.stream()
                .filter(comment -> comment.getParentReview() == null)
                .map(reviewMapper::toResponseLesson)
                .toList();
    }

    @PreAuthorize("isAuthenticated()")
    @Transactional
    public ReviewLessonResponse addReview(ReviewLessonRequest reviewLessonRequest) {
        String email = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new AppException(ErrorCode.EMAIL_INVALID));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Course course = courseRepository.findById(reviewLessonRequest.getCourseId())
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_EXISTED));

        Chapter chapter = chapterRepository.findById(reviewLessonRequest.getChapterId())
                .orElseThrow(() -> new AppException(ErrorCode.CHAPTER_NOT_EXIST));

        Lesson lesson = lessonRepository.findById(reviewLessonRequest.getLessonId())
                .orElseThrow(() -> new AppException(ErrorCode.LESSON_NOT_EXIST));

        Review parentReview = null;
        if (reviewLessonRequest.getParentReviewId() != null) {
            parentReview = reviewRepository.findById(reviewLessonRequest.getParentReviewId())
                    .orElseThrow(() -> new AppException(ErrorCode.PARENT_COMMENT_NOT_EXISTED));
        }

        if ((reviewLessonRequest.getContent() == null || reviewLessonRequest.getContent().isEmpty())) {
            throw new AppException(ErrorCode.INVALID_COMMENT_OR_RATING);
        }


        if ( reviewLessonRequest.getContent()!= null && bannedWordsService.containsBannedWords(reviewLessonRequest.getContent())) {
            throw new AppException(ErrorCode.INVALID_COMMENT_CONTENT);
        }

        Review newComment = Review.builder()
                .user(user)
                .content(reviewLessonRequest.getContent() != null && !reviewLessonRequest.getContent().isEmpty()
                        ? reviewLessonRequest.getContent()
                        : "")
                .course(course)
                .chapter(chapter)
                .lesson(lesson)
                .parentReview(parentReview)
                .build();

        reviewRepository.save(newComment);

        return reviewMapper.toResponseLesson(newComment);
    }

    @PreAuthorize("isAuthenticated()")
    @Transactional
    public DeleteCommentResponse deleteReviewById(Long id) {
        String email = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new AppException(ErrorCode.EMAIL_INVALID));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Review comment = reviewRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_EXISTED));

        if (Objects.equals(user.getId(), comment.getUser().getId())) {
            reviewRepository.deleteById(id);
            return DeleteCommentResponse.builder()
                    .id(id)
                    .message("Delete Comment Successfully")
                    .build();
        }

        throw new AppException(ErrorCode.DELETE_COMMENT_INVALID);
    }

    @PreAuthorize("isAuthenticated()")
    @Transactional
    public UpdateReviewResponse updateReview(Long id, UpdateReviewLessonRequest request) {
        String email = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new AppException(ErrorCode.EMAIL_INVALID));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Review comment = reviewRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_EXISTED));

        if (Objects.equals(user.getId(), comment.getUser().getId())) {
            if (request.getContent() != null && bannedWordsService.containsBannedWords(request.getContent())) {
                throw new AppException(ErrorCode.INVALID_COMMENT_CONTENT);
            }

            if (request.getContent() != null) {
                comment.setContent(request.getContent());
            }
            reviewRepository.save(comment);

            return UpdateReviewResponse.builder()
                    .id(comment.getId())
                    .content(comment.getContent())
                    .build();
        }

        throw new AppException(ErrorCode.UPDATE_COMMENT_INVALID);
    }
}
