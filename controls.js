document.querySelector('.new-story').addEventListener('click', () => {
  const content = document.querySelector('.content');

  document.querySelector('.glasses img').src = glassesImage;
  document.querySelector('.mesh img').src = meshImage;
  document.querySelector('.sick img').src = maskImage;
  document.querySelector('.new-story').style.display = 'none';

  if (content) {
    content.style.width = `${width}px`;
    content.style.height = `${height}px`;
    content.style.borderRadius = '0px';
  }
})

document.querySelector('.filters').addEventListener('click', (e) => {
  const t = e.target;

  const className = t instanceof Image ? t.parentElement.className : t.className;

  window.activeFilter = className;
})


document.addEventListener('click', (event) => {
  var eventDoc, doc, body;

  event = event || window.event; // IE-ism

  // If pageX/Y aren't available and clientX/Y are,
  // calculate pageX/Y - logic taken from jQuery.
  // (This is to support old IE)
  if (event.pageX == null && event.clientX != null) {
    eventDoc = (event.target && event.target.ownerDocument) || document;
    doc = eventDoc.documentElement;
    body = eventDoc.body;

    event.pageX = event.clientX +
      (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
      (doc && doc.clientLeft || body && body.clientLeft || 0);
    event.pageY = event.clientY +
      (doc && doc.scrollTop || body && body.scrollTop || 0) -
      (doc && doc.clientTop || body && body.clientTop || 0);
  }

  console.log(event.pageX, event.pageY);
})
