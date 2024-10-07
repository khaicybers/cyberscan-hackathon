document.addEventListener('DOMContentLoaded', function() {
    //document.getElementById('cyberScan').click()

    let main = document.getElementById('main')
    getCurrentURL(url => {
        fetchData(data => {
            loaderStatus(data.result)

            let urlElement = document.createElement('p')
            urlElement.classList.add('url')
            urlElement.innerText = url.origin
            main.appendChild(urlElement)

            let lineElement = document.createElement('div')
            lineElement.classList.add('line')
            lineElement.classList.add('line-' + data.result)
            lineElement.classList.add('centered')
            main.appendChild(lineElement)

            let resultImgElement = document.createElement('img')
            resultImgElement.classList.add('result-img')
            resultImgElement.src = '/image/' + data.result + '.png'
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

            // if(data.canReport) {
                let reportButton = document.createElement('button')
                reportButton.classList.add('report')
                reportButton.classList.add('centered')
                reportButton.innerText = 'Quét Trang Khác'
                reportButton.addEventListener('click', function() {
                    window.open('/scan.html', '_blank')
                })
                main.appendChild(reportButton)
            // }

            document.getElementsByTagName('body')[0].style.height = (main.offsetHeight + heightFix) + 'px'
        }, url.origin)
    })
})
