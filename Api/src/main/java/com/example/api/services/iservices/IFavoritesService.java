package com.example.api.services.iservices;

import com.example.api.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;

public interface IFavoritesService {

    void addNewsToFavorite(String userEmail, Long newsId) throws Exception;
}
