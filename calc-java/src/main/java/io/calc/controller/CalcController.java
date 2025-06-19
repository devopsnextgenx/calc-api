package io.calc.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.calc.service.CalcService;

import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/v1/calc")
public class CalcController {

    private final CalcService calcService;
    
    public CalcController(CalcService calcService) {
        this.calcService = calcService;
    }

    @GetMapping("/add")
    public ResponseEntity<Integer> add(@RequestParam int a, @RequestParam int b) {
        return ResponseEntity.ok(calcService.add(a, b));
    }

    @GetMapping("/sub")
    public ResponseEntity<Integer> sub(@RequestParam int a, @RequestParam int b) {
        return ResponseEntity.ok(calcService.subtract(a, b));
    }

    @GetMapping("/mul")
    public ResponseEntity<Integer> mul(@RequestParam int a, @RequestParam int b) {
        return ResponseEntity.ok(calcService.multiply(a, b));
    }

    @GetMapping("/div")
    public ResponseEntity<Float> div(@RequestParam double a, @RequestParam double b) {
        return ResponseEntity.ok(calcService.divide(a, b));
    }

    @GetMapping("/sqr")
    public ResponseEntity<Integer> sqr(@RequestParam int a) {
        return ResponseEntity.ok(calcService.sqr(a));
    }
}
