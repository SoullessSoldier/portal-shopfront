document.addEventListener('DOMContentLoaded', () => {
  const objPeripheral = {
      'keyboard':'Клавиатура',
      'webcam':'Веб-камера',
      'display':'Дисплей',
      'sound':'Наушники/колонки',
      'printer':'Принтер/Сканер/МФУ',
      'other':'Прочее оборудование',
      'microphone':'Микрофон для биометрии',
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
    wrapperPrinterList = document.getElementById('wrapperPrinterList'),
    areaPrinters = document.querySelectorAll('[data-peripheralid="printer"]'),
    notePeripherals = document.querySelector('#notePeripherals'),
    labelTextarea = document.querySelector('.label-textarea'),
    itemsPanel = document.querySelector('.items-panel');
    
  let isOtherAdded = false;

  let peripheralsArray = [];
  let printersArray = [];

  let inputOther;

  const limitNum = 50;
  const validatePattern = /[^a-zA-Zа-яёА-ЯЁ\d ]/g; 

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
  const renderOther = () => {
    if (!isOtherAdded) {
      const result = `Прочее оборудование`;
      const elementOther = document.createElement('input');
      elementOther.setAttribute('id', 'input-other');
      elementOther.setAttribute('type', 'text');
      elementOther.setAttribute('placeholder', 'Укажите своё оборудование!');
      elementOther.classList.add('warn');
      isOtherAdded = true;
      addItemToCart(result);
      itemsPanel.insertBefore(elementOther,labelTextarea);
      inputOther = document.querySelector('#input-other');
      inputOther.value = '';
      inputOther.focus();
      
      btnSendMessage.disabled = true;

      inputOther.addEventListener('input', (e) => {
        validateInput(e);
        if (e.target.value.length === 0) {
          e.target.classList.add('warn');
          btnSendMessage.disabled = true;
        } else {
          e.target.classList.remove('warn');
          btnSendMessage.disabled = false;
        }
      });
    }
  }; 

  const renderOrderTonerBlock = (targetElement, printerName) => {
    let parent = targetElement.parentNode.parentNode.parentNode;
    let rect = parent.getBoundingClientRect(),
      left = rect.left + rect.width / 4,
      top = rect.top + rect.height / 4;
    const modalToner = document.querySelector('.modal-toner'),
      btnOrderMain = document.querySelector('.order-main'),
      btnOrderReserve = document.querySelector('.order-reserve');
    
    btnOrderMain.dataset.printerName = printerName;
    btnOrderReserve.dataset.printerName = printerName;
    
    modalToner.style.top = top + 'px';
    modalToner.style.left = left + 'px';
    modalToner.style.display = 'block';
  };

  const doOrderToner = (event) => {
    if(event.target.tagName === "BUTTON") {
      let typeOrder = event.target.classList.contains('order-main') ? 'основного' :
         event.target.classList.contains('order-reserve') ? 'запасного' : '';
      let printerName = event.target.dataset.printerName;
      let result = `Заказ ${typeOrder} картриджа для ${printerName}`;
      addItemToCart(result);
      document.querySelector('.modal-toner').style.display = 'none';
      orderGroup.removeEventListener('click', doOrderToner);
    }
  };

  const renderOrderTonerStuff = () => {
    const btnOrderTonerItems = document.querySelectorAll('.order-toner'), 
        closeOrderTonerItems = document.querySelectorAll('.close-order-toner'),          
        orderGroup = document.querySelector('.order-group');          
      btnOrderTonerItems.forEach(item => {
        item.addEventListener('click', (e) => {
          e.stopPropagation();
          let printerName = e.target.closest('.printer-card').querySelector('.printer-title').textContent;              
          renderOrderTonerBlock(e.target, printerName);
        });
      });
      
      closeOrderTonerItems.forEach(item => {
        item.addEventListener('click', () => {
          document.querySelector('.modal-toner').style.display = 'none';
        });
      });

      orderGroup.addEventListener('click', doOrderToner);
  };


  const fillPrinterCard = (data) => {

    let {model_printer__image: cover, model_printer__model: title, serial_number_printer: serialNum,
      ip_address_printer: ipAddress,  black_cartridge, cyan_cartridge, magenta_cartridge,
      yellow_cartridge, drum_cartridge, ...rest} = data;
    
    let tonerBlackObj = {value: black_cartridge, color: 'black'},
        tonerCyanObj = {value: cyan_cartridge, color: 'cyan'},
        tonerMagentaObj = {value: magenta_cartridge, color: 'magenta'},
        tonerYellowObj = {value: yellow_cartridge, color: 'yellow'},
        tonerDrumObj = {value: drum_cartridge, color: 'drum'};

    
    let tonerObjArray = [tonerBlackObj, tonerCyanObj, tonerMagentaObj,
      tonerYellowObj, tonerDrumObj];
    
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
            ${renderTonerInfo(tonerObjArray)}     
            <div class="info-button-group">
            <button class="button button-secondary order-toner">Заказать картриджи</button>
            <button class="button button-secondary add-to-cart order-service">Заказать обслуживание</button>
            </div>
            
        </div>
      </div>
      `;
    
    function renderTonerInfo (tonerObjArray) {
      let element = '';
      if (tonerObjArray.some(element => {
        return element.value !== null ? true : false;
        }
      )) {
        element += '<div class="toner-info">';
        for (let item of tonerObjArray){
          if (item.value !== null) {
            element += `
            <div class="toner-item ${item.color}">
             <span class="toner-text">${item.value}%</span>
            </div>
            `;
          }
        }
        element += '</div>';  
      } else {
        element = '<span class="info-text toner-dummy">нет информации о тонере</span>';
      }
      return element;
    }
    return card;
  };

  const renderPrinterList = (data) => {
    wrapperPrinterList.textContent = '';
    
    if (!data || data.length === 0) {
      let element = `Тут данных нет  😢 `;
      wrapperPrinterList.insertAdjacentHTML('beforeend', element);
    } else if (data.length < 4) {
      wrapperPrinterList.classList.add('wrapper');
      wrapperPrinterList.classList.remove('wrapper1');
      data.forEach(
        item => {
          let element = fillPrinterCard(item);
          wrapperPrinterList.insertAdjacentHTML('beforeend', element);
        }
      );
      renderOrderTonerStuff();      
    } else {
      wrapperPrinterList.classList.remove('wrapper');
      wrapperPrinterList.classList.add('wrapper1');
      
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
      
      renderOrderTonerStuff();

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
      });
      }, 200);
    }

    let btnAddPrinterToCart = document.querySelectorAll('.add-to-cart');
    btnAddPrinterToCart.forEach(item => {
      item.addEventListener('click', e => {
        const printerName = e.target.parentNode.parentNode.parentNode.querySelector('.printer-title').textContent;
        let prefixOrder = e.target.classList.contains('order-toner') ? 
          'Заказ картриджа для ' : e.target.classList.contains('order-service') ? 
          'Заказ обслуживания для ' : '';
        addItemToCart(prefixOrder + printerName);
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
  const removeOther = () => {
    inputOther = document.querySelector('#input-other');
    inputOther.remove();
    isOtherAdded = false;
  };

  const removePeripheralItem = (index) => {
    if (peripheralsArray[index] !== 'Прочее оборудование') {
      peripheralsArray.splice(index,1);
      renderPeripheralsList();
      //btnSendMessage.disabled = isArrayEmpty(peripheralsArray);
      btnSendMessage.disabled = isOtherAdded ? !(isArrayEmpty(peripheralsArray) && inputOther.value) : isArrayEmpty(peripheralsArray);
    } else {
      peripheralsArray.splice(index,1);      
      removeOther();
      renderPeripheralsList();
      //btnSendMessage.disabled = isArrayEmpty(peripheralsArray);
      btnSendMessage.disabled = isOtherAdded ? !(isArrayEmpty(peripheralsArray) && inputOther.value) : isArrayEmpty(peripheralsArray);
    }
  };

  const addItemToCart = (item) => {
    if (peripheralsArray.length < 5) {
      peripheralsArray.push(item);
      renderPeripheralsList();
      btnSendMessage.disabled = isOtherAdded ? !(isArrayEmpty(peripheralsArray) && inputOther.value) : isArrayEmpty(peripheralsArray);
      return true;
    } else {
      alert("Вы уже выбрали пять элементов!");
      return false;
    }
  };

  const validateInput = (e) => {
    e.target.value = e.target.value.replace(validatePattern,'');
    if (e.target.value.length > limitNum) {
      e.target.value = e.target.value.substring(0, limitNum);
    }
  };

  peripheralsItemList.forEach(el => {
      el.addEventListener('click', (e)=>{
          let peripheralName = objPeripheral[e.target.dataset.peripheralid] || 'устройство не опознано';
          if(!['printer','other'].includes(e.target.dataset.peripheralid)){
            addItemToCart(peripheralName);
          } else if (e.target.dataset.peripheralid === 'printer'){
            renderPrinterList(printersArray);
          } else if (e.target.dataset.peripheralid === 'other') {
            renderOther();
          }
      });
  });

  btnSendMessage.addEventListener('click', () => {
    if (isOtherAdded) {
      for(let i = 0; i < peripheralsArray.length; i++){
        if (peripheralsArray[i] === 'Прочее оборудование') {
          peripheralsArray[i] += `: ${inputOther.value.trim()}`;
          break;
        }
      }
    }
    let data = peripheralsArray.join('; ');
    data += notePeripherals.value ? '; примечание: ' + notePeripherals.value : '';
    alert(`data: ${data}`);
    notePeripherals.value= '';
    peripheralsArray = [];
    if (isOtherAdded) removeOther();
    btnSendMessage.disabled = isArrayEmpty(peripheralsArray);
    renderPeripheralsList();
  });

  areaPrinters.forEach(item => {
    item.setAttribute('data-bs-toggle','modal');
    item.setAttribute('data-bs-target','#modalPrinters');
  });
  const modalToner = document.querySelector('.modal-toner');
  document.addEventListener('click', (e) => {
    if (!modalToner.contains(e.target)) {
        modalToner.style.display = 'none';
    }
    
  });

   
  notePeripherals.addEventListener('input', (e) => {
    validateInput(e);
  });
  

  init();
  
});