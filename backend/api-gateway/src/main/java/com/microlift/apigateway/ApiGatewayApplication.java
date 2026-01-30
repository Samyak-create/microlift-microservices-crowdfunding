package com.microlift.apigateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class ApiGatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }

    @org.springframework.context.annotation.Bean
    public org.springframework.web.cors.reactive.CorsWebFilter corsWebFilter() {
        org.springframework.web.cors.CorsConfiguration corsConfig = new org.springframework.web.cors.CorsConfiguration();
        corsConfig.setAllowedOrigins(java.util.Collections.singletonList("http://localhost:5173"));
        corsConfig.setMaxAge(3600L);
        corsConfig.addAllowedMethod("*");
        corsConfig.addAllowedHeader("*");
        corsConfig.setAllowCredentials(true);

        org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource source = new org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);

        return new org.springframework.web.cors.reactive.CorsWebFilter(source);
    }

    @org.springframework.context.annotation.Bean
    public org.springframework.web.reactive.config.WebFluxConfigurer webFluxConfigurer() {
        return new org.springframework.web.reactive.config.WebFluxConfigurer() {
            @Override
            public void configureHttpMessageCodecs(org.springframework.http.codec.ServerCodecConfigurer configurer) {
                configurer.defaultCodecs().maxInMemorySize(50 * 1024 * 1024); // 50MB
            }
        };
    }

}
