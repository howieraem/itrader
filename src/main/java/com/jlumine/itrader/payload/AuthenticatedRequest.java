package com.jlumine.itrader.payload;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;

public class AuthenticatedRequest extends HttpServletRequestWrapper {
    private Long userId;

    public AuthenticatedRequest(HttpServletRequest req, Long userId) {
        super(req);
        this.userId = userId;
    }

    public Long getUserId() {
        return userId;
    }
}
