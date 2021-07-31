package com.jlumine.itrader.controller;

import com.google.common.io.Files;
import com.jlumine.itrader.dto.PositionDTO;
import com.jlumine.itrader.dto.TradeDTO;
import com.jlumine.itrader.exception.BadRequestException;
import com.jlumine.itrader.exception.ResourceNotFoundException;
import com.jlumine.itrader.model.Favorite;
import com.jlumine.itrader.model.User;
import com.jlumine.itrader.payload.ApiResponse;
import com.jlumine.itrader.payload.ChangePasswordRequest;
import com.jlumine.itrader.payload.SymbolRequest;
import com.jlumine.itrader.repository.FavoriteRepository;
import com.jlumine.itrader.repository.PositionRepository;
import com.jlumine.itrader.repository.TradeRepository;
import com.jlumine.itrader.repository.UserRepository;
import com.jlumine.itrader.security.CurrentUser;
import com.jlumine.itrader.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

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

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${app.avatar-save-dir}")
    private String avatarDir;

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

    @PostMapping("/uploadAvatar")
    @PreAuthorize("hasRole('USER')")
    @CacheEvict(cacheNames = "user", key = "#userPrincipal.getId()", beforeInvocation = true)
    @ResponseBody
    @Transactional(rollbackFor = Exception.class)
    public ResponseEntity<?> uploadAvatar(
            @CurrentUser UserPrincipal userPrincipal,
            @RequestPart("file") MultipartFile file,
            HttpServletRequest request) {
        if (file.isEmpty()) {
            throw new BadRequestException("Your upload was empty. Please select an image and try again!");
        }
        if (file.getSize() > 2e6) {
            throw new BadRequestException("The image uploaded is larger than 2 MB. Please select a smaller one.");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            throw new BadRequestException("The filename of the uploaded image was empty. Please select another image and try again!");
        }
        String filename = UUID.randomUUID().toString().replaceAll("-", "") + '.' + Files.getFileExtension(originalFilename);
        String saveFilename = avatarDir + filename;

        try {
            file.transferTo(new File(saveFilename));
        } catch (IOException e) {
            e.printStackTrace();
        }

        String url = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + "/userAvatar/" + filename;
        userRepository.updateAvatar(userPrincipal.getId(), url);
        return ResponseEntity.ok(new ApiResponse(true, "Avatar changed successfully."));
    }

    @PostMapping("/changePassword")
    @PreAuthorize("hasRole('USER')")
    @ResponseBody
    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(cacheNames = "user", key = "#userPrincipal.getId()", beforeInvocation = true)
    public ResponseEntity<?> changePassword(
            @CurrentUser UserPrincipal userPrincipal,
            @Valid @RequestBody ChangePasswordRequest changePasswordRequest) {
        if (passwordEncoder.matches(changePasswordRequest.getOldPassword(), userPrincipal.getPassword())) {
            userRepository.updatePwd(
                    userPrincipal.getId(), passwordEncoder.encode(changePasswordRequest.getNewPassword()));
            return ResponseEntity.ok(new ApiResponse(true, "Password changed! Please sign in again."));
        }
        return new ResponseEntity<>(new ApiResponse(
                false, "The old password you entered was incorrect."), HttpStatus.UNAUTHORIZED);
    }
}
