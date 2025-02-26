package com.example.demo.controller;

import com.example.demo.dto.request.ChatLieuDto;
import com.example.demo.dto.request.RoleDto;
import com.example.demo.dto.request.UserDto;
import com.example.demo.dto.request.UserDtoSearch;
import com.example.demo.entity.UserEntity;
import com.example.demo.service.UsersService;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.OutputStream;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/user")
public class UsersController {
    @Autowired
    private UsersService usersService;

    @GetMapping("/getAll")
    public ResponseEntity<?> getAll(){
        return ResponseEntity.ok(usersService.getAll());
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestPart("userDto") UserDto userDto, @RequestParam("file")MultipartFile file)throws IOException {
        usersService.add(userDto,file);
        return ResponseEntity.ok(Collections.singletonMap("message","add success"));
    }

    @PostMapping("/search")
    public ResponseEntity<?> findAndPageChatLieu(@RequestBody UserDtoSearch userDtoSearch){
        Pageable pageable = PageRequest.of(userDtoSearch.getPage(),userDtoSearch.getSize());
        return ResponseEntity.ok(usersService.findByPagingCriteria(userDtoSearch,pageable));
    }

    @PostMapping("/export-excel")
    public ResponseEntity<?> exportExcel(@RequestBody UserDtoSearch userDtoSearch , HttpServletResponse httpServletResponse){
        try {
            List<UserEntity> userEntities = usersService.exportExcelByFindJpa(userDtoSearch);
            httpServletResponse.setContentType("application/octet-stream");
            String headerKey = "Content-Disposition";
            String headerValue = "attachment; filename=user.xlsx";
            httpServletResponse.setHeader(headerKey, headerValue);
            // tao excel
            Workbook workbook = new XSSFWorkbook();
            Sheet sheet = workbook.createSheet("Users");
            CellStyle cellStyle = workbook.createCellStyle();
            CreationHelper creationHelper = workbook.getCreationHelper();
            cellStyle.setDataFormat(creationHelper.createDataFormat().getFormat("dd-MM-yyyy"));
            // tao ten cot
            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("HO TEN");
            headerRow.createCell(1).setCellValue("EMAIL");
            headerRow.createCell(2).setCellValue("NGAY SINH");
            headerRow.createCell(3).setCellValue("SO DIEN THOAI");
            int rowIndex= 1;
            for (UserEntity userEntity : userEntities){
                Row row = sheet.createRow(rowIndex++);
                row.createCell(0).setCellValue(userEntity.getHoTen());
                row.createCell(1).setCellValue(userEntity.getEmail());
                row.createCell(3).setCellValue(userEntity.getSoDienThoai());
                Cell ngaySinhCell = row.createCell(2);
                ngaySinhCell.setCellValue(userEntity.getNgaySinh());
                ngaySinhCell.setCellStyle(cellStyle);
            }
            OutputStream outputStream = httpServletResponse.getOutputStream();
            workbook.write(outputStream);
            workbook.close();
            return ResponseEntity.ok("file excel đã được xuất thành công");
        }catch (IOException e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("có lỗi xảy ra");
        }
    }

    @PostMapping("/import-excel")
    public ResponseEntity<?> importUserFormExcel(@RequestParam("file")MultipartFile file) throws IOException{
        if (file.isEmpty()){
            return ResponseEntity.badRequest().body("no file uploaded");
        }
        String fileName = file.getOriginalFilename();
        if (!fileName.endsWith(".xlsx") && !fileName.endsWith(".xls")){
            return ResponseEntity.badRequest().body("file must be an excel file");
        }
        try {
            List<UserEntity> userDtos = usersService.importExcel(file);
            return ResponseEntity.ok().body(userDtos);
        }catch (RuntimeException e){
            return ResponseEntity.badRequest().body("import errors :" +e.getMessage());
        }catch (IOException e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("error processing the file");
        }
    }

    @PostMapping("/import-excelSkipDuplicate")
    public ResponseEntity<?> importExcelSkipDuplicate(@RequestParam("file")MultipartFile file) throws IOException{
        if (file.isEmpty()){
            return ResponseEntity.badRequest().body("no file upload");
        }
        String fileName = file.getOriginalFilename();
        if (!fileName.endsWith(".xlsx") && !fileName.endsWith(".xls")){
            return ResponseEntity.badRequest().body("file must be an excel file");
        }
        try {
            List<UserDto> userDtos = usersService.importExcelCheckDuplicate(file);
            return ResponseEntity.ok().body(userDtos);
        }catch (RuntimeException e){
            return ResponseEntity.badRequest().body("import errors :" +e.getMessage());
        }catch (IOException e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("error processing the file");


        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> update(@RequestPart("userDto") UserDto userDto, @RequestParam(value = "file", required = false) MultipartFile file) throws IOException{
        usersService.update(userDto,file);
        return ResponseEntity.ok(Collections.singletonMap("message","update success"));
    }

    @PostMapping("/delete")
    public ResponseEntity<?> delete(@RequestBody UserDto userDto){
        usersService.delete(userDto);
        return ResponseEntity.ok(Collections.singletonMap("message","delete success"));
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<?> detail(@PathVariable UUID id){
        UserDto userDto = new UserDto();
        userDto.setId(id);
        return ResponseEntity.ok(usersService.detail(userDto));
    }
}
