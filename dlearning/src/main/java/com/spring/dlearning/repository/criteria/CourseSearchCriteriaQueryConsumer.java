package com.spring.dlearning.repository.criteria;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import java.util.function.Consumer;

@Setter
@Getter
@Slf4j
@NoArgsConstructor
@AllArgsConstructor
public class CourseSearchCriteriaQueryConsumer implements Consumer<SearchCriteria> {
    /*
    trong nay chung ta can xu ly cai gi ?
    thi trong nay chung ta can xu ly: operator duoc dinh nghia trong SearchCriteria
    cu the: dau > thi nghia la gi, dau : thi tuong ung la cai gi, dau < thi tuong ung cai gi
    */
    private CriteriaBuilder criteriaBuilder;
    private Predicate predicate; // Predicate cua : jakarta.persistence.criteria
    private Root root;

    @Override
    public void accept(SearchCriteria searchCriteria) {
        if(searchCriteria.getOperator().equals(">")){ // dấu lớn hơn -> greater than
            predicate = criteriaBuilder.and(predicate, criteriaBuilder
                    .greaterThanOrEqualTo(root.get(searchCriteria.getKey()), searchCriteria.getValue().toString()));
        }else if(searchCriteria.getOperator().equals("<")){ // dấu nhỏ hơn -->  less than
            predicate = criteriaBuilder.and(predicate, criteriaBuilder
                    .lessThanOrEqualTo(root.get(searchCriteria.getKey()), searchCriteria.getValue().toString()));

        } else if (searchCriteria.getOperator().equals(":")){ // dấu : tương đương dấu = --> equals
            // ở đây xử lý 2 trường hợp : 1. nếu là string thì xử lý theo điều kiện: Like
            //                            2. còn lại thì xử lý theo điều kiện = (equals)
            if(root.get(searchCriteria.getKey()).getJavaType() == String.class){
                // nếu là String -> sử dụng toán tử Like
                predicate = criteriaBuilder.and(predicate, criteriaBuilder
                        .like(root.get(searchCriteria.getKey()), "%" + searchCriteria.getValue() + "%"));
            } else {
                // nếu không phải string thì xử lý equals
                predicate = criteriaBuilder.and(predicate, criteriaBuilder
                        .equal(root.get(searchCriteria.getKey()), searchCriteria.getValue().toString()));
            }
        }
    }
}
