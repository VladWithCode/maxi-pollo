export function handleFetchErrors(res) {
  console.log(res.err);
  (res.message || res.msg) && alert(res.message || res.msg);
}

export function generateStateValueHTML(item) {
  return `<div class="state__value${
    item.state ? ' state__value--a' : ' state__value--u'
  }" data-availability="${item.state ? 'available' : 'unavailable'}">${
    item.name
  }</div>`;
}
