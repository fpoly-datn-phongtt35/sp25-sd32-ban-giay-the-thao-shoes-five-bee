package com.example.demo.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.demo.dto.request.DiaChiDto;
import com.example.demo.dto.request.UserDto;
import com.example.demo.dto.request.UserDtoSearch;
import com.example.demo.dto.response.PageResponse;
import com.example.demo.entity.DiaChiEntity;
import com.example.demo.entity.UserEntity;
import com.example.demo.entity.UserRoleEntity;
import com.example.demo.repository.DiaChiRepository;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.UserRoleRepository;
import com.example.demo.service.UsersService;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;


@Service
@Slf4j
public class UsersServiceImpl implements UsersService {
  @Autowired private UserRepository userRepository;
  @Autowired private RoleRepository roleRepository;
  @Autowired private UserRoleRepository userRoleRepository;
  @Autowired private PasswordEncoder passwordEncoder;
  @Autowired private DiaChiRepository diaChiRepository;
  @Autowired private Cloudinary cloudinary;

  @Override
  public String getAuthenticatedUserEmail() throws UsernameNotFoundException {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication != null && authentication.isAuthenticated()) {
      UserDetails userDetails = (UserDetails) authentication.getPrincipal();
      if (userDetails != null) {
        String loggedEmail = userDetails.getUsername();

        return loggedEmail;
      } else {
        throw new IllegalArgumentException("User này không tồn tại");
      }
    }
    throw new IllegalArgumentException("User này không tồn tại");
  }

  @Override
  public List<UserDto> getAll() {
    return userRepository.findAll().stream()
        .map(
            user -> {
              List<String> roleNames =
                  user.getUserRoleEntities().stream()
                      .map(userRole -> userRole.getRoleEntity().getTen())
                      .collect(Collectors.toList());
              List<DiaChiDto> diaChiDtos =
                  user.getDiaChiEntities().stream()
                      .map(
                          diaChi ->
                              new DiaChiDto(
                                  diaChi.getId(),
                                  diaChi.getXa(),
                                  diaChi.getHuyen(),
                                  diaChi.getThanhPho(),
                                  diaChi.getTenNguoiNhan(),
                                  diaChi.getTenDiaChi(),
                                  diaChi.getSdtNguoiNhan(),
                                  diaChi.getTrangThai(),
                                  diaChi.getUserEntity()))
                      .collect(Collectors.toList());
              return new UserDto(
                  user.getId(),
                  user.getAnh(),
                  user.getHoTen(),
                  user.getNgaySinh(),
                  user.getSoDienThoai(),
                  user.getEmail(),
                  user.getMatKhau(),
                  user.getIsEnabled(),
                  roleNames,
                  diaChiDtos);
            })
        .collect(Collectors.toList());
  }

  public String uploadUserImage(MultipartFile file) throws IOException {
    assert file.getOriginalFilename() != null;
    String publicValue = generatePublicValue(file.getOriginalFilename());
    String extension = getFileName(file.getOriginalFilename())[1];
    File fileUpload = convert(file);
    cloudinary.uploader().upload(fileUpload, ObjectUtils.asMap("public_id", publicValue));
    cleanDisk(fileUpload);
    return cloudinary.url().generate(StringUtils.join(publicValue, ".", extension));
  }

  private void cleanDisk(File file) {
    try {
      log.info("file.toPath(): {}", file.toPath());
      Path filePath = file.toPath();
      Files.delete(filePath);
    } catch (IOException e) {
      log.error("Error");
    }
  }

  private File convert(MultipartFile file) throws IOException {
    String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
    File convFile = new File(System.getProperty("java.io.tmpdir"), fileName);
    try (InputStream is = file.getInputStream()) {
      Files.copy(is, convFile.toPath());
    }
    return convFile;
  }

  public String generatePublicValue(String originalName) {
    String fileName = getFileName(originalName)[0];
    return StringUtils.join(UUID.randomUUID().toString(), "_", fileName);
  }

  public String[] getFileName(String originalName) {
    int dotIndex = originalName.lastIndexOf('.');
    if (dotIndex > 0) {
      return new String[] {
        originalName.substring(0, dotIndex), originalName.substring(dotIndex + 1)
      };
    }
    return new String[] {originalName, ""};
  }

  @Transactional
  @Override
  public UserEntity add(UserDto userDto, MultipartFile file) throws IOException {
    UserEntity userEntity = new UserEntity();
    if (file != null && !file.isEmpty()) {
      String imageUrl = uploadUserImage(file);
      userEntity.setAnh(imageUrl);
    }
    userEntity.setHoTen(userDto.getHoTen());
    userEntity.setNgaySinh(userDto.getNgaySinh());
    userEntity.setSoDienThoai(userDto.getSoDienThoai());
    userEntity.setEmail(userDto.getEmail());
    userEntity.setMatKhau(passwordEncoder.encode(userDto.getMatKhau()));
    userEntity.setIsEnabled(userDto.getIsEnabled());
    UserEntity savedUser = userRepository.save(userEntity);
    // them role vao user
    if (userDto.getRoleNames() != null && !userDto.getRoleNames().isEmpty()) {
      List<UserRoleEntity> userRoles =
          userDto.getRoleNames().stream()
              .map(roleName -> roleRepository.findByTen(roleName).orElse(null))
              .filter(role -> role != null)
              .map(role -> new UserRoleEntity(savedUser, role))
              .collect(Collectors.toList());
      userRoleRepository.saveAll(userRoles);
    }
    if (userDto.getDiaChi() != null && !userDto.getDiaChi().isEmpty()) {
      List<DiaChiEntity> diaChiEntities =
          userDto.getDiaChi().stream()
              .map(
                  diaChiDto -> {
                    DiaChiEntity diaChiEntity = new DiaChiEntity();
                    diaChiEntity.setXa(diaChiDto.getXa());
                    diaChiEntity.setHuyen(diaChiDto.getHuyen());
                    diaChiEntity.setThanhPho(diaChiDto.getThanhPho());
                    diaChiEntity.setUserEntity(savedUser);
                    return diaChiEntity;
                  })
              .collect(Collectors.toList());
      diaChiRepository.saveAll(diaChiEntities);
    }

    return savedUser;
  }

  @Override
  @Transactional
  public UserEntity update(UserDto userDto, MultipartFile file) throws IOException {
    Optional<UserEntity> optional = userRepository.findById(userDto.getId());
    return optional
        .map(
            o -> {
              if (file != null && !file.isEmpty()) {
                try {
                  String imageUrl = uploadUserImage(file);
                  o.setAnh(imageUrl);
                } catch (IOException e) {
                  log.error("Lỗi khi upload ảnh: {}", e.getMessage());
                }
              }
              o.setHoTen(userDto.getHoTen());
              o.setNgaySinh(userDto.getNgaySinh());
              o.setSoDienThoai(userDto.getSoDienThoai());
              o.setEmail(userDto.getEmail());
              o.setMatKhau(userDto.getMatKhau());
              o.setIsEnabled(userDto.getIsEnabled());
              // update role user
              userRoleRepository.deleteByUserEntityId(o.getId());
              if (userDto.getRoleNames() != null && !userDto.getRoleNames().isEmpty()) {
                List<UserRoleEntity> userRoleEntities =
                    userDto.getRoleNames().stream()
                        .map(roleName -> roleRepository.findByTen(roleName).orElse(null))
                        .filter(role -> role != null)
                        .map(role -> new UserRoleEntity(o, role))
                        .collect(Collectors.toList());
                userRoleRepository.saveAll(userRoleEntities);
              }
              // update dia chi
              diaChiRepository.deleteByUserEntityId(o.getId());
              if (userDto.getDiaChi() != null && !userDto.getDiaChi().isEmpty()) {
                List<DiaChiEntity> diaChiEntities =
                    userDto.getDiaChi().stream()
                        .map(
                            diaChiDto -> {
                              DiaChiEntity diaChiEntity = new DiaChiEntity();
                              diaChiEntity.setXa(diaChiDto.getXa());
                              diaChiEntity.setHuyen(diaChiDto.getHuyen());
                              diaChiEntity.setThanhPho(diaChiDto.getThanhPho());
                              diaChiEntity.setUserEntity(o);
                              return diaChiEntity;
                            })
                        .collect(Collectors.toList());
                diaChiRepository.saveAll(diaChiEntities);
              }
              return userRepository.save(o);
            })
        .orElse(null);
  }

  @Override
  @Transactional
  public UserEntity delete(UserDto userDto) {
    Optional<UserEntity> optional = userRepository.findById(userDto.getId());
    return optional
        .map(
            o -> {
              userRoleRepository.deleteByUserEntityId(o.getId());
              userRepository.delete(o);
              return o;
            })
        .orElse(null);
  }

  @Override
  public UserEntity detail(UserDto userDto) {
    Optional<UserEntity> optional = userRepository.findById(userDto.getId());
    return optional.orElse(null);
  }


    @Override
    public PageResponse<UserEntity> findByPagingCriteria(UserDtoSearch userDtoSearch, Pageable pageable) {
        Page<UserEntity> page = userRepository.findAll(new Specification<UserEntity>() {
            @Override
            public Predicate toPredicate(Root<UserEntity> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
                List<Predicate> predicates = new ArrayList<>();
                if (userDtoSearch != null){
                    if(userDtoSearch.getHoTen() != null && !userDtoSearch.getHoTen().isEmpty()){
                        predicates.add(criteriaBuilder.like(root.get("hoTen"),"%" + userDtoSearch.getHoTen() + "%"));
                    }
                    if(userDtoSearch.getEmail() != null && !userDtoSearch.getEmail().isEmpty()){
                        predicates.add(criteriaBuilder.like(root.get("email"),"%" + userDtoSearch.getEmail()+"%"));
                    }
                    if(userDtoSearch.getSoDienThoai() != null && !userDtoSearch.getSoDienThoai().isEmpty()){
                        predicates.add(criteriaBuilder.like(root.get("soDienThoai"),"%"+ userDtoSearch.getSoDienThoai()+"%"));
                    }
                    if(userDtoSearch.getNgaySinh() != null){
                        predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("ngaySinh"),userDtoSearch.getNgaySinh()));
                    }
                    if (userDtoSearch.getKhoangNgaySinh() != null){
                        predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("ngaySinh"),userDtoSearch.getKhoangNgaySinh()));
                    }
                }
                return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
            }
        },pageable);
        PageResponse<UserEntity> pageResponse = new PageResponse<>();
        pageResponse.setTotalElements((int) page.getTotalElements());
        pageResponse.setTotalPages(page.getTotalPages());
        pageResponse.setSize(page.getSize());
        pageResponse.setPage(page.getNumber() +1);
        pageResponse.setContent(page.getContent());
        return pageResponse;
    }

    @Override
    public List<UserEntity> exportExcelByFindJpa(UserDtoSearch userDtoSearch) {
        return userRepository.findAll(new Specification<UserEntity>() {
            @Override
            public Predicate toPredicate(Root<UserEntity> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
                List<Predicate> predicates = new ArrayList<>();
                if (userDtoSearch != null){
                    if(userDtoSearch.getHoTen() != null && !userDtoSearch.getHoTen().isEmpty()){
                        predicates.add(criteriaBuilder.like(root.get("hoTen"),"%" + userDtoSearch.getHoTen() + "%"));
                    }
                    if(userDtoSearch.getEmail() != null && !userDtoSearch.getEmail().isEmpty()){
                        predicates.add(criteriaBuilder.like(root.get("email"),"%" + userDtoSearch.getEmail()+"%"));
                    }
                    if(userDtoSearch.getSoDienThoai() != null && !userDtoSearch.getSoDienThoai().isEmpty()){
                        predicates.add(criteriaBuilder.like(root.get("soDienThoai"),"%"+ userDtoSearch.getSoDienThoai()+"%"));
                    }
                    if(userDtoSearch.getNgaySinh() != null){
                        predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("ngaySinh"),userDtoSearch.getNgaySinh()));
                    }
                    if (userDtoSearch.getKhoangNgaySinh() != null){
                        predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("ngaySinh"),userDtoSearch.getKhoangNgaySinh()));
                    }

                }
                return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
            }
        });
    }

    @Override
    public List<UserDto> importExcel(MultipartFile file) throws IOException {
        List<UserDto> userDtos = new ArrayList<>();
        List<String> errors = new ArrayList<>();
        Workbook workbook = new XSSFWorkbook(file.getInputStream());
        Sheet sheet = workbook.getSheetAt(0);
        DataFormatter dataFormatter = new DataFormatter();

        for (int rowIndex = 1; rowIndex <= sheet.getLastRowNum(); rowIndex++) {
            Row row = sheet.getRow(rowIndex);
            if (row != null) {
                try {
                    UserDto userDto = new UserDto();

                    String hoTen = dataFormatter.formatCellValue(row.getCell(0));
                    if (hoTen == null || hoTen.trim().isEmpty()) {
                        errors.add("họ tên không được để trống : " + (rowIndex + 1));
                        continue;
                    }
                    userDto.setHoTen(hoTen.trim());

                    Cell ngaySinhCell = row.getCell(1);
                    if (ngaySinhCell != null) {
                        if (ngaySinhCell.getCellType() == CellType.NUMERIC) {
                            java.util.Date utilDate = DateUtil.getJavaDate(ngaySinhCell.getNumericCellValue());
                            userDto.setNgaySinh(new java.sql.Date(utilDate.getTime()));
                        } else if (ngaySinhCell.getCellType() == CellType.STRING) {
                            try {
                                String ngaySinhStr = ngaySinhCell.getStringCellValue().trim();
                                SimpleDateFormat sdf;
                                if (ngaySinhStr.contains("-")) {
                                    sdf = new SimpleDateFormat("dd-MM-yyyy");
                                } else {
                                    sdf = new SimpleDateFormat("dd/MM/yyyy");
                                }
                                java.util.Date utilDate = sdf.parse(ngaySinhStr);
                                userDto.setNgaySinh(new java.sql.Date(utilDate.getTime()));
                            } catch (ParseException e) {
                                errors.add("ngày sinh không hợp lệ : " + (rowIndex + 1));
                                continue;
                            }
                        } else {
                            errors.add("ngày sinh sai định dạng : " + (rowIndex + 1));
                            continue;
                        }
                    } else {
                        errors.add("ngày sinh không được để trống : " + (rowIndex + 1));
                        continue;
                    }

                    Cell soDienThoaiCell = row.getCell(2);
                    if (soDienThoaiCell == null || soDienThoaiCell.getCellType() != CellType.STRING) {
                        errors.add("số điện thoại không hợp lệ : " + (rowIndex + 1));
                        continue;
                    }
                    String soDienThoai = soDienThoaiCell.getStringCellValue().trim();
                    if (!soDienThoai.matches("\\d{10}")) {
                        errors.add("số điện thoại phải có 10 chữ số : " + (rowIndex + 1));
                        continue;
                    }
                    userDto.setSoDienThoai(soDienThoai);

                    String email = dataFormatter.formatCellValue(row.getCell(3));
                    if (email == null || email.trim().isEmpty()) {
                        errors.add("email không được để trống : " + (rowIndex + 1));
                        continue;
                    }
                    userDto.setEmail(email.trim());

                    String matKhau = dataFormatter.formatCellValue(row.getCell(4));
                    if (matKhau == null || matKhau.trim().isEmpty()) {
                        errors.add("mật khẩu không được để trống : " + (rowIndex + 1));
                        continue;
                    }
                    userDto.setMatKhau(matKhau.trim());

//                    String roleNamesStr = dataFormatter.formatCellValue(row.getCell(5));
//                    if (roleNamesStr != null && !roleNamesStr.trim().isEmpty()) {
//                        List<String> roleNames = Arrays.asList(roleNamesStr.split(","));
//                        userDto.setRoleNames(roleNames);
//                    }
                    List<UserEntity> userEntities = userRepository.findByEmailAndMatKhau(email,matKhau);
                    if (!userEntities.isEmpty()){
                        errors.add("email \"" + email + "\" với mật khẩu \"" + matKhau + "\" đã tồn tại !");
                    }else {
                        userDtos.add(userDto);
                    }

                } catch (Exception e) {
                    errors.add("lỗi không xác định : " + (rowIndex + 1));
                }
            }
        }
        workbook.close();
        if (!errors.isEmpty()) {
            throw new RuntimeException("lỗi khi nhập dữ liệu từ Excel: " + String.join(", ", errors));
        }
        List<UserEntity> userEntities = new ArrayList<>();
        for (UserDto userDto : userDtos){
            UserEntity userEntity = new UserEntity();
            userEntity.setHoTen(userDto.getHoTen());
            userEntity.setNgaySinh(userDto.getNgaySinh());
            userEntity.setSoDienThoai(userDto.getSoDienThoai());
            userEntity.setEmail(userDto.getEmail());
            userEntity.setMatKhau(userDto.getMatKhau());
            userEntities.add(userEntity);
        }
        userRepository.saveAll(userEntities);
        return userDtos;
    }

    @Override
    public List<UserDto> importExcelCheckDuplicate(MultipartFile file) throws IOException {
        List<UserDto> userDtos = new ArrayList<>();
        List<String> errors = new ArrayList<>();
        Workbook workbook = new XSSFWorkbook(file.getInputStream());
        Sheet sheet = workbook.getSheetAt(0);
        DataFormatter dataFormatter = new DataFormatter();

        for (int rowIndex = 1; rowIndex <= sheet.getLastRowNum(); rowIndex++) {
            Row row = sheet.getRow(rowIndex);
            if (row != null) {
                try {
                    UserDto userDto = new UserDto();

                    String hoTen = dataFormatter.formatCellValue(row.getCell(0));
                    if (hoTen == null || hoTen.trim().isEmpty()) {
                        errors.add("họ tên không được để trống : " + (rowIndex + 1));
                        continue;
                    }
                    userDto.setHoTen(hoTen.trim());

                    Cell ngaySinhCell = row.getCell(1);
                    if (ngaySinhCell != null) {
                        if (ngaySinhCell.getCellType() == CellType.NUMERIC) {
                            java.util.Date utilDate = DateUtil.getJavaDate(ngaySinhCell.getNumericCellValue());
                            userDto.setNgaySinh(new java.sql.Date(utilDate.getTime()));
                        } else if (ngaySinhCell.getCellType() == CellType.STRING) {
                            try {
                                SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
                                java.util.Date utilDate = sdf.parse(ngaySinhCell.getStringCellValue());
                                userDto.setNgaySinh(new java.sql.Date(utilDate.getTime()));
                            } catch (ParseException e) {
                                errors.add("ngày sinh không hợp lệ : " + (rowIndex + 1));
                                continue;
                            }
                        } else {
                            errors.add("ngày sinh sai định dạng : " + (rowIndex + 1));
                            continue;
                        }
                    } else {
                        errors.add("ngày sinh không được để trống : " + (rowIndex + 1));
                        continue;
                    }

                    Cell soDienThoaiCell = row.getCell(2);
                    if (soDienThoaiCell == null || soDienThoaiCell.getCellType() != CellType.STRING) {
                        errors.add("số điện thoại không hợp lệ : " + (rowIndex + 1));
                        continue;
                    }
                    String soDienThoai = soDienThoaiCell.getStringCellValue().trim();
                    if (!soDienThoai.matches("\\d{10}")) {
                        errors.add("số điện thoại phải có 10 chữ số : " + (rowIndex + 1));
                        continue;
                    }
                    userDto.setSoDienThoai(soDienThoai);

                    String email = dataFormatter.formatCellValue(row.getCell(3));
                    if (email == null || email.trim().isEmpty()) {
                        errors.add("email không được để trống : " + (rowIndex + 1));
                        continue;
                    }
                    userDto.setEmail(email.trim());

                    String matKhau = dataFormatter.formatCellValue(row.getCell(4));
                    if (matKhau == null || matKhau.trim().isEmpty()) {
                        errors.add("mật khẩu không được để trống : " + (rowIndex + 1));
                        continue;
                    }
                    userDto.setMatKhau(matKhau.trim());


                    userDtos.add(userDto);
                } catch (Exception e) {
                    errors.add("lỗi không xác định : " + (rowIndex + 1));
                }
            }
        }
        workbook.close();
        if (!errors.isEmpty()) {
            throw new RuntimeException("lỗi khi nhập dữ liệu từ Excel: " + String.join(", ", errors));
        }
        List<UserEntity> userEntities = new ArrayList<>();
        for (UserDto userDto : userDtos){
            UserEntity userEntity = new UserEntity();
            userEntity.setHoTen(userDto.getHoTen());
            userEntity.setNgaySinh(userDto.getNgaySinh());
            userEntity.setSoDienThoai(userDto.getSoDienThoai());
            userEntity.setEmail(userDto.getEmail());
            userEntity.setMatKhau(userDto.getMatKhau());

            userEntities.add(userEntity);
        }
        userRepository.saveAll(userEntities);
        return userDtos;
    }




}
