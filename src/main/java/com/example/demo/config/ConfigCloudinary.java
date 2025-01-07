package com.example.demo.config;

import com.cloudinary.Cloudinary;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class ConfigCloudinary {
    @Bean
    public Cloudinary configKey(){
        Map<String,String> config = new HashMap<>();
        config.put("cloud_name", "djtehfwh1");
        config.put("api_key", "944168198234992");
        config.put("api_secret", "LSQaxm0GkG2KNkcPsTeZMJQMZx4");
        return new Cloudinary(config);
    }
}
