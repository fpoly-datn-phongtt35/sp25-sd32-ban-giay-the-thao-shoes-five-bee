package com.example.demo.service.impl;

import com.example.demo.dto.request.ThuongHieuDto;
import com.example.demo.dto.request.ThuongHieuUpdateDto;
import com.example.demo.dto.response.PageResponse;
import com.example.demo.entity.ChatLieuEntity;
import com.example.demo.entity.ThuongHieuEntity;
import com.example.demo.entity.XuatXuEntity;
import com.example.demo.repository.ThuongHieuRepository;
import com.example.demo.service.ThuongHieuService;
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
public class ThuongHieuServiceImpl implements ThuongHieuService {
    @Autowired
    private ThuongHieuRepository thuongHieuRepository;
    @Override
    public List<ThuongHieuEntity> getAll() {
        return thuongHieuRepository.findAll();
    }

    @Override
    public ThuongHieuEntity add(ThuongHieuDto thuongHieuDto) {
        ThuongHieuEntity thuongHieuEntity = new ThuongHieuEntity();
        thuongHieuEntity.setMa(thuongHieuDto.getMa());
        thuongHieuEntity.setTen(thuongHieuDto.getTen());
        thuongHieuEntity.setTrangThai(thuongHieuDto.getTrangThai());
        return thuongHieuRepository.save(thuongHieuEntity);
    }

    @Override
    public ThuongHieuEntity addNhanh(ThuongHieuDto thuongHieuDto) {
        if (thuongHieuDto.getTen() == null || thuongHieuDto.getTen().trim().isEmpty()) {
            throw new IllegalArgumentException("Thuong hieu khong duoc de trong.");
        }


        ThuongHieuEntity thuongHieuEntity = new ThuongHieuEntity();


        thuongHieuEntity.setMa(thuongHieuDto.getMa() != null ? thuongHieuDto.getMa() : generateMa());


        thuongHieuEntity.setTrangThai(thuongHieuDto.getTrangThai() != null ? thuongHieuDto.getTrangThai() : 1);


        thuongHieuEntity.setTen(thuongHieuDto.getTen().trim());


        return thuongHieuRepository.save(thuongHieuEntity);}
    private String generateMa() {
        return "TH" + System.currentTimeMillis();
    }

    @Override
    public ThuongHieuEntity update(ThuongHieuUpdateDto thuongHieuUpdateDto) {
        Optional<ThuongHieuEntity> optional = thuongHieuRepository.findById(thuongHieuUpdateDto.getId());
        return optional.map(o->{
            o.setMa(thuongHieuUpdateDto.getMa());
            o.setTen(thuongHieuUpdateDto.getTen());
            o.setMa(thuongHieuUpdateDto.getMa());
            return thuongHieuRepository.save(o);
        }).orElse(null);
    }

    @Override
    public ThuongHieuEntity detail(ThuongHieuUpdateDto thuongHieuUpdateDto) {
        Optional<ThuongHieuEntity> optional = thuongHieuRepository.findById(thuongHieuUpdateDto.getId());
        return optional.orElse(null);
    }

    @Override
    public ThuongHieuEntity delete(ThuongHieuUpdateDto thuongHieuUpdateDto) {
        Optional<ThuongHieuEntity> optional = thuongHieuRepository.findById(thuongHieuUpdateDto.getId());
        return optional.map(o->{
            thuongHieuRepository.delete(o);
            return o;
        }).orElse(null);
    }

    @Override
    public ThuongHieuEntity toggleTrangThai(ThuongHieuUpdateDto thuongHieuUpdateDto) {
        Optional<ThuongHieuEntity> optional = thuongHieuRepository.findById(thuongHieuUpdateDto.getId());
        return optional.map(thuongHieuEntity -> {

            thuongHieuEntity.setTrangThai(thuongHieuEntity.getTrangThai() == 1 ? 0 : 1);
            return thuongHieuRepository.save(thuongHieuEntity);
        }).orElse(null);
    }

    @Override
    public PageResponse<ThuongHieuEntity> findByPagingCriteria(ThuongHieuDto thuongHieuDto, Pageable pageable) {
        Page<ThuongHieuEntity> page = thuongHieuRepository.findAll(new Specification<ThuongHieuEntity>() {
            @Override
            public Predicate toPredicate(Root<ThuongHieuEntity> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
                List<Predicate> predicates = new ArrayList<>();
                if(thuongHieuDto != null){
                    if(thuongHieuDto.getMa() != null && !thuongHieuDto.getMa().isEmpty()){
                        predicates.add(criteriaBuilder.like(root.get("ma"),"%" + thuongHieuDto.getMa() + "%"));
                    }
                    if(thuongHieuDto.getTen() != null && !thuongHieuDto.getTen().isEmpty()){
                        predicates.add(criteriaBuilder.like(root.get("ten"),"%" + thuongHieuDto.getTen() + "%"));
                    }
                    if(thuongHieuDto.getTrangThai() !=null){
                        predicates.add(criteriaBuilder.equal(root.get("trangThai"),thuongHieuDto.getTrangThai()));
                    }
                }
                return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
            }
        },pageable);
        PageResponse<ThuongHieuEntity> pageResponse = new PageResponse<>();
        pageResponse.setTotalElements((int) page.getTotalElements());
        pageResponse.setTotalPages(page.getTotalPages());
        pageResponse.setSize(page.getSize());
        pageResponse.setPage(page.getNumber() + 1);
        pageResponse.setContent(page.getContent());

        return pageResponse;
    }
}
