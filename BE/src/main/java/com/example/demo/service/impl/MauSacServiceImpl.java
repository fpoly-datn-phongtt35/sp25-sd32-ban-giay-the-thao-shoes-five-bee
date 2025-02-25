package com.example.demo.service.impl;

import com.example.demo.dto.request.MauSacDto;
import com.example.demo.dto.request.MauSacUpdateDto;
import com.example.demo.dto.response.PageResponse;
import com.example.demo.entity.ChatLieuEntity;
import com.example.demo.entity.MauSacEntity;
import com.example.demo.entity.ThuongHieuEntity;
import com.example.demo.repository.MauSacRepository;
import com.example.demo.service.MauSacService;
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
public class MauSacServiceImpl implements MauSacService {
    @Autowired
    private MauSacRepository mauSacRepository;
    @Override
    public List<MauSacEntity> getAll() {
        return mauSacRepository.findAll();
    }

    @Override
    public MauSacEntity add(MauSacDto mauSacDto) {
        MauSacEntity mauSacEntity = new MauSacEntity();
        mauSacEntity.setMa(mauSacDto.getMa());
        mauSacEntity.setTen(mauSacDto.getTen());
        mauSacEntity.setTrangThai(mauSacDto.getTrangThai());
        return mauSacRepository.save(mauSacEntity);
    }

    @Override
    public MauSacEntity addNhanh(MauSacDto mauSacDto) {
        if (mauSacDto.getTen() == null || mauSacDto.getTen().trim().isEmpty()) {
            throw new IllegalArgumentException("Mau sac khong duoc de trong.");
        }


        MauSacEntity mauSacEntity = new MauSacEntity();


        mauSacEntity.setMa(mauSacDto.getMa() != null ? mauSacDto.getMa() : generateMa());


        mauSacEntity.setTrangThai(mauSacDto.getTrangThai() != null ? mauSacDto.getTrangThai() : 1);


        mauSacEntity.setTen(mauSacDto.getTen().trim());


        return mauSacRepository.save(mauSacEntity);}
    private String generateMa() {
        return "MS" + System.currentTimeMillis();
    }

    @Override
    public MauSacEntity update(MauSacUpdateDto mauSacUpdateDto) {
        Optional<MauSacEntity> optional = mauSacRepository.findById(mauSacUpdateDto.getId());
        return optional.map(o ->{
            o.setMa(mauSacUpdateDto.getMa());
            o.setTen(mauSacUpdateDto.getTen());
            o.setTrangThai(mauSacUpdateDto.getTrangThai());
            return mauSacRepository.save(o);
        }).orElse(null);
    }

    @Override
    public MauSacEntity detail(MauSacUpdateDto mauSacUpdateDto) {
        Optional<MauSacEntity> optional = mauSacRepository.findById(mauSacUpdateDto.getId());
        return optional.orElse(null);
    }

    @Override
    public MauSacEntity delete(MauSacUpdateDto mauSacUpdateDto) {
        Optional<MauSacEntity> optional = mauSacRepository.findById(mauSacUpdateDto.getId());
        return optional.map(o ->{
            mauSacRepository.delete(o);
            return o;
        }).orElse(null);
    }

    @Override
    public MauSacEntity toggleTrangThai(MauSacUpdateDto mauSacUpdateDto) {
        Optional<MauSacEntity> optional = mauSacRepository.findById(mauSacUpdateDto.getId());
        return optional.map(mauSacEntity -> {

            mauSacEntity.setTrangThai(mauSacEntity.getTrangThai() == 1 ? 0 : 1);
            return mauSacRepository.save(mauSacEntity);
        }).orElse(null);
    }

    @Override
    public PageResponse<MauSacEntity> findByPagingCriteria(MauSacDto mauSacDto, Pageable pageable) {
        Page<MauSacEntity> page = mauSacRepository.findAll(new Specification<MauSacEntity>() {
            @Override
            public Predicate toPredicate(Root<MauSacEntity> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
                List<Predicate> predicates = new ArrayList<>();
                if(mauSacDto != null){
                    if(mauSacDto.getMa() != null && !mauSacDto.getMa().isEmpty()){
                        predicates.add(criteriaBuilder.like(root.get("ma"),"%" + mauSacDto.getMa() + "%"));
                    }
                    if(mauSacDto.getTen() != null && !mauSacDto.getTen().isEmpty()){
                        predicates.add(criteriaBuilder.like(root.get("ten"),"%" + mauSacDto.getTen() + "%"));
                    }
                    if(mauSacDto.getTrangThai() !=null){
                        predicates.add(criteriaBuilder.equal(root.get("trangThai"),mauSacDto.getTrangThai()));
                    }
                }
                return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
            }
        },pageable);
        PageResponse<MauSacEntity> pageResponse = new PageResponse<>();
        pageResponse.setTotalElements((int) page.getTotalElements());
        pageResponse.setTotalPages(page.getTotalPages());
        pageResponse.setSize(page.getSize());
        pageResponse.setPage(page.getNumber() + 1);
        pageResponse.setContent(page.getContent());

        return pageResponse;
    }
}
