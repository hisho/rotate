import Hammer from "hammerjs";

type state = {
  index: number
  press: boolean
}

(() => {
  const rotate = document.getElementById('rotate');
  if(!rotate) return;

  const images = [...rotate?.querySelectorAll<HTMLElement>('figure')];
  images[0].style.display = 'block';

  const pressClassName = 'is-press';

  //ステータス
  const state:state = {
    index: 1,
    press: false
  }

  //マウスアップ、マウスダウンの処理
  function changePress() {
    state.press = !state.press;
    if(state.press) {
      rotate?.classList.add(pressClassName);
    } else {
      rotate?.classList.remove(pressClassName);
    }
  }
  window.addEventListener('mouseup', changePress,false);
  window.addEventListener('mousedown',changePress,false);

  const incrementCount = () => {
    if (state.index < images.length) {
      state.index = state.index + 1;
    } else {
      state.index = 1;
    }
  };

  const decrementCount = () => {
    if (state.index <= 1) {
      state.index = images.length;
    } else {
      state.index = state.index - 1;
    }
  };

  const handleSwipeEvent = (event:HammerInput) => {
    const isDecrement:boolean = Math.sign(event.deltaX) <= 0;
    if (isDecrement) {
      decrementCount();
    } else {
      incrementCount();
    }
  };

  const hammer = rotate ? new Hammer(rotate) : undefined;
  hammer?.on('pan',(event:HammerInput) => {
    handleSwipeEvent(event)
    const currentIndex:number = +String(state.index -1).padStart(2,'0');
    images.forEach(x => x.style.display = 'none');
    images[currentIndex].style.display = 'block';
  });

})()
