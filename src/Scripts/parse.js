// Function for getting posts
export async function getPosts(after, param) {
  let r = await graphQL(
    {
      id: param,
      first: 24,
      after: after,
    },
    false
  );
  let obj = r.data.user.edge_owner_to_timeline_media;
  let pst = [];
  let username = "";
  for (let i of obj.edges) {
    if (username == "") username = i.node.owner.username;
    let s = i.node.edge_media_to_caption.edges;
    let cap = "";
    if (s.length !== 0) cap = s[0].node.text;

    if (cap == "")
      cap = "https://www.instagram.com/p/" + i.node.shortcode + "/";

    pst.push({
      image: i.node.thumbnail_resources[0].src,
      caption: cap,
      quant: 0,
    });
  }

  return {
    next: obj.page_info.end_cursor,
    more: obj.page_info.has_next_page,
    posts: pst,
    user: username,
  };
}

async function graphQL(obj, cookieMode = true) {
  let p;
  if (cookieMode) {
    p = getCookie("p_hash");
    if (p == "") {
      p = await fetchHash();
      setCookie("p_hash", p, 2);
    }
  } else {
    p = await fetchHash();
  }

  let hs = "/graphql/query/?query_hash=" + p;
  let vrb = "&variables=" + JSON.stringify(obj);
  let r = await fetch("https://www.instagram.com" + hs + vrb);
  return await r.json();
}

// Patterns for searching in JS files
const p = `byUserId.get(n))||void 0===l?void 0:l.pagination},queryId:"`;

// Fetch hashes if previously did not get
async function fetchHash() {
  let p_hash = "";
  let r = await fetch("https://www.instagram.com/");
  let str = await r.text();
  let doc = new DOMParser().parseFromString(str, "text/html");
  let js = doc.body.querySelectorAll("script[async]");
  const getHash = (t, p) => {
    let i = t.indexOf(p);
    let k = i + p.length;
    return i !== -1 ? t.substring(k, k + 32) : "";
  };

  for (let i = 0; i < js.length - 1; i++) {
    if (js[i].src != "") {
      let r = await fetch(
        js[i].src.replace(/^.*\/\/[^\/]+/, "https://www.instagram.com")
      );
      let txt = await r.text();
      if (p_hash == "") p_hash = getHash(txt, p);
      if (p_hash !== "") break;
    }
  }
  return p_hash;
}

export function setCookie(cn, cv, ex) {
  let d = new Date();
  d.setTime(d.getTime() + ex * 24 * 60 * 60 * 1000);
  let exp = "expires=" + d.toUTCString();
  document.cookie = cn + "=" + cv + ";" + exp + ";path=/";
}

export function getCookie(cn) {
  let n = cn + "=";
  let dc = decodeURIComponent(document.cookie);
  for (let c of dc.split(";")) {
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(n) == 0) {
      return c.substring(n.length, c.length);
    }
  }
  return "";
}
