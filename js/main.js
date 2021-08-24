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
    };
    const peripheralsItemList = document.querySelectorAll('.peripherals-item');

    peripheralsItemList.forEach(el => {
        el.addEventListener('click', (e)=>{
            let peripheralName = objPeripheral[e.target.dataset.peripheralid] || 'устройство не опознано';
            alert("Вы выбрали: " + peripheralName);
        });
    });
});