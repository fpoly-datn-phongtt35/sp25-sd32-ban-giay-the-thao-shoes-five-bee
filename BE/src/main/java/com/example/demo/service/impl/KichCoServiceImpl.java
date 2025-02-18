package com.example.demo.service.impl;

import com.example.demo.dto.request.KichCoDto;
import com.example.demo.dto.request.KichCoUpdateDto;
import com.example.demo.dto.response.PageResponse;
import com.example.demo.entity.DeGiayEntity;
import com.example.demo.entity.KichCoEntity;
import com.example.demo.entity.MauSacEntity;
import com.example.demo.entity.ThuongHieuEntity;
import com.example.demo.repository.KichCoRepository;
import com.example.demo.service.KichCoService;
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
public class KichCoServiceImpl implements KichCoService {
    @Autowired
    private KichCoRepository kichCoRepository;
    @Override
    public List<KichCoEntity> getAll() {
        return kichCoRepository.findAll();
    }

    @Override
    public KichCoEntity add(KichCoDto kichCoDto) {
        KichCoEntity kichCoEntity = new KichCoEntity();
        kichCoEntity.setMa(kichCoDto.getMa());
        kichCoEntity.setTen(kichCoDto.getTen());
        kichCoEntity.setTrangThai(kichCoDto.getTrangThai());
        return kichCoRepository.save(kichCoEntity);
    }

    @Override
    public KichCoEntity addNhanh(KichCoDto kichCoDto) {
        if (kichCoDto.getTen() == null || kichCoDto.getTen().trim().isEmpty()) {
            throw new IllegalArgumentException("Kích cỡ không được để trống.");
        }


        KichCoEntity kichCoEntity = new KichCoEntity();


        kichCoEntity.setMa(kichCoDto.getMa() != null ? kichCoDto.getMa() : generateMa());


        kichCoEntity.setTrangThai(kichCoDto.getTrangThai() != null ? kichCoDto.getTrangThai() : 1);


        kichCoEntity.setTen(kichCoDto.getTen().trim());


        return kichCoRepository.save(kichCoEntity);
    }


    private String generateMa() {
        return "kC" + System.currentTimeMillis();
    }

    @Override
    public KichCoEntity update(KichCoUpdateDto kichCoUpdateDto) {
        Optional<KichCoEntity> optional = kichCoRepository.findById(kichCoUpdateDto.getId());
        return optional.map(o ->{
            o.setMa(kichCoUpdateDto.getMa());
            o.setTen(kichCoUpdateDto.getTen());
            o.setTrangThai(kichCoUpdateDto.getTrangThai());
            return kichCoRepository.save(o);
        }).orElse(null);
    }

    @Override
    public KichCoEntity detail(KichCoUpdateDto kichCoUpdateDto) {
        Optional<KichCoEntity> optional = kichCoRepository.findById(kichCoUpdateDto.getId());

        return optional.orElse(null);
    }

    @Override
    public KichCoEntity delete(KichCoUpdateDto kichCoUpdateDto) {
        Optional<KichCoEntity> optional = kichCoRepository.findById(kichCoUpdateDto.getId());
        return optional.map(o ->{
            kichCoRepository.delete(o);
            return o;
        }).orElse(null);
    }

    @Override
    public KichCoEntity toggleKichCo(KichCoUpdateDto kichCoUpdateDto) {
        Optional<KichCoEntity> optional = kichCoRepository.findById(kichCoUpdateDto.getId());
        return optional.map(kichCoEntity -> {

            kichCoEntity .setTrangThai(kichCoEntity.getTrangThai() == 1 ? 0 : 1);
            return kichCoRepository.save(kichCoEntity );
        }).orElse(null);
    }

    @Override
    public PageResponse<KichCoEntity> findByPagingCriteria(KichCoDto kichCoDto, Pageable pageable) {
        Page<KichCoEntity> page = kichCoRepository.findAll(new Specification<KichCoEntity>() {
            @Override
            public Predicate toPredicate(Root<KichCoEntity> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
                List<Predicate> predicates = new ArrayList<>();
                if(kichCoDto != null){
                    if(kichCoDto.getMa() != null && !kichCoDto.getMa().isEmpty()){
                        predicates.add(criteriaBuilder.like(root.get("ma"),"%" + kichCoDto.getMa() + "%"));
                    }
                    if(kichCoDto.getTen() != null && !kichCoDto.getTen().isEmpty()){
                        predicates.add(criteriaBuilder.like(root.get("ten"),"%" + kichCoDto.getTen() + "%"));
                    }
                    if(kichCoDto.getTrangThai() !=null){
                        predicates.add(criteriaBuilder.equal(root.get("trangThai"),kichCoDto.getTrangThai()));
                    }
                }
                return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
            }
        },pageable);
        PageResponse<KichCoEntity> pageResponse = new PageResponse<>();
        pageResponse.setTotalElements((int) page.getTotalElements());
        pageResponse.setTotalPages(page.getTotalPages());
        pageResponse.setSize(page.getSize());
        pageResponse.setPage(page.getNumber() + 1);
        pageResponse.setContent(page.getContent());

        return pageResponse;
    }
}
