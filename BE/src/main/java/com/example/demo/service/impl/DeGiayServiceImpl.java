package com.example.demo.service.impl;

import com.example.demo.dto.request.DeGiayDto;
import com.example.demo.dto.request.DeGiayUpdateDto;
import com.example.demo.dto.response.PageResponse;

import com.example.demo.entity.ChatLieuEntity;
import com.example.demo.entity.DeGiayEntity;
import com.example.demo.repository.DeGiayRepository;
import com.example.demo.service.DeGiayService;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class DeGiayServiceImpl implements DeGiayService {
    @Autowired
    private DeGiayRepository deGiayRepository;
    @Override
    public List<DeGiayEntity> getAll() {
        return deGiayRepository.findAll();
    }

    @Override
    public DeGiayEntity add(DeGiayDto deGiayDto) {
        DeGiayEntity deGiayEntity = new DeGiayEntity();
        deGiayEntity.setMa(deGiayDto.getMa());
        deGiayEntity.setTen(deGiayDto.getTen());
        deGiayEntity.setTrangThai(deGiayDto.getTrangThai());
        return deGiayRepository.save(deGiayEntity);
    }

    @Override
    public DeGiayEntity addNhanh(DeGiayDto deGiayDto) {
        if (deGiayDto.getTen() == null || deGiayDto.getTen().trim().isEmpty()) {
            throw new IllegalArgumentException("Đế giày không được để trống.");
        }


        DeGiayEntity deGiayEntity = new DeGiayEntity();


        deGiayEntity.setMa(deGiayDto.getMa() != null ? deGiayDto.getMa() : generateMa());


        deGiayEntity.setTrangThai(deGiayDto.getTrangThai() != null ? deGiayDto.getTrangThai() : 1);


        deGiayEntity.setTen(deGiayDto.getTen().trim());


        return deGiayRepository.save(deGiayEntity);
    }


    private String generateMa() {
        return "DG" + System.currentTimeMillis();
    }

    @Override
    public DeGiayEntity update(DeGiayUpdateDto deGiayUpdateDto) {
        Optional<DeGiayEntity> optional = deGiayRepository.findById(deGiayUpdateDto.getId());
        return optional.map(o ->{
            o.setMa(deGiayUpdateDto.getMa());
            o.setTen(deGiayUpdateDto.getTen());
            o.setTrangThai(deGiayUpdateDto.getTrangThai());
            return deGiayRepository.save(o);
        }).orElse(null);
    }

    @Override
    public DeGiayEntity detail(DeGiayUpdateDto deGiayUpdateDto) {
        Optional<DeGiayEntity> optional = deGiayRepository.findById(deGiayUpdateDto.getId());
        return optional.orElse(null);
    }

    @Override
    public DeGiayEntity delete(DeGiayUpdateDto deGiayUpdateDto) {
        Optional<DeGiayEntity> optional = deGiayRepository.findById(deGiayUpdateDto.getId());
        return optional.map(o ->{
            deGiayRepository.delete(o);
            return o;
        }).orElse(null);
    }

    @Override
    public PageResponse<DeGiayEntity> findByPagingCriteria(DeGiayDto deGiayDto, Pageable pageable) {
        Page<DeGiayEntity> page = deGiayRepository.findAll(new Specification<DeGiayEntity>() {
            @Override
            public Predicate toPredicate(Root<DeGiayEntity> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
                List<Predicate> predicates = new ArrayList<>();
                if(deGiayDto != null){
                    if(deGiayDto.getMa() != null && !deGiayDto.getMa().isEmpty()){
                        predicates.add(criteriaBuilder.like(root.get("ma"),"%" + deGiayDto.getMa() + "%"));
                    }
                    if(deGiayDto.getTen() != null && !deGiayDto.getTen().isEmpty()){
                        predicates.add(criteriaBuilder.like(root.get("ten"),"%" + deGiayDto.getTen() + "%"));
                    }
                    if(deGiayDto.getTrangThai() !=null){
                        predicates.add(criteriaBuilder.equal(root.get("trangThai"),deGiayDto.getTrangThai()));
                    }
                }
                return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
            }
        },pageable);
        PageResponse<DeGiayEntity> pageResponse = new PageResponse<>();
        pageResponse.setTotalElements((int) page.getTotalElements());
        pageResponse.setTotalPages(page.getTotalPages());
        pageResponse.setSize(page.getSize());
        pageResponse.setPage(page.getNumber() + 1);
        pageResponse.setContent(page.getContent());

        return pageResponse;
    }
}
