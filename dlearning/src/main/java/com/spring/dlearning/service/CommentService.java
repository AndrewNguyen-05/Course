package com.spring.dlearning.service;

import com.spring.dlearning.constant.PredefinedRole;
import com.spring.dlearning.dto.request.CommentRequest;
import com.spring.dlearning.dto.response.CommentResponse;
import com.spring.dlearning.dto.response.PageResponse;
import com.spring.dlearning.entity.Comment;
import com.spring.dlearning.entity.Post;
import com.spring.dlearning.entity.User;
import com.spring.dlearning.exception.AppException;
import com.spring.dlearning.exception.ErrorCode;
import com.spring.dlearning.mapper.CommentMapper;
import com.spring.dlearning.repository.CommentRepository;
import com.spring.dlearning.repository.PostRepository;
import com.spring.dlearning.repository.UserRepository;
import com.spring.dlearning.utils.SecurityUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class CommentService {

    CommentRepository commentRepository;
    PostRepository postRepository;
    UserRepository userRepository;
    CommentMapper commentMapper;
    BannedWordsService bannedWordsService;

    @PreAuthorize("isAuthenticated()")
    public PageResponse<CommentResponse> getCommentByPostId(Long postId, int page, int size) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        Pageable pageable = PageRequest.of(page - 1, size, sort);

        Page<Comment> parentComments = commentRepository.findCommentByPostIdAndParentCommentIsNull(postId, pageable);

        List<CommentResponse> responses = parentComments.getContent()
                .stream()
                .map(comment -> {
                    CommentResponse response = commentMapper.toCommentResponse(comment);

                    List<CommentResponse> replies = comment.getReplies().stream()
                            .map(commentMapper::toCommentResponse)
                            .toList();
                    response.setReplies(replies);
                    return response;
                })
                .toList();

        return PageResponse.<CommentResponse>builder()
                .currentPage(page)
                .pageSize(pageable.getPageSize())
                .totalElements(parentComments.getTotalElements())
                .totalPages(parentComments.getTotalPages())
                .data(responses)
                .build();
    }


    @PreAuthorize("isAuthenticated()")
    public CommentResponse addComment(CommentRequest request) {

        String email = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new AppException(ErrorCode.EMAIL_INVALID));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Post post = postRepository.findById(request.getPostId())
                .orElseThrow(() -> new AppException(ErrorCode.POST_ID_INVALID));

        Comment parentComment = null;
        if(request.getParentCommentId() != null) {
            parentComment = commentRepository.findById(request.getParentCommentId())
                    .orElseThrow(() -> new AppException(ErrorCode.PARENT_COMMENT_NOT_EXISTED));
        }

        if ((request.getContent() == null || request.getContent().isEmpty())) {
            throw new AppException(ErrorCode.CONTENT_COMMENT_INVALID);
        }

        if (bannedWordsService.containsBannedWords(request.getContent())) {
            throw new AppException(ErrorCode.INVALID_COMMENT_CONTENT);
        }

        Comment comment = commentMapper.toComment(request);
        comment.setUser(user);
        comment.setPost(post);
        comment.setParentComment(parentComment);

        commentRepository.save(comment);

        return commentMapper.toCommentResponse(comment);
    }

    public void deleteComment(Long commentId) {
        String email = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new AppException(ErrorCode.EMAIL_INVALID));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_EXISTED));

        if (Objects.equals(user.getId(), comment.getUser().getId()) ||
                PredefinedRole.ADMIN_ROLE.equals(user.getRole().getName())) {
            commentRepository.delete(comment);
            return;
        }

        throw new AppException(ErrorCode.DELETE_COMMENT_INVALID);
    }

}
