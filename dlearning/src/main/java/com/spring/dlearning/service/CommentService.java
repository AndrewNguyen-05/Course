package com.spring.dlearning.service;

import com.spring.dlearning.dto.request.CommentRequest;
import com.spring.dlearning.dto.request.UpdateCommentRequest;
import com.spring.dlearning.dto.response.CommentResponse;
import com.spring.dlearning.dto.response.DeleteCommentResponse;
import com.spring.dlearning.dto.response.UpdateCommentResponse;
import com.spring.dlearning.entity.Comment;
import com.spring.dlearning.entity.Course;
import com.spring.dlearning.entity.User;
import com.spring.dlearning.exception.AppException;
import com.spring.dlearning.exception.ErrorCode;
import com.spring.dlearning.mapper.CommentMapper;
import com.spring.dlearning.mapper.ProfileMapper;
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
import java.util.Objects;

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

    public DeleteCommentResponse deleteCommentById(Long id) {
        String email = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new AppException(ErrorCode.EMAIL_INVALID));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_EXISTED));

        if (Objects.equals(user.getId(), comment.getUser().getId())) {
            commentRepository.deleteById(id);
            return DeleteCommentResponse.builder()
                    .id(id)
                    .message("Delete Comment Successfully")
                    .build();
        }

        throw new AppException(ErrorCode.DELETE_COMMENT_ISVALID);
    }

    public UpdateCommentResponse updateComment(Long id, UpdateCommentRequest request){
        String email = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new AppException(ErrorCode.EMAIL_INVALID));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_EXISTED));

        if(Objects.equals(user.getId(), comment.getUser().getId())) {
            commentMapper.toComment(request,comment);
            commentRepository.save(comment);
            return UpdateCommentResponse.builder()
                    .id(comment.getId())
                    .content(comment.getContent())
                    .build();
        }
        throw new AppException(ErrorCode.UPDATE_COMMENT_ISVALID);

    }
}
