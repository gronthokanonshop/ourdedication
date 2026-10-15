/* ═══════════════════════════════════════════════════════
   OurDedication — লাইভ বুক লোডার (ভার্সন + বদলের হিসাব)

   অ্যাডমিন প্যানেল থেকে বই সেভ করলেই Firebase-এ siteConfig/bookListVer
   (একটা ছোট টাইমস্ট্যাম্প) বদলায়, আর siteConfig/bookListDelta-তে লেখা
   থাকে কোন ক্রমিকের বই কখন বদলাল। book.js ডাউনলোডের সময় সেই ভার্সন
   ফাইলের ভেতরে বসে যায় (OD_BOOKS_V)। সাইট শুধু ছোট সংখ্যাটা মেলায়:
     • মিলে গেলে → book.js-ই সর্বশেষ, আর কিছু নামাতে হয় না
     • না মিললে → book.js-এর পরে যে কয়টা বই বদলেছে শুধু সেগুলো আনে
       (প্রতিটা ~আধা KB); হিসাব না মিললে পুরো লিস্ট একবার নামিয়ে
       ব্রাউজারের Cache-এ রাখে, পরের পেজগুলোতে আর নামায় না
   ভার্সন যাচাই ৬০ সেকেন্ডে একবার।

   নিরাপত্তা: বইয়ের লেখা (নাম, লেখক ইত্যাদি) পেজে HTML হিসেবে বসে,
   তাই এখানে < > " সরিয়ে দেওয়া হয় — কারো অ্যাকাউন্ট থেকে ক্ষতিকর
   কোড বইয়ের ডেটায় ঢুকলেও সাইটে চলবে না।

   এই ফাইলটা book.js আর firebase-config.js এর *পরে* লোড করতে হবে।
═══════════════════════════════════════════════════════ */
(function () {
    var VER_KEY = 'od_booklist_ver_chk';   /* {v, t} — ভার্সন চেক ৬০ সেকেন্ড মনে রাখা */
    var CACHE_NAME = 'od-booklist';
    var VER_TTL = 60 * 1000;
    var fileVer = (typeof OD_BOOKS_V === 'number') ? OD_BOOKS_V : null;

    function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
    function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
    /* আগের সংস্করণের localStorage ক্যাশ (১-২ MB) মুছে জায়গা খালি করি */
    ['od_booklist_cache_v1', 'od_booklist_data_v2', 'od_booklist_meta_v2', 'od_booklist_checked'].forEach(function (k) {
        try { localStorage.removeItem(k); } catch (e) {}
    });

    /* জায়গাতেই (in-place) বদলানো হয়, আর শুধু যেখানে দরকার — ৪০০০+ বইয়েও কয়েক মিলিসেকেন্ড */
    var BAD = /[<>"]/;
    function cleanStr(s) { return s.replace(/[<>]/g, '').replace(/"/g, '”'); }
    function cleanIn(o) {
        for (var k in o) {
            var v = o[k];
            if (typeof v === 'string') { if (BAD.test(v)) o[k] = cleanStr(v); }
            else if (v && typeof v === 'object') cleanIn(v);
        }
    }
    function cleanBook(b) {
        if (!b || typeof b !== 'object' || !b.bid) return null;
        cleanIn(b);
        if (typeof b.bid !== 'string') b.bid = String(b.bid);
        if (/['\\`]/.test(b.bid)) b.bid = b.bid.replace(/['\\`]/g, '');
        if (typeof b.price !== 'number') b.price = Number(b.price) || 0;
        if (typeof b.original_price !== 'number') b.original_price = Number(b.original_price) || 0;
        if (!b.img || !/^https?:\/\//.test(b.img)) b.img = 'book-placeholder.svg';
        return b;
    }
    function toArr(data) {
        if (Array.isArray(data)) return data.filter(Boolean);
        if (data && typeof data === 'object') return Object.values(data).filter(Boolean);
        return null;
    }
    /* একই অ্যারে-তে বদল — সব পেজের রেফারেন্স ঠিক থাকে */
    function applyBooks(arr) {
        if (!arr || !arr.length || typeof books === 'undefined' || !Array.isArray(books)) return false;
        var cleaned = [];
        for (var i = 0; i < arr.length; i++) { var b = cleanBook(arr[i]); if (b) cleaned.push(b); }
        if (!cleaned.length) return false;
        books.length = 0;
        for (var j = 0; j < cleaned.length; j++) books.push(cleaned[j]);
        return true;
    }

    // book.js আগে থেকেই পেজে আছে — তার ডেটাও একবার পরিষ্কার করে নেওয়া হয়
    if (typeof books !== 'undefined' && Array.isArray(books)) applyBooks(books.slice());

    if (!window.OD_DB_URL) { // firebase-config.js এখনো বসানো হয়নি
        window.OD_BOOKS_LIVE = Promise.resolve(false);
        window.OD_BOOKS_REFRESH = function () { return Promise.resolve(false); };
        return;
    }
    var BASE = window.OD_DB_URL.replace(/\/$/, '') + '/';

    function getVer(force) {
        if (!force) {
            try {
                var c = JSON.parse(lsGet(VER_KEY) || 'null');
                if (c && Date.now() - c.t < VER_TTL) return Promise.resolve(c.v);
            } catch (e) {}
        }
        return fetch(BASE + 'siteConfig/bookListVer.json')
            .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
            .then(function (v) { lsSet(VER_KEY, JSON.stringify({ v: v, t: Date.now() })); return v; });
    }

    /* Cache API — async, বড় ডাটা রাখা যায়, মেইন থ্রেড আটকায় না */
    function cacheUrl(ver) { return '/__od_booklist__/' + ver; }
    function readCache(ver) {
        if (!window.caches) return Promise.resolve(null);
        return caches.open(CACHE_NAME)
            .then(function (c) { return c.match(cacheUrl(ver)); })
            .then(function (r) { return r ? r.json() : null; })
            .catch(function () { return null; });
    }
    function writeCache(ver, arr) {
        if (!window.caches) return;
        caches.open(CACHE_NAME).then(function (c) {
            /* শুধু সর্বশেষ ভার্সনটা রাখি */
            return c.keys().then(function (keys) {
                return Promise.all(keys.map(function (k) { return c.delete(k); }));
            }).then(function () {
                return c.put(cacheUrl(ver), new Response(JSON.stringify(arr), { headers: { 'Content-Type': 'application/json' } }));
            });
        }).catch(function () {});
    }

    /* বড় লিস্টটা পেজ (ব্যানার/ছবি) লোড শেষ হওয়ার পরে আনা হয় — শুরুতে ব্যান্ডউইথ নিয়ে টানাটানি না হয় */
    function afterLoad() {
        return new Promise(function (res) {
            if (document.readyState === 'complete') res();
            else window.addEventListener('load', function () { res(); }, { once: true });
        });
    }
    function fetchFull(ver) {
        return afterLoad().then(function () { return fetch(BASE + 'bookList.json'); })
            .then(function (r) { return r.ok ? r.json() : null; })
            .then(function (data) {
                var arr = toArr(data);
                if (!arr || !arr.length) return false;
                writeCache(ver, arr);
                return applyBooks(arr);
            })
            .catch(function () { return false; });
    }

    /* শুধু বদলানো বইগুলো আনা: অ্যাডমিন siteConfig/bookListDelta-তে লিখে রাখে কোন ক্রমিকের বই কখন বদলাল।
       book.js-এর পরে যেগুলো বদলেছে শুধু সেগুলো এনে তালিকায় বসাই। হিসাব না থাকলে, বেশি বদল হলে, বা কোনো
       বইয়ের আইডি না মিললে → null, তখন পুরো তালিকা। */
    function fetchDelta(ver) {
        if (!fileVer || typeof books === 'undefined' || !Array.isArray(books) || !books.length) return Promise.resolve(null);
        return fetch(BASE + 'siteConfig/bookListDelta.json')
            .then(function (r) { return r.ok ? r.json() : null; })
            .then(function (d) {
                if (!d || !d.base || d.base > fileVer) return null;
                var items = d.items || {};
                var idx = Object.keys(items).filter(function (k) { return items[k] > fileVer; }).map(Number).sort(function (a, b) { return a - b; });
                if (!idx.length || idx.length > 150 || idx.some(isNaN)) return null;
                return Promise.all(idx.map(function (i) {
                    return fetch(BASE + 'bookList/' + i + '.json').then(function (r) { return r.ok ? r.json() : Promise.reject(); });
                })).then(function (list) {
                    var arr = books.slice();
                    for (var k = 0; k < idx.length; k++) {
                        var i = idx[k], v = list[k];
                        if (!v || typeof v !== 'object') return null;                       /* বই মোছা → পুরোটা */
                        if (i < arr.length) {
                            var cur = arr[i];
                            if (cur && cur.bid && v.bid && String(cur.bid) !== String(v.bid)) return null;   /* ক্রম সরে গেছে */
                            arr[i] = v;
                        } else if (i === arr.length) arr.push(v);
                        else return null;                                                   /* মাঝে ফাঁক */
                    }
                    writeCache(ver, arr);
                    return applyBooks(arr);
                });
            })
            .catch(function () { return null; });
    }

    function load(force) {
        return getVer(force).then(function (ver) {
            /* book.js-এর সাথে মিলে গেছে → book.js-ই সর্বশেষ */
            if (ver !== null && ver !== undefined && ver === fileVer) return false;
            /* Firebase-এ ভার্সন এখনো বসেনি (নতুন অ্যাডমিন থেকে প্রথম সেভ/book.js ডাউনলোডের আগে):
               book.js নতুন হলে সেটাই; নইলে লাইভ লিস্ট — ঘণ্টায় একবারই নামে (Cache-এ রাখা) */
            if (ver === null || ver === undefined) {
                if (fileVer) return false;
                ver = 'nover-' + Math.floor(Date.now() / 3600e3);
            }
            return readCache(ver).then(function (arr) {
                if (arr && arr.length) return applyBooks(arr);
                return fetchDelta(ver).then(function (ok) { return ok === null ? fetchFull(ver) : ok; });
            });
        }).catch(function () { return false; });
    }

    /* OD_BOOKS_LIVE: পেজ প্রথমবার দেখানোর পরে books বদলালে true দেয় — তখন পেজগুলো আবার রেন্ডার করে।
       OD_BOOKS_REFRESH(): দরকার হলে (যেমন প্রোডাক্ট পেজে বই না পেলে) ভার্সন আবার যাচাই করে নতুন ডেটা আনে। */
    window.OD_BOOKS_LIVE = load(false);
    window.OD_BOOKS_REFRESH = function () { return load(true); };
})();
