package com.example.demo.jwt;

import com.example.demo.repository.RoleRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Component
public class JwtAuthFilterAfter extends OncePerRequestFilter {
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private UserDetailsService userDetailsService;

    public String getJwtFromRequest(HttpServletRequest httpServletRequest){
        String bearToken = httpServletRequest.getHeader("Authorization");
        if(StringUtils.hasText(bearToken) && bearToken.startsWith("Bearer")){
            return bearToken.substring(7);
        }
        return null;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            String jwt = getJwtFromRequest(request);
            if (StringUtils.hasText(jwt) && jwtTokenProvider.validateToken(jwt)) {
                String email = jwtTokenProvider.getUserNameFormJwt(jwt);
                UserDetails userDetails = userDetailsService.loadUserByUsername(email);
                if (userDetails != null) {
                    UsernamePasswordAuthenticationToken authenticationToken =
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                    // phan quyen va kiem tra quyen dua tren role
                    Collection<? extends GrantedAuthority> authorities = userDetails.getAuthorities();
                    List<String> roleName = authorities.stream()
                            .map(GrantedAuthority::getAuthority)
                            .collect(Collectors.toList());
                    List<String> allowedUrls = roleRepository.findRoleFunctionAndPermission(roleName);
                    allowedUrls.add("/api/auth");;
                    String requestUrl = request.getRequestURI();
                    if (!isUrlAllowed(requestUrl, allowedUrls)) {
                        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                        response.getWriter().write("{\"message\": \"Khong co quyen truy cap\"}");
                        return;
                    }
                }
            }
        } catch (Exception ex) {
            log.error("fail on set user Authentication", ex);
        }
        filterChain.doFilter(request, response);
    }
    private boolean isUrlAllowed(String requestUrl, List<String> allowedUrls) {
        for (String allowedUrl : allowedUrls) {
            String[] allowedUrlParts = allowedUrl.split(",");
            String allowedPath = allowedUrlParts[allowedUrlParts.length - 1];
            if (requestUrl.equalsIgnoreCase(allowedPath)) {
                return true;
            }
            if (requestUrl.toLowerCase().startsWith(allowedPath.toLowerCase())) {
                return true;
            }
        }
        return false;
    }
}
