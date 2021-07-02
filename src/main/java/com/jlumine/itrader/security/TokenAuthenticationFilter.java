package com.jlumine.itrader.security;

import com.jlumine.itrader.payload.AuthenticatedRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StreamUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ReadListener;
import javax.servlet.ServletException;
import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;
import javax.servlet.http.HttpServletResponse;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.*;

public class TokenAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private TokenProvider tokenProvider;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    private static final Logger logger = LoggerFactory.getLogger(TokenAuthenticationFilter.class);

    @Override
    protected void doFilterInternal(
            HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        HttpServletRequestWrapper requestWrapper = null;
        try {
            String jwt = getJwtFromRequest(request);

            if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
                Long userId = tokenProvider.getUserIdFromToken(jwt);

                UserDetails userDetails = customUserDetailsService.loadUserById(userId);
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);

                requestWrapper = new AuthenticatedRequest(request, userId);

//                requestWrapper = new HttpServletRequestWrapper(request) {
//                    @Override
//                    public String[] getParameterValues(String name) {
//                        if (name.equals("userId")) {
//                            return new String[] { userId.toString() };
//                        }
//                        return super.getParameterValues(name);
//                    }
//
//                    @Override
//                    public Enumeration<String> getParameterNames() {
//                        Set<String> paramNames = new LinkedHashSet<>();
//                        paramNames.add("userId");
//                        Enumeration<String> names =  super.getParameterNames();
//                        while(names.hasMoreElements()) {
//                            paramNames.add(names.nextElement());
//                        }
//                        return Collections.enumeration(paramNames);
//                    }
//
//                    @Override
//                    public ServletInputStream getInputStream() throws IOException {
//                        byte[] requestBody;
//                        try {
//                            requestBody = StreamUtils.copyToByteArray(request.getInputStream());
//                            Map map = JsonUtils.toBean(Map.class, new String(requestBody));
//                            map.put("userId", userId);
//                            requestBody = JsonUtils.toJson(map).getBytes();
//                        } catch (IOException e) {
//                            throw new RuntimeException(e);
//                        }
//                        final ByteArrayInputStream bais = new ByteArrayInputStream(requestBody);
//                        return new ServletInputStream() {
//                            @Override
//                            public int read() throws IOException {
//                                return bais.read();
//                            }
//
//                            @Override
//                            public boolean isFinished() {
//                                return false;
//                            }
//
//                            @Override
//                            public boolean isReady() {
//                                return true;
//                            }
//
//                            @Override
//                            public void setReadListener(ReadListener listener) {
//
//                            }
//                        };
//                    }
//                };
            }
        } catch (Exception ex) {
            logger.error("Could not set user authentication in security context", ex);
        }

        filterChain.doFilter(requestWrapper == null ? request : requestWrapper, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
