package com.spring.dlearning.service;

import com.spring.dlearning.dto.request.CommentRequest;
import com.spring.dlearning.dto.request.UpdateCommentRequest;
import com.spring.dlearning.dto.response.CommentResponse;
import com.spring.dlearning.dto.response.DeleteCommentResponse;
import com.spring.dlearning.dto.response.UpdateCommentResponse;
import com.spring.dlearning.entity.Review;
import com.spring.dlearning.entity.Course;
import com.spring.dlearning.entity.User;
import com.spring.dlearning.exception.AppException;
import com.spring.dlearning.exception.ErrorCode;
import com.spring.dlearning.mapper.CommentMapper;
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
    CommentMapper commentMapper;
    CourseRepository courseRepository;
    BannedWordsService bannedWordsService;

    public List<CommentResponse> getCommentByCourse(Long id) {
        List<Review> allReviews = reviewRepository.findByCourseId(id);
        return allReviews.stream()
                .filter(comment -> comment.getParentComment() == null)
                .map(commentMapper::toCommentResponse)
                .toList();
    }

    @PreAuthorize("isAuthenticated()")
    @Transactional
    public CommentResponse addComment(CommentRequest commentRequest, Long courseId) {
        String email = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new AppException(ErrorCode.EMAIL_INVALID));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new AppException(ErrorCode.COURSER_NOT_EXISTED));

        Review parentComment = null;
        if (commentRequest.getParentCommentId() != null) {
            parentComment = reviewRepository.findById(commentRequest.getParentCommentId())
                    .orElseThrow(() -> new AppException(ErrorCode.PARENT_COMMENT_NOT_EXISTED));
        }

        if ((commentRequest.getContent() == null || commentRequest.getContent().isEmpty()) && commentRequest.getRating() == null) {
            throw new AppException(ErrorCode.INVALID_COMMENT_OR_RATING);
        }

        if (commentRequest.getRating() != null && (commentRequest.getRating() < 0 || commentRequest.getRating() > 5)) {
            throw new AppException(ErrorCode.INVALID_RATING);
        }

        if (bannedWordsService.containsBannedWords(commentRequest.getContent())) {
            throw new AppException(ErrorCode.INVALID_COMMENT_CONTENT);
        }

        Review newComment = Review.builder()
                .user(user)
                .content(commentRequest.getContent() != null && !commentRequest.getContent().isEmpty()
                        ? commentRequest.getContent()
                        : "")
                .rating(commentRequest.getRating())
                .course(course)
                .parentComment(parentComment)
                .build();

        reviewRepository.save(newComment);

        return commentMapper.toCommentResponse(newComment);
    }


    @PreAuthorize("isAuthenticated()")
    @Transactional
    public DeleteCommentResponse deleteCommentById(Long id) {
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
    public UpdateCommentResponse updateComment(Long id, UpdateCommentRequest request) {
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
