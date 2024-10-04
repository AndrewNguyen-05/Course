package com.spring.dlearning.service;

import com.spring.dlearning.dto.request.ReviewRequest;
import com.spring.dlearning.dto.request.UpdateCommentRequest;
import com.spring.dlearning.dto.response.ReviewResponse;
import com.spring.dlearning.dto.response.DeleteCommentResponse;
import com.spring.dlearning.dto.response.UpdateCommentResponse;
import com.spring.dlearning.entity.Review;
import com.spring.dlearning.entity.Course;
import com.spring.dlearning.entity.User;
import com.spring.dlearning.exception.AppException;
import com.spring.dlearning.exception.ErrorCode;
import com.spring.dlearning.mapper.ReviewMapper;
import com.spring.dlearning.repository.ReviewRepository;
import com.spring.dlearning.repository.CourseRepository;
import com.spring.dlearning.repository.UserRepository;
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
public class ReviewService {

    UserRepository userRepository;
    ReviewRepository reviewRepository;
    ReviewMapper reviewMapper;
    CourseRepository courseRepository;
    BannedWordsService bannedWordsService;

    public List<ReviewResponse> getReviewByCourse(Long id) {
        List<Review> allReviews = reviewRepository.findByCourseId(id);
        return allReviews.stream()
                .filter(comment -> comment.getParentReview() == null)
                .map(reviewMapper::toCommentResponse)
                .toList();
    }

    @PreAuthorize("isAuthenticated()")
    @Transactional
    public ReviewResponse addReview(ReviewRequest reviewRequest, Long courseId) {
        String email = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new AppException(ErrorCode.EMAIL_INVALID));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new AppException(ErrorCode.COURSER_NOT_EXISTED));

        Review parentReview = null;
        if (reviewRequest.getParentReviewId() != null) {
            parentReview = reviewRepository.findById(reviewRequest.getParentReviewId())
                    .orElseThrow(() -> new AppException(ErrorCode.PARENT_COMMENT_NOT_EXISTED));
        }

        if ((reviewRequest.getContent() == null || reviewRequest.getContent().isEmpty()) && reviewRequest.getRating() == null) {
            throw new AppException(ErrorCode.INVALID_COMMENT_OR_RATING);
        }

        if (reviewRequest.getRating() != null && (reviewRequest.getRating() < 0 || reviewRequest.getRating() > 5)) {
            throw new AppException(ErrorCode.INVALID_RATING);
        }

        if ( reviewRequest.getContent()!= null && bannedWordsService.containsBannedWords(reviewRequest.getContent())) {
            throw new AppException(ErrorCode.INVALID_COMMENT_CONTENT);
        }

        Review newComment = Review.builder()
                .user(user)
                .content(reviewRequest.getContent() != null && !reviewRequest.getContent().isEmpty()
                        ? reviewRequest.getContent()
                        : "")
                .rating(reviewRequest.getRating())
                .course(course)
                .parentReview(parentReview)
                .build();

        reviewRepository.save(newComment);

        return reviewMapper.toCommentResponse(newComment);
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
    public UpdateCommentResponse updateReview(Long id, UpdateCommentRequest request) {
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

            return UpdateCommentResponse.builder()
                    .id(comment.getId())
                    .content(comment.getContent())
                    .build();
        }

        throw new AppException(ErrorCode.UPDATE_COMMENT_INVALID);
    }

}
