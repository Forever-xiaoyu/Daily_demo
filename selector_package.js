/**
 * created by yuce 2018-9-30
 */

(function (window) {
    let query = null,
        selectorArr = [], //save selectors
        utils = {} //internal use, not for external use

    query = function (selector) {
        selectorArr = []
        if(selector.nodeType == 1) {//elementNode
            let tagName = selector.tagName || ''
            let className = selector.className && selector.className.split(" ").join(".") || ''
            let id = selector.getAttribute('id') || ''
            let queryName = tagName + className?('.'+className):'' + id?('#'+id):''
            document.querySelectorAll(`${tagName}.${className}`).forEach(item => {
                selectorArr.push(item)
            })
            console.log(selectorArr)
        } else if (typeof(selector) === "string") {//string
            document.querySelectorAll(selector).forEach(item => {
                selectorArr.push(item)
            })
        }
        return new query.prototype.init()
    }

    query.fn = query.prototype = {
        init: function () {
            return this
        },

        addClass: function (className) {
            if(typeof(className) === "string") {
                if(utils.getType(selectorArr) === "Array") {
                    for(let i = 0; i < selectorArr.length; i++) {
                        selectorArr[i].className += ` ${className}`
                    }
                } else {
                    selectorArr[0].className += ` ${className}`
                }
            }
            return this
        },

        removeClass: function (className) {
            if(typeof(className) === "string") {
                if (utils.getType(selectorArr) === "Array") {
                    let reg = new RegExp(className, "ig")
                    for (let i = 0; i < selectorArr.length; i++) {
                        selectorArr[i].className = selectorArr[i].className.replace(reg, '')
                    }
                } else {
                    selectorArr[0].className += ` ${className}`
                }
            }
            return this
        },

        toggleClass: function (className) {
            if(typeof(className) === "string") {
                if (selectorArr[0].className.indexOf(className) == -1) {
                    this.addClass(className)
                } else {
                    this.removeClass(className)
                }
            }
            return this
        },

        append: function (elementNode) {
            if(elementNode.nodeType == 1 && selectorArr.length > 0) {
                selectorArr[0].appendChild(elementNode)
            }
        },

        remove: function (elementNode) {
            if(elementNode.nodeType == 1 && selectorArr.length > 0) {
                selectorArr[0].removeChild(elementNode)
            }
        },

        click: function (clickHandler) {
            if(utils.getType(selectorArr) === "Array") {
                for(let i = 0; i < selectorArr.length; i++) {
                    selectorArr[i].onclick = clickHandler
                }
            } else {
                selectorArr[0].onclick = clickHandler
            }
            return this
        },

        ajax: function (options) {
            let url = options.url || ''
            let type = options.type || 'GET'
            let dataType = options.dataType || 'json'

            if(dataType === 'jsonp') {
                let callback = options.jsonpCallback || 'callback'
                let success = options.success
                let fail = options.fail
                let result
                let script = document.createElement('script')
                script.setAttribute('src', `${url}&callback=${callback}`)
                query('body').append(script)
                window[callback] = res => {
                    result = res
                    success(result)
                    query('body').remove(script)
                }
                //more than 3s no data, then request failed
                setTimeout(() => {
                    if(!result) {
                        fail("request failed ..")
                        query('body').remove(script)
                    }
                }, 3000)
            }
        }
    }

    utils = {
        getType: function (data) {
            return Object.prototype.toString.call(data).slice(8,-1)
        }
    }

    query.prototype.init.prototype = query.fn //query.prototype

    window.query = query
})(window)