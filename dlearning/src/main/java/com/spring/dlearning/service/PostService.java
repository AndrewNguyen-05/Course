package com.spring.dlearning.service;

import com.spring.dlearning.dto.request.PostCreationRequest;
import com.spring.dlearning.dto.request.UpdateLikeCountRequest;
import com.spring.dlearning.dto.response.PageResponse;
import com.spring.dlearning.dto.response.PostCreationResponse;
import com.spring.dlearning.dto.response.PostResponse;
import com.spring.dlearning.entity.Post;
import com.spring.dlearning.entity.User;
import com.spring.dlearning.exception.AppException;
import com.spring.dlearning.exception.ErrorCode;
import com.spring.dlearning.mapper.PostMapper;
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
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class PostService {

    UserRepository userRepository;
    PostRepository postRepository;
    PostMapper postMapper;
    CloudinaryService cloudinaryService;

    @PreAuthorize("isAuthenticated()")
    public PostCreationResponse createPost (PostCreationRequest request, MultipartFile file){

        String email = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new AppException(ErrorCode.EMAIL_INVALID));

        User user = userRepository.findByEmail(email)
                .orElseThrow(()-> new AppException(ErrorCode.USER_NOT_EXISTED));

        String image = cloudinaryService.uploadImage(file);
        request.setImage(image);

        Post post = postMapper.toPost(request);
        post.setUser(user);
        postRepository.save(post);

        return postMapper.toPostCreationResponse(post);
    }

    @PreAuthorize("isAuthenticated()")
    public PageResponse<PostResponse> getAllPost (Specification<Post> spec, int page, int size){

        Sort sort = Sort.by(Sort.Direction.DESC,"createdAt");
        Pageable pageable = PageRequest.of(page - 1, size, sort);
        Page<Post> posts = postRepository.findAll(spec, pageable);
        
        List<PostResponse> postResponses = posts.getContent()
                .stream().map(postMapper::toPostResponse)
                .toList();

        return PageResponse.<PostResponse>builder()
                .currentPage(page)
                .pageSize(pageable.getPageSize())
                .totalElements(posts.getTotalElements())
                .totalPages(posts.getTotalPages())
                .data(postResponses)
                .build();
    }

    @PreAuthorize("isAuthenticated()")
    public void updateLikeCount(UpdateLikeCountRequest request) {
        Post post = postRepository.findById(request.getPostId())
                .orElseThrow(() -> new AppException(ErrorCode.ID_POST_INVALID));

        int likeChange = request.getIsLike() ? 1 : -1;
        post.setLikeCount(post.getLikeCount() + likeChange);
        postRepository.save(post);
    }

}
