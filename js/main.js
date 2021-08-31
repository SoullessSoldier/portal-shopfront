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

  const btnSendMessage = document.getElementById('sendMessage');
  

  let peripheralsArray = [];

  const init = () => {
    btnSendMessage.disabled = true;
  };

  const isArrayEmpty = (array) => {
    return array.length === 0 ? true: false;
  };

  const renderPeripheralsList = () => {
    peripheralsList.textContent='';
    peripheralsArray.forEach(el => {
      let element = `
      <li class="peripherals-list_item" >
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
    peripheralsArray.splice(index,1);
    renderPeripheralsList();
    btnSendMessage.disabled = isArrayEmpty(peripheralsArray);
  };

  peripheralsItemList.forEach(el => {
      el.addEventListener('click', (e)=>{
          let peripheralName = objPeripheral[e.target.dataset.peripheralid] || 'устройство не опознано';
          if (peripheralsArray.length < 5) {
            peripheralsArray.push(peripheralName);
            renderPeripheralsList();
            btnSendMessage.disabled = isArrayEmpty(peripheralsArray);
          } else {
            alert("Вы уже выбрали пять элементов!");
            
          }
      });
  });

  btnSendMessage.addEventListener('click', () => {
    let data = peripheralsArray.join('; ');
    alert(`data: ${data}`);
  });

  

  if (document.querySelector('.swiper')){
    const swiper = new Swiper('.swiper', {
      // Optional parameters
      direction: 'horizontal',
      loop: true,
      allowTouchMove: false,
    
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
  }

  init();    

});