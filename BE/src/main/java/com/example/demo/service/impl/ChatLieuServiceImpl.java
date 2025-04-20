package com.example.demo.service.impl;

import com.example.demo.dto.request.ChatLieuDto;
import com.example.demo.dto.request.ChatLieuUpdateDto;
import com.example.demo.dto.response.PageResponse;
import com.example.demo.entity.ChatLieuEntity;
import com.example.demo.entity.KichCoEntity;
import com.example.demo.repository.ChatLieuRepository;
import com.example.demo.service.ChatLieuService;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChatLieuServiceImpl implements ChatLieuService {
    @Autowired
    private ChatLieuRepository chatLieuRepository;

    @Override
    public List<ChatLieuEntity> getAll() {
        return chatLieuRepository.findAll();
    }

    @Override
    public ChatLieuEntity add(ChatLieuDto chatLieuDto) {
        // Kiểm tra tên đã tồn tại hay chưa (bỏ qua khoảng trắng và không phân biệt hoa thường)
        Optional<ChatLieuEntity> existing = chatLieuRepository
                .findByTenIgnoreCase(chatLieuDto.getTen().trim());

        if (existing.isPresent()) {
            throw new RuntimeException("Tên chất liệu đã tồn tại.");
        }

        ChatLieuEntity chatLieuEntity = new ChatLieuEntity();
        chatLieuEntity.setMa(chatLieuDto.getMa());
        chatLieuEntity.setTen(chatLieuDto.getTen());
        chatLieuEntity.setTrangThai(chatLieuDto.getTrangThai());
        return chatLieuRepository.save(chatLieuEntity);
    }

    @Override
    public ChatLieuEntity addNhanh(ChatLieuDto chatLieuDto) {

        if (chatLieuDto.getTen() == null || chatLieuDto.getTen().trim().isEmpty()) {
            throw new IllegalArgumentException("Tên chất liệu không được để trống.");
        }


        ChatLieuEntity chatLieuEntity = new ChatLieuEntity();


        chatLieuEntity.setMa(chatLieuDto.getMa() != null ? chatLieuDto.getMa() : generateMa());


        chatLieuEntity.setTrangThai(chatLieuDto.getTrangThai() != null ? chatLieuDto.getTrangThai() : 1);


        chatLieuEntity.setTen(chatLieuDto.getTen().trim());


        return chatLieuRepository.save(chatLieuEntity);
    }


    private String generateMa() {
        return "CL" + System.currentTimeMillis();
    }

    @Override
    public ChatLieuEntity update(ChatLieuUpdateDto chatLieuUpdateDto) {
        Optional<ChatLieuEntity> optional = chatLieuRepository.findById(chatLieuUpdateDto.getId());
        return optional.map(o ->{
            o.setMa(chatLieuUpdateDto.getMa());
            o.setTen(chatLieuUpdateDto.getTen());
            o.setTrangThai(chatLieuUpdateDto.getTrangThai());
            return chatLieuRepository.save(o);
        }).orElse(null);
    }

    @Override
    public ChatLieuEntity detail(ChatLieuUpdateDto chatLieuUpdateDto) {
        Optional<ChatLieuEntity> optional = chatLieuRepository.findById(chatLieuUpdateDto.getId());
        return optional.orElse(null);
    }

    @Override
    public ChatLieuEntity delete(ChatLieuUpdateDto chatLieuUpdateDto) {
        Optional<ChatLieuEntity> optional = chatLieuRepository.findById(chatLieuUpdateDto.getId());
        return optional.map(o ->{
            chatLieuRepository.delete(o);
            return o;
        }).orElse(null);
    }

    @Override
    public ChatLieuEntity toggleTrangThai(ChatLieuUpdateDto chatLieuUpdateDto) {
        Optional<ChatLieuEntity> optional = chatLieuRepository.findById(chatLieuUpdateDto.getId());
        return optional.map(chatLieuEntity -> {

            chatLieuEntity.setTrangThai(chatLieuEntity.getTrangThai() == 1 ? 0 : 1);
            return chatLieuRepository.save(chatLieuEntity);
        }).orElse(null);
    }

    @Override
    public PageResponse<ChatLieuEntity> findByPagingCriteria(ChatLieuDto chatLieuDto, Pageable pageable) {
        Page<ChatLieuEntity> page = chatLieuRepository.findAll(new Specification<ChatLieuEntity>() {
            @Override
            public Predicate toPredicate(Root<ChatLieuEntity> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
                List<Predicate> predicates = new ArrayList<>();
                if(chatLieuDto != null){
                    if(chatLieuDto.getMa() != null && !chatLieuDto.getMa().isEmpty()){
                        predicates.add(criteriaBuilder.like(root.get("ma"),"%" + chatLieuDto.getMa() + "%"));
                    }
                    if(chatLieuDto.getTen() != null && !chatLieuDto.getTen().isEmpty()){
                        predicates.add(criteriaBuilder.like(root.get("ten"),"%" + chatLieuDto.getTen() + "%"));
                    }
                    if(chatLieuDto.getTrangThai() !=null){
                        predicates.add(criteriaBuilder.equal(root.get("trangThai"),chatLieuDto.getTrangThai()));
                    }
                }
                return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
            }
        },pageable);
        PageResponse<ChatLieuEntity> pageResponse = new PageResponse<>();
        pageResponse.setTotalElements((int) page.getTotalElements());
        pageResponse.setTotalPages(page.getTotalPages());
        pageResponse.setSize(page.getSize());
        pageResponse.setPage(page.getNumber() + 1);
        pageResponse.setContent(page.getContent());

        return pageResponse;
    }
}
