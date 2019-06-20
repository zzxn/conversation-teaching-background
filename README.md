# 对话式教学系统教师端Web应用前端

by: zzxn

## 简介

本项目是一个对话式教学的微信小程序的教师后台管理界面，使用Angular实现。

后端Github地址：https://github.com/zzxn/adweb-user-rest

总项目Github地址：https://github.com/zzxn/project-mini-edu-606

## 项目文件和目录说明

本项目是由Angular CLI生成的，目录结构与惯例一致，所以这里只说明```src\app```目录，这里存放了几乎所有主要代码。

主页在```src/index.html```文件下，这里定义了一个路由出口，用来显示下面所描述的诸多组件。


```
│  app-routing.module.ts                    路由模块，配置路由信息
│  app.component.css                        根组件的CSS样式表
│  app.component.html                       根组件的模板
│  app.component.ts                         根组件的类
│  app.module.ts                            根模块
│  config.ts                                配置类，静态地配置了后端API的URL和阿里云OSS的地址
│  fix-progress.directive.ts                修复NG ZORRO的进度条组件无法改变颜色bug的指令
│  login-guard.ts                           路由守卫，根据用户登录与否进行路由
│
├─chapter-editor                            章节编辑器组件，用它来显示、编辑章节信息和其中的消息和问题
│      chapter-editor.component.css
│      chapter-editor.component.html
│      chapter-editor.component.ts
│
├─course                                    课程信息组件，用来显示和编辑课程的图片、名字、描述等信息
│      course.component.css
│      course.component.html
│      course.component.ts
│
├─course-chapter                            课程章节组件，用来显示课程中的所有章节，含有复数个章节编辑器子组件
│      course-chapter.component.css
│      course-chapter.component.html
│      course-chapter.component.ts
│
├─course-management                         课程管理组件，用来显示所有课程、创建课程
│      course-management.component.css
│      course-management.component.html
│      course-management.component.ts
│
├─course-student                            课程学生组件，用来显示选课学生的统计信息
│      course-student.component.css
│      course-student.component.html
│      course-student.component.ts
│
├─entity                                    一些实体类，主要用来接收REST请求传回的数据
│      chapter.ts
│      content.ts
│      course.ts
│      option.ts
│      student-statistics.ts
│      student.ts
│      user.ts
│
├─login                                     登录组件，用来进行用户登录
│      login.component.css
│      login.component.html
│      login.component.ts
│
├─mine                                      “我的”组件，用来显示和编辑个人信息
│      mine.component.css
│      mine.component.html
│      mine.component.ts
│
├─mine-modify                               修改密码的组件
│      mine-modify.component.css
│      mine-modify.component.html
│      mine-modify.component.ts
│
├─page-not-found                            没有可以匹配的路由时，会路由到这个组件
│      page-not-found.component.css
│      page-not-found.component.html
│      page-not-found.component.ts
│
├─register                                  注册组件，用来进行用户注册
│      register.component.css
│      register.component.html
│      register.component.ts
│
└─service                                   服务类
        auth.service.ts                     认证服务，用来进行登录、注册等
        course.service.ts                   课程服务，所有除了认证和用户服务外的服务都在这里
        user.service.ts                     用户服务，用来获取、更新用户信息
```

## 功能实现

### 信息显示和样式

* 利用了NG ZORRO组件库来显示卡片、头像、列表、进度条等信息，具体地：
  * 使用```<nz-list>```来显示课程列表、章节列表、学生列表
  * 使用```<nz-card>```来在一个卡片中展示课程信息
  * 使用```<nz-input>```来显示、验证输入和进行输入提示
  * 使用```<nz-upload>```来验证并上传图片
  * 使用```NzModalService```来弹出模态框
  * 使用```NzNoticationService```来弹出提示框
* 使用CSS3来定义了一些自定义的样式和响应式的效果
* 课程卡片标题栏的渐变色来自 https://webgradients.com/

### 路由

* 定义```app-routing```模块，在这里配置路由信息，把组件注册到相应的路由地址
* 主页在```src/index.html```文件下，这里定义了一个路由出口，用来显示上面所描述的诸多组件
* 没有匹配的URI，路由到自定义的404组件

### 从服务端请求数据及错误处理

* 定义一些service来封装HTTP请求，在其中导入```HttpClient```进行请求，返回Observable
* 组件调用service的方法，通过订阅Observable来异步获取数据
* 利用```pipe()```来处理超时
* 通过定义的实体类接收返回的JSON信息
* 通过获取约定好的错误码来获取错误信息，并提示用户

### Token的保存和验证

* 登录/注册后，在LocalStorage保存Token
* 每次请求时，在头部携带Token
* 服务端验证失败，会返回约定好的错误信息，客户端提示用户

### 表单验证

使用了下面两种方式进行验证

* 模板驱动表单验证：```input```元素双向绑定数据域，在提交按钮被点击后检查对应数据域
* 响应式表单验证：NG ZORRO在```nz-form-control```上提供了```nzValidateStatus``` ```nzHasFeedback```等属性，自己定义校验的时机和内容

## 部署说明

下面描述如何在Tomcat Docker容器中部署本应用：

1. 在项目根目录下使用指令```ng build --prod```
2. 找到生成的```dist```目录下的`conversational-teaching-backgroud`目录，把它上传到云服务器
3. 拉取Tomcat镜像，启动一个Tomcat容器，把服务器的80端口映射到容器的8080端口
4. 把`conversational-teaching-backgroud`复制到容器的```/user/local/tomcat/webapps```目录下
5. 删除```/user/local/tomcat/webapps/ROOT```，把`conversational-teaching-backgroud`使用```mv```命令重命名为```ROOT```
6. 在```/user/local/tomcat/conf/web.xml```中加入以下配置，以解决刷新404问题：

```xml
<error-page>
  <error-code>404</error-code>
  <location>/</location>
</error-page>
```

7. 退出容器，进行访问测试



注：
angular项目使用前端路由，也就是说，URL的变化会被前端截获，不会发送到Tomcat，而是在前端进行路由。
但是如果在前端路由后刷新，这个请求会被发送到Tomcat——相应的资源当然是不存在的，就会出现404问题。
我利用了一个Trick来解决这个问题：把Tomcat的404页面指定为 / ，这样的话，相应的路径就会发送到Angualr应用的index.html来处理，这时Angular的路由机制就可以起作用了。



