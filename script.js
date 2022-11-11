const r = new snoowrap({
    userAgent: "r/HFY Client at https://FloralwhiteStableKeygen.justa6.repl.co",
    accessToken: "-BiIV3tEsPkxzj5iYFHmGCW6W09HWIA"
});
let output = document.querySelector("#output");
function renderPost(post) {
    console.log(post);

    output.innerHTML += `<div class="post">${post.title} - submitted by ${post.author.name}<br><br>${post.selftext_html.replace(/https:\/\/www\.reddit\.com\/r\/HFY\/comments\//g, '?')}</div>`;
    output.innerHTML += "<br>";
}
let loadmore = document.querySelector("#querymore");
let loading = document.querySelector("#loading");
let searchInput = document.querySelector("#search");
let list
let search = location.search.slice(1).split('/')[0]
let homepageloadcancelled = false
if (search === "") {
    r.getSubreddit("HFY")
        .getNew()
        .then((listing) => {
            if (homepageloadcancelled) return;
            listing.forEach(renderPost)
            loadmore.style.display = ''
            loading.style.display = 'none';
            list = listing
        });
} else {
    r.getSubmission(search).fetch().then((submission) => {
        if (homepageloadcancelled) return;

        renderPost(submission)
        loading.style.display = 'none';
    }).catch((err) => {
        if (homepageloadcancelled) return;

        console.log(err);
        output.innerHTML = `<div class="error">Error: Post ${search} is not found.</div>`
    })
}
function load() {
    loading.style.display = ''
    loading.innerText = 'Loading'
}
function stopload() {
    loading.style.display = 'none'
}
function querymore() {
    homepageloadcancelled = true
    load()
    loadmore.style.display = 'none'
    list.fetchMore({ append: false, amount: 30 }).then((listing) => {
        listing.forEach(renderPost)
        loadmore.style.display = ''
        stopload()
    });
}
setInterval(() => {
    loading.innerHTML += '.'
}, 200);

searchInput.onkeydown = (k) => {    
    searchInput.setSelectionRange(searchInput.value.length, searchInput.value.length);
    searchInput.focus();
    if (k.keyCode === 13) {
        loadmore.style.display = 'none'
        load()
        output.innerHTML = ''
        r.getSubreddit("HFY").search({ query: searchInput.value, sort: "hot" }).then((listing) => {
            listing.forEach(renderPost)
            loadmore.style.display = ''
            stopload()
            list = listing
        });
    }
}