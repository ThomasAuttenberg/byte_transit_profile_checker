# PROFILE CHECKER

Сервис, предоставляющий удобный обзор профилей пользователя по введенному uuid. <br>
## nav: 
- [Изменение адреса API](#apichanging)
- [Изменение запроса: тело запроса, метод, эндпоинт](#queryChanging)
- [Изменение вывода под возможный ответ сервера](#templatechanging)
- [Деплой](#deploy)

## Описание сервиса:</br>
Сервис разработан с целью предоставлять профили пользователей по их уникальному идентификатору.
Первоначальное окно предоставляет окно запроса:</br></br>
![image](https://github.com/user-attachments/assets/32a99b28-51c0-4b82-ad77-7b7e1bc67751)
</br></br>
Для того, чтобы запрос был отправлен, нужно ввести uuid и нажать клавишу ввода (Enter). Сразу после этого произойдет загрузка найденный профилей:</br></br>
![image](https://github.com/user-attachments/assets/bb25309c-4ba7-47bf-b067-20669abcab96)
</br></br>
Кликом мыши по иконке в карточке профиля можно перейти к обзору соответствующего профиля:</br></br>
![image](https://github.com/user-attachments/assets/ca617de1-24c9-494e-9c5d-232915f22e11)</br></br>

Ссылку на профиль пользователя и каждое из установленных полей можно скопировать нажатием мыши на соответствующую кнопку</br></br>
![image](https://github.com/user-attachments/assets/21d748dd-5c78-476e-ae0d-877a8a1a446a)
</br></br>
При вводе идентификатора, не связанного с профилем пользователя, будет выведена соответствующая ошибка:</br></br>
![image](https://github.com/user-attachments/assets/9f95cd16-6268-47f6-bdba-61e90cf53a70)</br></br>
Приложение будет оповещать о проблемах с соединением и ошибках обмена данными (любые коды ответа кроме 2xx) :</br></br>
![image](https://github.com/user-attachments/assets/bb008d9c-9474-434b-ac81-2bf69ac6a282)</br></br>
![image](https://github.com/user-attachments/assets/cb6bb781-0a65-46fb-a9ea-862428ac6be0)
</br></br>



## <a name="queryChanging">Изменение запроса</a>
Компонент src/Components/MainComponent.vue содержит функцию fetchData, определяющую формат запроса. </br> 
Для изменения заголовков или введения интерцепторов для axios, обратите внимание на файл src/hooks/APIFetch </br>
</br></br>
## <a name="templatechanging">Изменение шаблона вывода</a>
Используя файл src/hooks/DATA_TEMPLATE.ts, отредактируйте объект templates. </br>
При необходимости, добавьте адаптеры для поступающих с сервера данных. </br>
</br></br>
## <a name="apichanging">Изменение API</a>
Для изменения ссылка на сервер API отредактируйте переменную в файле .env в корневом каталоге проекта.</br></br>
## <a name="deploy">ДЕПЛОЙ:</a>
В корневом каталоге проекта выполнить следующие команды:
```sh
npm install
```

### Компиляция и hot-reload для разработки:

```sh
npm run dev
```

### Компиляция под Prod:

```sh
npm run build
```
