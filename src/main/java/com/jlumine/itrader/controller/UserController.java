package com.jlumine.itrader.controller;

import com.jlumine.itrader.dto.PositionDTO;
import com.jlumine.itrader.dto.TradeDTO;
import com.jlumine.itrader.exception.ResourceNotFoundException;
import com.jlumine.itrader.model.User;
import com.jlumine.itrader.repository.PositionRepository;
import com.jlumine.itrader.repository.TradeRepository;
import com.jlumine.itrader.repository.UserRepository;
import com.jlumine.itrader.security.CurrentUser;
import com.jlumine.itrader.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PositionRepository positionRepository;

    @Autowired
    private TradeRepository tradeRepository;

    @GetMapping("/user/me")
    @PreAuthorize("hasRole('USER')")
    public User getCurrentUser(@CurrentUser UserPrincipal userPrincipal) {
        return userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userPrincipal.getId()));
    }

    @GetMapping("/portfolio")
    @PreAuthorize("hasRole('USER')")
    public List<PositionDTO> getPositions(@CurrentUser UserPrincipal userPrincipal) {
        return positionRepository.findByUserId(userPrincipal.getId());
    }

    @GetMapping("/trades")
    @PreAuthorize("hasRole('USER')")
    public List<TradeDTO> getTrades(@CurrentUser UserPrincipal userPrincipal) {
        return tradeRepository.findByUserId(userPrincipal.getId());
    }
}
