package com.jlumine.itrader.controller;

import com.jlumine.itrader.payload.ApiResponse;
import com.jlumine.itrader.payload.AuthenticatedRequest;
import com.jlumine.itrader.payload.TradeRequest;
import com.jlumine.itrader.service.BalanceUpdateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import yahoofinance.Stock;
import yahoofinance.YahooFinance;
import yahoofinance.util.RedirectableRequest;

import javax.validation.Valid;
import java.io.IOException;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.net.InetSocketAddress;
import java.net.Proxy;
import java.net.URL;
import java.net.URLConnection;
import java.util.Properties;

@RestController
public class TradeController {
    // TODO write own request to get quote instead of using a 3rd party API
    private static final String URL_BASIC = "https://query1.finance.yahoo.com/v7/finance/quote?symbols=%s";

    @Value("${app.proxy.enabled}")
    private boolean useProxy;

    @Value("${app.proxy.ip}")
    private String proxyHost;

    @Value("${app.proxy.port}")
    private int proxyPort;

    @Autowired
    private BalanceUpdateService balanceUpdateService;

    @PostMapping("/trade")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> trade(
            @Valid @RequestBody TradeRequest tradeRequest,
            AuthenticatedRequest authenticatedRequest)
            throws IOException {
        Stock stock = YahooFinance.get(tradeRequest.getSymbol());
        BigDecimal total = stock.getQuote(true).getAsk()
                .multiply(new BigDecimal(tradeRequest.getAmount()));
        Long userId = authenticatedRequest.getUserId();
        balanceUpdateService.updateAfterTrade(userId, total);
        return ResponseEntity.ok(new ApiResponse(true, "Transaction completed!"));
    }

//    private void getCurrentQuote(String symbol) throws IOException {
//        if (useProxy) {
//            Properties systemProperties = System.getProperties();
//            systemProperties.setProperty("http.proxyHost", proxyHost);
//            systemProperties.setProperty("http.proxyPort", Integer.toString(proxyPort));
//        }
//        URL request = new URL(String.format(URL_BASIC, symbol));
//        RedirectableRequest redirectableRequest = new RedirectableRequest(request, 5);
//        redirectableRequest.setConnectTimeout(YahooFinance.CONNECTION_TIMEOUT);
//        redirectableRequest.setReadTimeout(YahooFinance.CONNECTION_TIMEOUT);
//        URLConnection connection = redirectableRequest.openConnection();
//        InputStreamReader is = new InputStreamReader(connection.getInputStream());
//    }
}
