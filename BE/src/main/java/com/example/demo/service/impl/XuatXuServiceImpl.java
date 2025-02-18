package com.example.demo.service.impl;

import com.example.demo.dto.request.XuatXuDto;
import com.example.demo.dto.request.XuatXuUpdateDto;
import com.example.demo.dto.response.PageResponse;
import com.example.demo.entity.ChatLieuEntity;
import com.example.demo.entity.ThuongHieuEntity;
import com.example.demo.entity.XuatXuEntity;
import com.example.demo.repository.XuatXuRepository;
import com.example.demo.service.XuatXuService;
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
public class XuatXuServiceImpl implements XuatXuService {
    @Autowired
    private XuatXuRepository xuatXuRepository;
    @Override
    public List<XuatXuEntity> getAll() {
        return xuatXuRepository.findAll();
    }

    @Override
    public XuatXuEntity add(XuatXuDto xuatXuDto) {
        XuatXuEntity xuatXuEntity = new XuatXuEntity();
        xuatXuEntity.setMa(xuatXuDto.getMa());
        xuatXuEntity.setTen(xuatXuDto.getTen());
        xuatXuEntity.setTrangThai(xuatXuDto.getTrangThai());
        return xuatXuRepository.save(xuatXuEntity);
    }

    @Override
    public XuatXuEntity addNhanh(XuatXuDto xuatXuDto) {
        if (xuatXuDto.getTen() == null || xuatXuDto.getTen().trim().isEmpty()) {
            throw new IllegalArgumentException("xuất xứ không được để trống.");
        }


      XuatXuEntity xuatXuEntity = new XuatXuEntity();


        xuatXuEntity.setMa(xuatXuDto.getMa() != null ? xuatXuDto.getMa() : generateMa());


        xuatXuEntity.setTrangThai(xuatXuDto.getTrangThai() != null ? xuatXuDto.getTrangThai() : 1);


        xuatXuEntity.setTen(xuatXuDto.getTen().trim());


        return xuatXuRepository.save(xuatXuEntity);
    }


    private String generateMa() {
        return "XX" + System.currentTimeMillis();
    }

    @Override
    public XuatXuEntity update(XuatXuUpdateDto xuatXuUpdateDto) {
        Optional<XuatXuEntity> optional = xuatXuRepository.findById(xuatXuUpdateDto.getId());
        return optional.map(o->{
            o.setMa(xuatXuUpdateDto.getMa());
            o.setTen(xuatXuUpdateDto.getTen());
            o.setTrangThai(xuatXuUpdateDto.getTrangThai());
            return xuatXuRepository.save(o);
        }).orElse(null);
    }

    @Override
    public XuatXuEntity detail(XuatXuUpdateDto xuatXuUpdateDto) {
        Optional<XuatXuEntity> optional = xuatXuRepository.findById(xuatXuUpdateDto.getId());
        return optional.orElse(null);
    }

    @Override
    public XuatXuEntity delete(XuatXuUpdateDto xuatXuUpdateDto) {
        Optional<XuatXuEntity> optional = xuatXuRepository.findById(xuatXuUpdateDto.getId());
        return optional.map(o->{
            xuatXuRepository.delete(o);
            return o;
        }).orElse(null);
    }

    @Override
    public XuatXuEntity toggleTrangThai(XuatXuUpdateDto xuatXuUpdateDto) {
        Optional<XuatXuEntity> optional = xuatXuRepository.findById(xuatXuUpdateDto.getId());
        return optional.map(xuatXuEntity -> {

            xuatXuEntity.setTrangThai(xuatXuEntity.getTrangThai() == 1 ? 0 : 1);
            return xuatXuRepository.save(xuatXuEntity);
        }).orElse(null);
    }

    @Override
    public PageResponse<XuatXuEntity> findByPagingCriteria(XuatXuDto xuatXuDto, Pageable pageable) {
        Page<XuatXuEntity> page = xuatXuRepository.findAll(new Specification<XuatXuEntity>() {
            @Override
            public Predicate toPredicate(Root<XuatXuEntity> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
                List<Predicate> predicates = new ArrayList<>();
                if(xuatXuDto != null){
                    if(xuatXuDto.getMa() != null && !xuatXuDto.getMa().isEmpty()){
                        predicates.add(criteriaBuilder.like(root.get("ma"),"%" + xuatXuDto.getMa() + "%"));
                    }
                    if(xuatXuDto.getTen() != null && !xuatXuDto.getTen().isEmpty()){
                        predicates.add(criteriaBuilder.like(root.get("ten"),"%" + xuatXuDto.getTen() + "%"));
                    }
                    if(xuatXuDto.getTrangThai() !=null){
                        predicates.add(criteriaBuilder.equal(root.get("trangThai"),xuatXuDto.getTrangThai()));
                    }
                }
                return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
            }
        },pageable);
        PageResponse<XuatXuEntity> pageResponse = new PageResponse<>();
        pageResponse.setTotalElements((int) page.getTotalElements());
        pageResponse.setTotalPages(page.getTotalPages());
        pageResponse.setSize(page.getSize());
        pageResponse.setPage(page.getNumber() + 1);
        pageResponse.setContent(page.getContent());

        return pageResponse;
    }
}
