// rules: array containing each rule in an input
// inputs :array containing the input chua nhieu rules
// validatorRules: object chua test functions
// formRules: array voi index la input va property la cac function co trong tung input
function Validator(formSelector){
    var formRules = {};
    function getParent(element,selector){
        while(element.parentElement){
            if(element.parentElement.matches(selector))
                return element.parentElement
            else
                element = element.parentElement
        }
    }
    var formElement = document.querySelector(formSelector);
    var validatorRules = {
        required: function(value){
            return value ? undefined:"Vui long nhap truong nay"
        },
        email: function(value){
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return regex.test(value) ? undefined:"Vui lòng nhập email"
        },
        min:function(min){
           return function(value){
                return value.length >= min ? undefined: `Vui long nhap toi thieu ${min} ky tu`
            }
        }
        
    }
    if(formElement){
        var inputs = formElement.querySelectorAll('[name][rules]')
       
        for(var input of inputs){
            var rules = input.getAttribute('rules').split('|')
            for(var rule of rules){
                // Xu ly khi gap min:6
                var ruleInfor;
                var isHasValue = rule.includes(':')
                if(isHasValue){
                    ruleInfor = rule.split(':')
                    rule = ruleInfor[0]
                }
                var ruleFunc = validatorRules[rule]
                if(isHasValue){
                    ruleFunc = validatorRules[rule](ruleInfor[1])
                }
                if(Array.isArray(formRules[input.name])){
                    formRules[input.name].push(ruleFunc)
                }else{
                   formRules[input.name]  = [ruleFunc]
                }
                 
            }
            
           input.onblur = handleValidate
           input.oninput = handleClearError
        }

        // Xu li khi bur
        function handleValidate(event){
            // rules bay gio la mang chua cac test function
            // event.target : phan tu bi chon trung\
            // event.target.name: lay ra name cua ptu dc chon 
            var rules = formRules[event.target.name]
            var errorMessage ; 
           rules.some(function(rule){
                errorMessage = rule(event.target.value)
                return errorMessage
            })

            if(errorMessage){
              var formGroup =  getParent(event.target,".form-group")
              if(formGroup){
                formGroup.classList.add("invalid")
                var formMessage = formGroup.querySelector(".form-message")
                if(formMessage){
                    formMessage.innerText = errorMessage
                }
              }
            }

            return !errorMessage
        }

        // Xu li khi dang nhap 
        function handleClearError(event){
            var formGroup =  getParent(event.target,".form-group")
            if(formGroup.classList.contains('invalid')){
                formGroup.classList.remove('invalid')
                var formMessage = formGroup.querySelector(".form-message")
                if(formMessage){
                    formMessage.innerText = ""
                }
            }
            

     }
    }
    formElement.onsubmit = function(event){
        event.prenventDefault();
        var inputs = formElement.querySelectorAll('[name][rules]')
        var isValid = true
        for( var input of inputs){
            if(!handleValidate({target:input}))
            isValid = false
        }
        // Khi ko co loi submit form
        if(isValid)
            formElement.submit()

    }
}