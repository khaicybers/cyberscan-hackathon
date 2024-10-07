const textMapping = {
    'safe': 'Trang Web Này An Toàn',
    'warning': 'Trang Web Có Thể Không An Toàn',
    'danger': 'ĐÂY LÀ TRANG WEB NGUY HIỂM'
}

const colorPack = {
    'safe': 'limegreen',
    'warning': '#fcd92d',
    'danger': 'red'
}

const defaultResult = {
    'result': 'safe',
    'description': '',
    'canReport': true
}

const reportOptions = {
    '1': 'Lừa Đảo',
    '2': 'Giả Mạo',
    '3': 'Nội Dung Không Lành Mạnh',
    '99': 'Khác'
}

const heightFix = 40


const getCurrentURL = (callback) => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const currentURL = tabs[0].url
        callback(new URL(currentURL))
    })
}


const fetchData = (callback, domain) => {
    $.ajax({
        url: 'https://backend.camchua.moe/app/yiyi/cprotect',
        type: 'post',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({ domain: domain }),
        success: function(res) {
            callback(res.data ? res.data : defaultResult)
        },
        error: function(res) {
            callback(res)
        }
    })
}

const reportWeb = (callback, domain, reason, message = '') => {
    $.ajax({
        url: 'https://backend.camchua.moe/app/yaya/creport',
        type: 'post',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({ domain: domain, reason: reason, message: message }),
        success: function(res) {
            callback(res)
        },
        error: function(res) {
            callback(res)
        }
    })
}

const scanWeb = (callback, domain) => {
    $.ajax({
        url: 'https://backend.camchua.moe/app/yaya/cscan',
        type: 'post',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({ domain: domain }),
        success: function(res) {
            callback(res)
        },
        error: function(res) {
            callback(res)
        }
    })
}


const loaderStatus = (result) => {
    let loader = document.getElementsByClassName('loader')[0]
    loader.style.background = colorPack[result]
}
