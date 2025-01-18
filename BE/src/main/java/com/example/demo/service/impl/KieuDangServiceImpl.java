package com.example.demo.service.impl;

import com.example.demo.dto.request.KieuDangDto;
import com.example.demo.dto.request.KieuDangUpdateDto;
import com.example.demo.dto.response.PageResponse;

import com.example.demo.entity.KieuDangEntity;
import com.example.demo.entity.MauSacEntity;
import com.example.demo.repository.KieuDangRepository;
import com.example.demo.service.KieuDangService;
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
public class KieuDangServiceImpl implements KieuDangService {
    @Autowired
    private KieuDangRepository kieuDangRepository;

    @Override
    public List<KieuDangEntity> getAll() {
        return kieuDangRepository.findAll();
    }

    @Override
    public KieuDangEntity add(KieuDangDto kieuDangDto) {
        KieuDangEntity kieuDangEntity = new KieuDangEntity();
        kieuDangEntity.setMa(kieuDangDto.getMa());
        kieuDangEntity.setTen(kieuDangDto.getTen());
        kieuDangEntity.setTrangThai(kieuDangDto.getTrangThai());
        return kieuDangRepository.save(kieuDangEntity);
    }

    @Override
    public KieuDangEntity addNhanh(KieuDangDto kieuDangDto) {
        if (kieuDangDto.getTen() == null || kieuDangDto.getTen().trim().isEmpty()) {
            throw new IllegalArgumentException("Kieu dang khong duoc de trong.");
        }


        KieuDangEntity kieuDangEntity = new KieuDangEntity();


        kieuDangEntity.setMa(kieuDangDto.getMa() != null ? kieuDangDto.getMa() : generateMa());


        kieuDangEntity.setTrangThai(kieuDangDto.getTrangThai() != null ? kieuDangDto.getTrangThai() : 1);


        kieuDangEntity.setTen(kieuDangDto.getTen().trim());


        return kieuDangRepository.save(kieuDangEntity);}
    private String generateMa() {
        return "KD" + System.currentTimeMillis();
    }

    @Override
    public KieuDangEntity update(KieuDangUpdateDto kieuDangUpdateDto) {
        Optional<KieuDangEntity> optional = kieuDangRepository.findById(kieuDangUpdateDto.getId());
        return optional.map(o->{
            o.setMa(kieuDangUpdateDto.getMa());
            o.setTen(kieuDangUpdateDto.getTen());
            o.setTrangThai(kieuDangUpdateDto.getTrangThai());
            return kieuDangRepository.save(o);
        }).orElse(null);
    }

    @Override
    public KieuDangEntity detail(KieuDangUpdateDto kieuDangUpdateDto) {
        Optional<KieuDangEntity> optional = kieuDangRepository.findById(kieuDangUpdateDto.getId());
        return optional.orElse(null);
    }

    @Override
    public KieuDangEntity delete(KieuDangUpdateDto kieuDangUpdateDto) {
        Optional<KieuDangEntity> optional = kieuDangRepository.findById(kieuDangUpdateDto.getId());
        return optional.map(o->{
            kieuDangRepository.delete(o);
            return o;
        }).orElse(null);
    }

    @Override
    public PageResponse<KieuDangEntity> findByPagingCriteria(KieuDangDto kieuDangDto, Pageable pageable) {
        Page<KieuDangEntity> page = kieuDangRepository.findAll(new Specification<KieuDangEntity>() {
            @Override
            public Predicate toPredicate(Root<KieuDangEntity> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
                List<Predicate> predicates = new ArrayList<>();
                if(kieuDangDto != null){
                    if(kieuDangDto.getMa() != null && !kieuDangDto.getMa().isEmpty()){
                        predicates.add(criteriaBuilder.like(root.get("ma"),"%" + kieuDangDto.getMa() + "%"));
                    }
                    if(kieuDangDto.getTen() != null && !kieuDangDto.getTen().isEmpty()){
                        predicates.add(criteriaBuilder.like(root.get("ten"),"%" + kieuDangDto.getTen() + "%"));
                    }
                    if(kieuDangDto.getTrangThai() !=null){
                        predicates.add(criteriaBuilder.equal(root.get("trangThai"),kieuDangDto.getTrangThai()));
                    }
                }
                return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
            }
        },pageable);
        PageResponse<KieuDangEntity> pageResponse = new PageResponse<>();
        pageResponse.setTotalElements((int) page.getTotalElements());
        pageResponse.setTotalPages(page.getTotalPages());
        pageResponse.setSize(page.getSize());
        pageResponse.setPage(page.getNumber() + 1);
        pageResponse.setContent(page.getContent());

        return pageResponse;
    }
}
