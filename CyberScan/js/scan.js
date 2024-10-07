document.getElementById('scanForm').addEventListener('submit', async function(e) {
    e.preventDefault()

    let formArray = $("#scanForm").serializeArray()
    let formData = {}
    formArray.forEach(function(field) {
        formData[field.name] = field.value
    })

    let domain = formData.domain
    await scan({ origin: domain })
})


let scanning = false

const scan = async (url) => {
    if(scanning) return
    let main = document.getElementById('result')
    main.innerHTML = ''

    let waitingElement = document.createElement('p')
    waitingElement.classList.add('text-bold')
    waitingElement.classList.add('text-center')
    waitingElement.classList.add('status')
    waitingElement.innerText = 'Đang quét tên miền vui lòng chờ...'
    main.appendChild(waitingElement)

    let loadingElement = document.createElement('span')
    loadingElement.classList.add('loading')
    loadingElement.classList.add('centered')
    main.appendChild(loadingElement)

    scanning = true
    rescan(url)
}

let resultImage = null
let image = null

const rescan = async (url) => {
    scanWeb(async _scan => {
        if(_scan.retcode != 0) {
            if(_scan.retcode == 20003) {
                let main = document.getElementById('result')
                main.innerHTML = ''
                let failElement = document.createElement('p')
                failElement.classList.add('text-bold')
                failElement.classList.add('text-center')
                failElement.classList.add('status')
                failElement.innerText = 'Tên miền không hợp lệ, vui lòng nhập tên miền khác'
                main.appendChild(failElement)
                scanning = false
                return
            }
            await new Promise(r => setTimeout(r, 1000))
            await rescan(url)
            return
        }
        await new Promise(r => setTimeout(r, 5000))
        fetchData(data => {
            let main = document.getElementById('result')
            loaderStatus(data.result)
            main.innerHTML = ''

            let resultImgElement = document.createElement('img')
            resultImgElement.classList.add('result-img')
            resultImgElement.src = './image/' + data.result + '.png'
            main.appendChild(resultImgElement)
    
            let statusElement = document.createElement('p')
            statusElement.classList.add('text-bold')
            statusElement.classList.add('text-center')
            statusElement.classList.add('status')
            statusElement.style.color = colorPack[data.result]
            statusElement.innerText = textMapping[data.result]
            main.appendChild(statusElement)
    
            let descriptionElement = document.createElement('p')
            descriptionElement.classList.add('text-center')
            descriptionElement.innerText = data['totalReport'] ? `Trang này đã nhận ${data['totalReport']} báo cáo từ người dùng. Trong đó có ${data['maxReport']} báo cáo với lý do ${reportOptions[data['maxReportReason']]}` : data.description
            main.appendChild(descriptionElement)
    
            if(_scan.data != 'none') {
                image = _scan.data
                resultImage = document.createElement('img')
                resultImage.classList.add('result-screenshot')
                resultImage.src = _scan.data
                main.appendChild(resultImage)
                resultImage.style.display = "block"
                resultImage.style.margin = "auto"
                resultImage.style.maxWidth = "100%"
                resultImage.style.height = "auto"
                resultImage.style.borderRadius ="10px"
            }
    
            document.getElementsByTagName('body')[0].style.height = (main.offsetHeight + heightFix) + 'px'
            scanning = false
        }, url.origin)
    }, url.origin)
}


setInterval(function() {
    if(resultImage && image) {
        resultImage.src = image + '?v=' + Math.random()
    }
}, 1000)
