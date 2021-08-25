'use strict';
document.addEventListener('DOMContentLoaded', () => {
    const objPeripheral = {
        'keyboard':'Клавиатура',
        'webcam':'Веб-камера',
        'display':'Дисплей',
        'sound':'Наушники/колонки',
        'printer':'Принтер/Сканер/МФУ',
        'other':'Другое устройство',
        'microphone':'Микрофон',
        'mouse':'Мышь',
        'ups':'Источник бесперебойного питания',
        'pc':'Системный блок',
        'phone':'Телефон',
        'tcd':'Тонкий клиент',
    };
    const peripheralsItemList = document.querySelectorAll('.peripherals-item');

    peripheralsItemList.forEach(el => {
        el.addEventListener('click', (e)=>{
            let peripheralName = objPeripheral[e.target.dataset.peripheralid] || 'устройство не опознано';
            alert("Вы выбрали: " + peripheralName);
        });
    });

    const swiper = new Swiper('.swiper', {
        // Optional parameters
        direction: 'horizontal',
        loop: true,
      
        // If we need pagination
        pagination: {
          el: '.swiper-pagination',
        },
      
        // Navigation arrows
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      
        // And if we need scrollbar
        scrollbar: {
          el: '.swiper-scrollbar',
        },
      });
});