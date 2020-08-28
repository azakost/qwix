export function EncodeNums(L) {
  let r = [];
  for (let i = 0; i < L.length; i++) {
    r.push(baseconvert(L[i], base10, encodable));
  }
  return r.join(separate_with);
}

export function DecodeNums(s) {
  let r = [];
  s = s.split(separate_with);
  for (let i = 0; i < s.length; i++) {
    r.push(parseInt(baseconvert(s[i], encodable, base10)));
  }
  return r;
}

function get_map(s) {
  let d = {};
  for (let i = 0; i < s.length; i++) {
    d[s.charAt(i)] = i;
  }
  d.length = s.length;
  d._s = s;
  return d;
}

let separate_with = "~";
let encodable = get_map("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_.");
let base10 = get_map("0123456789");

function baseconvert(number, fromdigits, todigits) {
  number = String(number);
  let neg;
  if (number.charAt(0) == "-") {
    number = number.slice(1, number.length);
    neg = 1;
  } else {
    neg = 0;
  }
  let x = 0;
  for (let i = 0; i < number.length; i++) {
    let digit = number.charAt(i);
    x = x * fromdigits.length + fromdigits[digit];
  }
  let res = "";
  let remainder;
  while (x > 0) {
    remainder = x % todigits.length;
    res = todigits._s.charAt(remainder) + res;
    x = parseInt(x / todigits.length);
  }
  if (neg) res = "-" + res;
  return res;
}
