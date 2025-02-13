package com.example.demo.security;

import com.example.demo.entity.UserEntity;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
public class CustomUserDetail implements UserDetails {
    private UUID id;
    private String email;
    private String hoTen;
    private String matKhau;
    private Collection<? extends GrantedAuthority> authorities;
    private UserEntity userEntity;

    public CustomUserDetail(UserEntity userEntity, List<String> roles) {
        this.id = userEntity.getId();
        this.email = userEntity.getEmail();
        this.matKhau = userEntity.getMatKhau();
        this.hoTen = userEntity.getHoTen();
        this.authorities = roles.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
        this.userEntity = userEntity;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return matKhau;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return Boolean.TRUE.equals(userEntity.getIsEnabled());
    }
}
