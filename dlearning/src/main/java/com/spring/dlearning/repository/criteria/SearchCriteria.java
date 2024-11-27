package com.spring.dlearning.repository.criteria;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SearchCriteria {
    private String key; // firstName, lastName, email --> search theo columns nao
    private String operator; // =, < , > , like, >=, <=
    private Object value; // co rat nhieu kieu khac nhau: vd: date, string, long, vv.. -> dinh nghia kieu chung la Object
}
