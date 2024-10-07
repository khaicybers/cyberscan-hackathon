let reporting = false


const getStorage = (callback) => {
    chrome.storage.sync.get('data', function(data) {
        callback(data.data ? data.data : {})
    })
}

const setStorage = (data) => {
    chrome.storage.sync.set({ data }, function() {
        
    })
}


document.addEventListener('DOMContentLoaded', function() {
    let url = new URL(window.location.href)
    let params = new URLSearchParams(url.search)
    let result = params.get('r')

	console.log(result)
    loaderStatus(result)

    let main = document.getElementById('main')
    getStorage(data => {
        if(!data.report) data.report = []

        getCurrentURL(url => {
            let urlElement = document.createElement('p')
            urlElement.classList.add('url')
            urlElement.innerText = url.origin
            main.appendChild(urlElement)
    
            let lineElement = document.createElement('div')
            lineElement.classList.add('line')
            lineElement.classList.add('line-' + result)
            lineElement.classList.add('centered')
            main.appendChild(lineElement)
    
            let formReport = document.createElement('form')
            formReport.classList.add('centered')
    
            let reasonLabel = document.createElement('p')
            reasonLabel.classList.add('text-bold')
            reasonLabel.classList.add('text-center')
            reasonLabel.style.marginBottom = '0'
            reasonLabel.innerText = 'Lý Do Báo Cáo'
    
            let selector = document.createElement('select')
            selector.classList.add('centered')
            selector.style.marginBottom = '10px'
    
            for(let option in reportOptions) {
                if(parseInt(option) > 99) continue
                let opt = document.createElement('option')
                opt.value = option
                opt.innerText = reportOptions[option]
                selector.appendChild(opt)
            }
    
            formReport.appendChild(reasonLabel)
            formReport.appendChild(selector)

            let reportMessage = document.createElement('input')
            reportMessage.classList.add('centered')
            reportMessage.style.marginBottom = '10px'
            reportMessage.style.width = '250px'
            reportMessage.style.display = 'none'
            formReport.appendChild(reportMessage)

            selector.addEventListener('change', function() {
                if(selector.value == 99) {
                    reportMessage.style.display = 'block'
                } else {
                    reportMessage.style.display = 'none'
                }
                document.getElementsByTagName('body')[0].style.height = (main.offsetHeight + heightFix) + 'px'
            })

            main.appendChild(formReport)

            let reportResult = document.createElement('p')
            reportResult.classList.add('text-bold')
            reportResult.classList.add('text-center')
    
            let reportButton = document.createElement('button')
            reportButton.classList.add('report')
            reportButton.classList.add('centered')
            reportButton.innerText = 'Báo Cáo'
            reportButton.addEventListener('click', function() {
                if(reporting) return
                reporting = true

                if(data.report.includes(url.origin)) {
                    reportResult.innerText = 'Bạn đã báo cáo trang này trước đó rồi'
                    document.getElementsByTagName('body')[0].style.height = (main.offsetHeight + heightFix) + 'px'
                    reporting = false
                } else {
                    let reason = selector.value
                    reportWeb(res => {
                        if(res.retcode != 0) {
                            reportResult.innerText = retcode.message
                        } else {
                            data.report.push(url.origin)
                            setStorage(data)
                            reportResult.innerText = 'Báo cáo trang thành công'
                        }

                        document.getElementsByTagName('body')[0].style.height = (main.offsetHeight + heightFix) + 'px'
                        reporting = false
                    }, url.origin, reason, reportMessage.value)
                }
            })
            main.appendChild(reportButton)
            main.appendChild(reportResult)
    
            document.getElementsByTagName('body')[0].style.height = (main.offsetHeight + heightFix) + 'px'
        })
    })
})
