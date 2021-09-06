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
  const peripheralsItemList = document.querySelectorAll('.peripherals-item'),
    peripheralsList = document.querySelector('.peripherals-list'),
    btnSendMessage = document.getElementById('sendMessage'),
    modalPrinters = document.querySelector('#modalPrinters'),
    wrapperPrinterList = modalPrinters.querySelector('.wrapper1'),
    areaPrinters = document.querySelectorAll('[data-peripheralid="printer"]');


  let peripheralsArray = [];

  let printersArray;

  const getData = async () => {
    //const data = await fetch('js/db-10-items.json');
    const data = await fetch('printers_db.json');

    if(data.ok) {
        return data.json();
    } else {
        throw new Error(`Данные не были получены, ошибка ${data.status} ${data.statusText}`);
    }
  };

  const getGoods = () => {
    getData()
    .then(data => {
        //printersArray = data.printerList;   
        printersArray = data.ppp;   
    })
    .catch(err=>{
        console.log(err);
    });
  };

  const fillPrinterCard = (data) => {

    //destructuring assignment
    //let {cover, model: title, serial: serialNum, ipAddress, status, toner, ...rest} = data;
    let {model_printer__image: cover, model_printer__model: title, serial_number_printer: serialNum,
      ip_address_printer: ipAddress,  black_cartridge, cyan_cartridge, magenta_cartridge,
      yellow_cartridge, drum_cartridge, ...rest} = data;
    /*  
      title = data.model,
      serialNum = data.serial,
      ipAddress = data.ipAddress,
      status = data.status,//если статус не ок, то покажем восклицательный знак
      toner = data.toner;//инфо будет в виде блоков, залитых цветом и внутри число
    */

    let card = `
      <div class="printer-card">
        <img src=${cover} alt="img: printer image">
        <h6 class="printer-title">${title}</h6>                           
        <div class="info">
            <!--<h6 class="info-title"></h6>-->
            <h6 class="info-label">модель:</h6>
            <span class="info-text">${title}</span>
            <h6 class="info-label">IP-адрес:</h6>
            <span class="info-text">${ipAddress}</span>
            <h6 class="info-label">серийный номер:</h6>
            <span class="info-text">${serialNum}</span>
            <h6 class="info-label">Картриджи:</h6>
            <span class="info-text">тут инфо о тонере</span>
            <button class="button button-primary add-to-cart">Добавить в заявку</button>
        </div>
      </div>
      `;
    return card;
  };

  const renderPrinterList = (data) => {
    wrapperPrinterList.textContent = '';
    //Обработать data.length===0
    if (data.length === 0) {
      let element = `Тут данных нет  😢 `;
      wrapperPrinterList.insertAdjacentHTML('beforeend', element);
    } else if (data.length < 4) {
      data.forEach(
        item => {
          let element = fillPrinterCard(item);
          wrapperPrinterList.insertAdjacentHTML('beforeend', element);
        }
      );      
    } else {
      //Тут срендерить в карусель
      const initSwiperHTML = `
      <!-- Slider main container -->
      <div class="swiper swiperPrinter">
        <!-- Additional required wrapper -->
        <div class="swiper-wrapper">
          <!-- Slides -->
                    
        </div>
        <!-- If we need pagination -->
        <div class="swiper-pagination"></div>

        <!-- If we need navigation buttons -->
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
      </div>
      `;
      wrapperPrinterList.insertAdjacentHTML('beforeend', initSwiperHTML);
      let swiperWrapper = wrapperPrinterList.querySelector('.swiper-wrapper');

      data.forEach(
        item => {
          let element = fillPrinterCard(item);
          swiperWrapper.insertAdjacentHTML('beforeend',`<div class="swiper-slide">${element}</div>`);
          
        }
      );
      /*code below is incredible. but it works
        swiper may not load immediately
      */
      setTimeout(()=>{
        let swiper = new Swiper(".swiperPrinter", {
          navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          },
          pagination: {
            el: ".swiper-pagination",
            clickable: true,
            type: 'bullets',
            renderBullet: function (index, className) {
              return '<span class="' + className + '">' + (index + 1) + "</span>";
            },
          },
          slidesPerView: 3,
          spaceBetween: 40,
      })
      }, 200);
    }

    let btnAddPrinterToCart = document.querySelectorAll('.add-to-cart');
    btnAddPrinterToCart.forEach(item => {
      item.addEventListener('click', e => {
        const printerName = e.target.parentNode.parentNode.querySelector('.printer-title').textContent;
        addItemToCart(printerName);
        modalPrinters.querySelector('.btn-close').click();
      });
    });
  };

  const init = () => {
    btnSendMessage.disabled = true;
    getGoods();
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

  const addItemToCart = (item) => {
    if (peripheralsArray.length < 5) {
      peripheralsArray.push(item);
      renderPeripheralsList();
      btnSendMessage.disabled = isArrayEmpty(peripheralsArray);
      return true;
    } else {
      alert("Вы уже выбрали пять элементов!");
      return false;
    }
  };

  peripheralsItemList.forEach(el => {
      el.addEventListener('click', (e)=>{
          let peripheralName = objPeripheral[e.target.dataset.peripheralid] || 'устройство не опознано';
          if(e.target.dataset.peripheralid !== 'printer'){
            addItemToCart(peripheralName);
          } else {
            renderPrinterList(printersArray);
          }
      });
  });

  btnSendMessage.addEventListener('click', () => {
    let data = peripheralsArray.join('; ');
    alert(`data: ${data}`);
  });

  areaPrinters.forEach(item => {
    item.setAttribute('data-bs-toggle','modal');
    item.setAttribute('data-bs-target','#modalPrinters');
  });

  

  

  init();
  
});