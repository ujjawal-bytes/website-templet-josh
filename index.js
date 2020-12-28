var UIController = (function () {
    var DOMElements = (function (){
        return {
            CAROUSEL_BUTTONS: document.querySelector(".carousel-btns"),
            CAROUSEL_SLIDER: document.querySelector(".carousel-slider"),
            getSliderButton: function (idNumber) {
                return document.getElementById('btn' + idNumber);
            },
            getActiveSlider: function () {
                return document.querySelector(".carousel-btn.active");
            },
            PHOTO_GALLERY_CARDS_LIST_CONTAINER: document.querySelector('.photo-gallery .card-list-container'),
            VIDEO_GALLERY_CARDS_LIST_CONTAINER: document.querySelector('.video-gallery .card-list-container')
        }
    })();

    function shiftSlider(shiftTo) {
        var shiftBy = (shiftTo - 1) * (-33.33);
        DOMElements.CAROUSEL_SLIDER.style.transform = "translateX(" + shiftBy + "%)";
        DOMElements.getActiveSlider().classList.remove('active');
        DOMElements.getSliderButton(shiftTo).classList.add('active');
    }
    function getPhotoPopupContent(src, title) {
        return '<h1 class="heading popup-heading" >' + title + '</h1><img class="popup-image"  alt="' + title + '" src="' + src + '">';
    }
    function getVideoPopupContent(src, title) {
        console.log(src);
        return '<h1 class="heading popup-heading" >' + title + '</h1><video width="100%" controls ><source src="' + src + '" type="video/mp4">Your browser does not support HTML video.</video>';
    }
    function init() {

    }
    return {
        init: init,
        DOMElements: DOMElements,
        shiftSlider: shiftSlider,
        getPhotoPopupContent: getPhotoPopupContent,
        getVideoPopupContent: getVideoPopupContent
    };
})();

var CarouselController = (function () {
    var UIController = null;
    function setupListener() {
        UIController.DOMElements.CAROUSEL_BUTTONS.addEventListener('click', function (e) {
            if (e.target.closest(".active")) {
                return;
            }
            if (e.target.closest('#btn1')) {
                UIController.shiftSlider(1);
            } else if (e.target.closest('#btn2')) {
                UIController.shiftSlider(2);
            } else if (e.target.closest('#btn3')) {
                UIController.shiftSlider(3);
            }
        });
    }
    function setupInterval() {
        var i = 0;
        setInterval(function () {
            i = (i + 1) % 3;
            UIController.shiftSlider(i + 1);
        }, 3000);
    }
    function init(uiController) {
        UIController = uiController;
        setupListener();
        setupInterval();
    }
    return {
        init: init
    }
})();



var PopupController = (function () {
    var UIController = null, popup = null;
    function Popup(contents, activeIdx, onClose) {
        this.contents = contents;
        this.activeIdx = activeIdx;
        this.onClose = onClose;
        var html = '<div class="popup-container" ><div class="cross" >X</div><div class="decrement" >&lt;</div><div class="increment" >&gt;</div></div></div><div class="popup-overlay" ></div>';
        document.body.insertAdjacentHTML('beforeend', html);
        this.displayActive();
    }
    Popup.prototype.setActiveIdx = function (activeIdx) {
        this.activeIdx = activeIdx;
    }
    Popup.prototype.displayActive = function () {
        var prevContainer = document.querySelector('.popup-container').querySelector('.container');
        if (prevContainer) prevContainer.remove();
        var container = document.createElement("div");
        container.classList.add("container");
        container.innerHTML = this.contents[this.activeIdx];
        document.querySelector('.popup-container').insertAdjacentElement('beforeend', container);
    }
    Popup.prototype.increment = function () {
        var newActiveIdx = (this.activeIdx + this.contents.length + 1) % this.contents.length;
        this.setActiveIdx(newActiveIdx);
        this.displayActive();
    }
    Popup.prototype.decrement = function () {
        var newActiveIdx = (this.activeIdx + this.contents.length - 1) % this.contents.length;
        this.setActiveIdx(newActiveIdx);
        this.displayActive();
    }
    Popup.prototype.close = function () {
        document.querySelector('.popup-container').remove();
        document.querySelector('.popup-overlay').remove();
        this.onClose();
    }

    function _onCardClick(e, getPopupContent) {
        if (!e.target.closest('.card')) return;
        var cards = e.target.closest('.card-list-container').querySelectorAll('.card');
        var activeIdx = -1;
        var cardContents = [];
        var activeCardSrc = e.target.closest('.card').dataset.src;
        for (var i = 0 ; i < cards.length ; i++) {
            var cardSrc = cards[i].dataset.src;
            cardContents.push(getPopupContent(cards[i].dataset.src, cards[i].dataset.title));
            if (cardSrc === activeCardSrc) activeIdx = i;
        }
        popup = new Popup(cardContents, activeIdx, function () {
            popup = null;
        });
    }

    function setupListeners() {
        UIController.DOMElements.PHOTO_GALLERY_CARDS_LIST_CONTAINER.addEventListener('click', function (e) {
            _onCardClick(e, UIController.getPhotoPopupContent);
        });
        UIController.DOMElements.VIDEO_GALLERY_CARDS_LIST_CONTAINER.addEventListener('click', function (e) {
            _onCardClick(e, UIController.getVideoPopupContent);
        });
        document.addEventListener('click', function (e) {
            if (popup == null || !(e.target.closest('.popup-container') || e.target.closest('.popup-overlay'))) {
                return;
            }
            if (e.target.closest('.cross') || e.target.closest('.popup-overlay')) {
                popup.close();
            } else if(e.target.closest('.increment')) {
                popup.increment();
            } else if (e.target.closest('.decrement')) {
                popup.decrement();
            }

        })
    }
    function init(uiController) {
        UIController = uiController;
        setupListeners();
    }
    return {
        init: init
    }
})();


var MainController = (function (UIController, CarouselController, PopupController) {
    function init() {
        UIController.init();
        CarouselController.init(UIController);
        PopupController.init(UIController);
    }
    return {
        init: init
    }
})(UIController, CarouselController, PopupController);

MainController.init();