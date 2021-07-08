package com.jlumine.itrader.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

import java.net.InetSocketAddress;
import java.net.Proxy;

@Configuration
public class RestTemplateConfig {
    @Value("${app.proxy.enabled}")
    private boolean useProxy;

    @Value("${app.proxy.ip}")
    private String proxyHost;

    @Value("${app.proxy.port}")
    private int proxyPort;

    @Value("${app.proxy.socks}")
    private boolean useSocksProxy;

    @Bean
    public RestTemplate restTemplate(ClientHttpRequestFactory factory) {
        return new RestTemplate(factory);
    }

    @Bean
    public ClientHttpRequestFactory simpleClientHttpRequestFactory() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(10000);
        factory.setReadTimeout(10000);

        if (useProxy)
            factory.setProxy(new Proxy(
                    useSocksProxy? Proxy.Type.SOCKS : Proxy.Type.HTTP,
                    new InetSocketAddress(proxyHost, proxyPort)));
        return factory;
    }
}
