package com.jlumine.itrader.security;


import com.jlumine.itrader.exception.ResourceNotFoundException;
import com.jlumine.itrader.model.User;
import com.jlumine.itrader.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.Cacheable;

@Service
@CacheConfig(cacheNames = "userCache")
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    UserRepository userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found with email: " + email)
        );
        return UserPrincipal.create(user);
    }

    @Transactional
    @Cacheable(cacheNames = "userR", key = "#id", unless = "#result == null")
    public User getUser(Long id) {
        return userRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("User", "id", id)
        );
    }

    public UserDetails loadUserById(Long id) {
        return UserPrincipal.create(getUser(id));
    }
}