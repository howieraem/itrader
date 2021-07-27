package com.jlumine.itrader.controller;

import com.jlumine.itrader.dto.PositionDTO;
import com.jlumine.itrader.dto.TradeDTO;
import com.jlumine.itrader.exception.ResourceNotFoundException;
import com.jlumine.itrader.model.Favorite;
import com.jlumine.itrader.model.User;
import com.jlumine.itrader.payload.SymbolRequest;
import com.jlumine.itrader.repository.FavoriteRepository;
import com.jlumine.itrader.repository.PositionRepository;
import com.jlumine.itrader.repository.TradeRepository;
import com.jlumine.itrader.repository.UserRepository;
import com.jlumine.itrader.security.CurrentUser;
import com.jlumine.itrader.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@CacheConfig(cacheNames = "userCache")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FavoriteRepository favoriteRepository;

    @Autowired
    private PositionRepository positionRepository;

    @Autowired
    private TradeRepository tradeRepository;

    @GetMapping("/user/me")
    @PreAuthorize("hasRole('USER')")
    @Cacheable(cacheNames = "user", key = "#userPrincipal.getId()", unless = "#result == null")
    public User getCurrentUser(@CurrentUser UserPrincipal userPrincipal) {
        return userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userPrincipal.getId()));
    }

    @GetMapping("/portfolio")
    @PreAuthorize("hasRole('USER')")
    @Cacheable(cacheNames = "userPortfolio", key = "#userPrincipal.getId()")
    public List<PositionDTO> getPortfolio(@CurrentUser UserPrincipal userPrincipal) {
        return positionRepository.findByUserId(userPrincipal.getId());
    }

//    @GetMapping("/portfolio")
//    @PreAuthorize("hasRole('USER')")
//    public List<PositionDTO> getPortfolio(
//            @CurrentUser UserPrincipal userPrincipal,
//            @RequestParam(value = "page", required = false) Integer page,
//            @RequestParam(value = "rows", required = false) Integer rows) {
//        if (page == null || rows == null)  return positionRepository.findByUserId(userPrincipal.getId());
//        return positionRepository.findByUserId(userPrincipal.getId(), PageRequest.of(page, rows));
//    }

//    @GetMapping("/numOfPositions")
//    @PreAuthorize("hasRole('USER')")
//    public long getNumberOfPositions(@CurrentUser UserPrincipal userPrincipal) {
//        return positionRepository.countByUserId(userPrincipal.getId());
//    }

    @GetMapping("/trades")
    @PreAuthorize("hasRole('USER')")
    public List<TradeDTO> getTrades(
            @CurrentUser UserPrincipal userPrincipal,
            @RequestParam(value = "page") Integer page,
            @RequestParam(value = "rows") Integer rows) {
        return tradeRepository.findByUserId(userPrincipal.getId(), PageRequest.of(page, rows));
    }

    @GetMapping("/numOfTrades")
    @PreAuthorize("hasRole('USER')")
    public long getNumberOfTrade(@CurrentUser UserPrincipal userPrincipal) {
        return tradeRepository.countByUserId(userPrincipal.getId());
    }

    @GetMapping("/watchlist")
    @PreAuthorize("hasRole('USER')")
    public List<Favorite> getWatchlist(
            @CurrentUser UserPrincipal userPrincipal,
            @RequestParam(value = "page") Integer page,
            @RequestParam(value = "rows") Integer rows) {
        return favoriteRepository.findByUserId(userPrincipal.getId(), PageRequest.of(page, rows));
    }

    @GetMapping("/watchlistSize")
    @PreAuthorize("hasRole('USER')")
    public int getWatchlistSize(@CurrentUser UserPrincipal userPrincipal) {
        return favoriteRepository.countByUserId(userPrincipal.getId());
    }

    @GetMapping("/existInWatchlist")
    @PreAuthorize("hasRole('USER')")
    public boolean existInWatchlist(
            @CurrentUser UserPrincipal userPrincipal,
            @RequestParam(value = "symbol") String symbol) {
        return favoriteRepository.existsByUserIdAndSymbol(userPrincipal.getId(), symbol);
    }

    @PostMapping("/addToWatchlist")
    @PreAuthorize("hasRole('USER')")
    @ResponseBody
    @Transactional(rollbackFor = Exception.class)
    public Boolean addToWatchlist(
            @Valid @RequestBody SymbolRequest symbolRequest,
            @CurrentUser UserPrincipal userPrincipal) {
        Favorite favorite = new Favorite();
        favorite.setUserId(userPrincipal.getId());
        favorite.setSymbol(symbolRequest.getSymbol());
        favoriteRepository.save(favorite);
        return true;
    }

    @PostMapping("/rmFromWatchlist")
    @PreAuthorize("hasRole('USER')")
    @ResponseBody
    @Transactional(rollbackFor = Exception.class)
    public Boolean removeFromWatchlist(
            @Valid @RequestBody SymbolRequest symbolRequest,
            @CurrentUser UserPrincipal userPrincipal) {
        favoriteRepository.deleteByUserIdAndSymbol(userPrincipal.getId(), symbolRequest.getSymbol());
        return true;
    }

    @PostMapping("/clearWatchlist")
    @PreAuthorize("hasRole('USER')")
    @ResponseBody
    @Transactional(rollbackFor = Exception.class)
    public Boolean clearWatchlist(@CurrentUser UserPrincipal userPrincipal) {
        favoriteRepository.deleteByUserId(userPrincipal.getId());
        return true;
    }
}
