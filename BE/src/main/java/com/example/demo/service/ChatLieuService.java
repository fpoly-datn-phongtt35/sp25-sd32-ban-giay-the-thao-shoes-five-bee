package com.example.demo.service;

import com.example.demo.dto.request.ChatLieuDto;
import com.example.demo.dto.request.ChatLieuUpdateDto;
import com.example.demo.dto.response.PageResponse;
import com.example.demo.entity.ChatLieuEntity;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ChatLieuService {
    List<ChatLieuEntity> getAll();

    ChatLieuEntity add(ChatLieuDto chatLieuDto);

    ChatLieuEntity addNhanh(ChatLieuDto chatLieuDto);

    ChatLieuEntity update(ChatLieuUpdateDto chatLieuUpdateDto);

    ChatLieuEntity detail(ChatLieuUpdateDto chatLieuUpdateDto);

    ChatLieuEntity delete(ChatLieuUpdateDto chatLieuUpdateDto);

    ChatLieuEntity toggleTrangThai(ChatLieuUpdateDto chatLieuUpdateDto);

    PageResponse<ChatLieuEntity> findByPagingCriteria(ChatLieuDto chatLieuDto, Pageable pageable);
}
