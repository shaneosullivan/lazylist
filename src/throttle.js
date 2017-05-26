export default function throttle(fn, wait) {
  let timer = null;
  let prev = 0;
  let run = () => {
    prev = Date.now();
    timer = null;
    fn();
  };
  return () => {
    const now = Date.now();
    let diff = wait - (now - prev);
    if (diff <= 0 || diff > wait) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      prev = now;
      fn();
    } else if (!timer) {
      timer = setTimeout(run, diff);
    }
  };
}
