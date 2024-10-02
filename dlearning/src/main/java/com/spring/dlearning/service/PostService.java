package com.spring.dlearning.service;

import com.spring.dlearning.dto.request.PostCreationRequest;
import com.spring.dlearning.dto.response.PostCreationResponse;
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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class PostService {

    UserRepository userRepository;
    PostRepository postRepository;
    PostMapper postMapper;

    @PreAuthorize("isAuthenticated()")
    public PostCreationResponse createPost (PostCreationRequest request){

        String email = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new AppException(ErrorCode.EMAIL_INVALID));

        User user = userRepository.findByEmail(email)
                .orElseThrow(()-> new AppException(ErrorCode.USER_NOT_EXISTED));

        Post post = postMapper.toPost(request);
        post.setUser(user);
        postRepository.save(post);

        return postMapper.toPostCreationResponse(post);
    }

}
