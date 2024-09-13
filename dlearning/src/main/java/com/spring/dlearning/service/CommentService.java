package com.spring.dlearning.service;

import com.spring.dlearning.dto.request.CommentRequest;
import com.spring.dlearning.dto.response.CommentResponse;
import com.spring.dlearning.entity.Comment;
import com.spring.dlearning.entity.Course;
import com.spring.dlearning.entity.User;
import com.spring.dlearning.exception.AppException;
import com.spring.dlearning.exception.ErrorCode;
import com.spring.dlearning.mapper.CommentMapper;
import com.spring.dlearning.repository.CommentRepository;
import com.spring.dlearning.repository.CourseRepository;
import com.spring.dlearning.repository.UserRepository;
import com.spring.dlearning.utils.SecurityUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class CommentService {

    UserRepository userRepository;
    CommentRepository commentRepository;
    CommentMapper commentMapper;
    CourseRepository courseRepository;

    public List<CommentResponse> getCommentByCourse(Long id) {
        List<Comment> allComments = commentRepository.findByCourseId(id);
        return allComments.stream()
                .filter(comment -> comment.getParentComment() == null)
                .map(commentMapper::toCommentResponse)
                .toList();
    }

    public CommentResponse addComment(CommentRequest commentRequest, Long courseId) {
        String email = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new AppException(ErrorCode.EMAIL_INVALID));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new AppException(ErrorCode.COURSER_NOT_EXISTED));

        Comment parentComment = null;
        if (commentRequest.getParentCommentId() != null) {
            parentComment = commentRepository.findById(commentRequest.getParentCommentId())
                    .orElseThrow(() -> new AppException(ErrorCode.PARENT_COMMENT_NOT_EXISTED));
        }

        Comment newComment = Comment.builder()
                .user(user)
                .content(commentRequest.getContent())
                .course(course)
                .parentComment(parentComment)
                .build();

        commentRepository.save(newComment);

        return commentMapper.toCommentResponse(newComment);
    }

}
