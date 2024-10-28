package com.spring.dlearning.service;

import com.spring.dlearning.constant.PredefinedRole;
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
import java.util.Objects;

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

        if(file != null){
            String image = cloudinaryService.uploadImage(file);
            request.setImage(image);
        }

        Post post = postMapper.toPost(request);
        post.setUser(user);
        postRepository.save(post);

        return postMapper.toPostCreationResponse(post);
    }

    @PreAuthorize("isAuthenticated()")
    public PageResponse<PostResponse> getAllPost (Specification<Post> spec, int page, int size){

        String email = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new AppException(ErrorCode.EMAIL_INVALID));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Sort sort = Sort.by(Sort.Direction.DESC,"createdAt");
        Pageable pageable = PageRequest.of(page - 1, size, sort);
        Page<Post> posts = postRepository.findAll(spec, pageable);
        
        List<PostResponse> postResponses = posts.getContent()
                .stream().map(postMapper::toPostResponse)
                .toList();

        for(int i = 0; i < postResponses.size(); i++){
            Post post = posts.getContent().get(i);
            PostResponse postResponse = postResponses.get(i);
            postResponse.setOwner(Objects.equals(user.getId(), post.getUser().getId()));
        }

        return PageResponse.<PostResponse>builder()
                .currentPage(page)
                .pageSize(pageable.getPageSize())
                .totalElements(posts.getTotalElements())
                .totalPages(posts.getTotalPages())
                .data(postResponses)
                .build();
    }

    @PreAuthorize("isAuthenticated()")
    public PageResponse<PostResponse> getPostByCurrentLogin(Specification<Post> spec, int page, int size) {
        String email = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new AppException(ErrorCode.EMAIL_INVALID));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        Pageable pageable = PageRequest.of(page - 1, size, sort);

        Specification<Post> userSpec = (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("user"), user);

        Specification<Post> combinedSpec = spec != null ? userSpec.and(spec) : userSpec;

        Page<Post> posts = postRepository.findAll(combinedSpec, pageable);

        List<PostResponse> postResponses = posts.getContent()
                .stream()
                .map(postMapper::toPostResponse)
                .toList();

        for(int i = 0; i < postResponses.size(); i++){
            Post post = posts.getContent().get(i);
            PostResponse postResponse = postResponses.get(i);
            postResponse.setOwner(Objects.equals(user.getId(), post.getUser().getId()));
        }

        return PageResponse.<PostResponse>builder()
                .currentPage(page)
                .pageSize(pageable.getPageSize())
                .totalElements(posts.getTotalElements())
                .totalPages(posts.getTotalPages())
                .data(postResponses)
                .build();
    }

    @PreAuthorize("isAuthenticated()")
    public void deletePost (Long postId) {
        if ( postId <= 0 ){
            throw new AppException(ErrorCode.INVALID_PATH_VARIABLE_ID);
        }
        String email = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new AppException(ErrorCode.EMAIL_INVALID));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new AppException(ErrorCode.POST_ID_INVALID));

        if (!Objects.equals(user.getId(), post.getUser().getId()) &&
                !Objects.equals(user.getRole().getName(), PredefinedRole.ADMIN_ROLE)) {
            throw new AppException(ErrorCode.DELETE_POST_INVALID);
        }
        postRepository.delete(post);
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
