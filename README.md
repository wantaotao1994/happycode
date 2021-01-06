# happycode 

Genarate  code  from  web table

从网页的表格中 生成Model代码

# 0.使用
  1. 克隆该项目到本地 
  2. 打开chrome浏览器的扩展程序（Extensions）设置 激活右上角的开发者 加载已解压的扩展程序
  3. 开始配置
  
# 1.基础配置

  插件配置页 第一个框输入以下 内容 点击保存 刷新页面
     
      {
      "templatesTypes": ["csharp", "js", "swift", "androidReq", "androidRes"],
      "columnType": ["comment", "type", "field"],
      "fieldMap": {
        "csharp": {
          "number": "int",
          "integer": "int"
        },
        "swift": {
          "number": "Int",
          "integer": "Int",
          "string": "String"
        },
        "java": {
          "number": "Int",
          "integer": "Int",
          "string": "String"
        }

      }
    }
    
2. 在新增的框中编写上述templatesTypes按顺序的art模板，参考我们项目组配置如下：
  
   0.（csharp）
    
    
        public class class1{
    
        {{each list as value}}
        /// <summary>
        /// {{value.comment}}
        /// </summary>
        public {{value.type}} {{value.field| fistCharToUpper }} {get;set;}  

        {{/each}}

        }
        
   1.（js）
   
       var  data = {
            {{each list as value}}
            {{value.field}}:{{value.type | jsDefaultValue }},  //{{value.comment}}
            {{/each}}

        }
   
   
   2.（swift）
   
       class class1: RespBaseModel {
        {{each list as value}}
             var  {{value.field}}: {{value.type | mapFieldType  "swift"}} = {{value.type | mapFieldType "swift"| swiftDefaultValue}} //{{value.comment}}
        {{/each}}
        override func mapping(map: Map) {
            {{each list as value}}
                {{value.field}} <-  map["{{value.field}}"]
            {{/each}}
            }
        }
   
   3.（androidReq）
   
        /**
         * 
         *
        {{each list as value}}
         * @param {{value.field}}  //{{value.comment}}
        {{/each}}
         * @return
         */
        @FormUrlEncoded
        @POST("")
        Observable<class1> funcName(
                  {{each list as value}}
                     @Field("{{value.field}}") {{value.type | mapFieldType  "java"}} {{value.field}},
                  {{/each}}
        );
   
   
   4.（androidRes）
   
   
       public class class1  {
        {{each list as value}}
            //{{value.comment}}
            private {{value.type | mapFieldType  "java"}} {{value.field}};
        {{/each}}

        {{each list as value}}
            public void set{{value.field | fistCharToUpper }}( {{value.type | mapFieldType  "java"}} {{value.field}}) {
                this.{{value.field}} = {{value.field}};
            }
        {{/each}}

        {{each list as value}}
            public void get{{value.field| fistCharToUpper }}() {
                return {{value.field}};
            }
        {{/each}}
        }
   
   
   
   
# licence 
  MIT
        
