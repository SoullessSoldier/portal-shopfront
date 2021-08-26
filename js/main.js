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
        'flex':'Флекс-ноутбук',
    };
    const peripheralsItemList = document.querySelectorAll('.peripherals-item');
    const peripheralsList = document.querySelector('.peripherals-list');
    

    let peripheralsArray = [];

    

    const renderPeripheralsList = () => {
      peripheralsList.textContent='';
      peripheralsArray.forEach(el => {
        let element = `
        <li class="peripherals-list_item" data-peripheralname="${el}">
            <span class="peripherals-list_item-text">${el}</span>
            <button class="button-remove-item">
                <i class="fa fa-times" aria-hidden="true"></i>
            </button>
        </li>
        <!-- /.peripherals-list_item -->
        `;
        peripheralsList.insertAdjacentHTML('beforeend', element);
      });


      const btnRemoveItem = document.querySelectorAll('.button-remove-item');
      btnRemoveItem.forEach((item, index) => {
        item.addEventListener('click', () => {
          removePeripheralItem(index);
        });
      });
    };

    const removePeripheralItem = (index) => {
      /*let target = e.target.parentNode.tagName === 'LI' ? e.target.parentNode : e.target.parentNode.parentNode;
      peripheralsArray = peripheralsArray.filter(el!=)
      console.log(target.dataset.peripheralname);
      */
      //console.log(index);
      peripheralsArray.splice(index,1);
      renderPeripheralsList();
    };

    peripheralsItemList.forEach(el => {
        el.addEventListener('click', (e)=>{
            let peripheralName = objPeripheral[e.target.dataset.peripheralid] || 'устройство не опознано';
            if (peripheralsArray.length < 5) {
              peripheralsArray.push(peripheralName);
              renderPeripheralsList();
            } else {
              alert("Вы выбрали более пяти элементов");
            }
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