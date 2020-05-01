class Compile {
    constructor(el, vm) {
        this.$vm = vm;
        this.$el = document.querySelector(el);
        
        if(this.$el) {
            this.$fragment = this.node2Fragment(this.$el);
            this.compile(this.$fragment);
            this.$el.appendChild(this.$fragment);
        }
    }

    /**
     * 节点转移至Fragment片段，避免DOM更新，提高效率
     * @param {*} el 被挂载到实例的元素
     */
    node2Fragment(el) {
        const fragment = document.createDocumentFragment();
        let child;
        while(child = el.firstChild) {
            fragment.appendChild(child);
        }

        return fragment;
    }

    compile(el) {
        const childNodes = el.childNodes;
        Array.from(childNodes).forEach(node => {
            if(this.isElement(node)) {
              const attrs = node.attributes;
              Array.from(attrs).forEach(attr => {
                  const attrName = attr.name;
                  const exp = attr.value;
                  if(this.isDirecitve(attrName)) {
                      const dir = attrName.substring(2);
                    this.update(node, this.$vm, exp, dir);
                  }
              })
            }else if(this.isInterpolation(node)) {
                this.update(node, this.$vm, RegExp.$1, 'text');
            }

            // 元素内仍有子元素，则递归调用 compile 编译节点
            if(node.childNodes && node.childNodes.length > 0) {
                this.compile(node);
            }
        })
    }

    /**
     * 根据类型，调用不同的更新方法更新元素属性的值
     * @param {*} node 元素节点
     * @param {*} vm vue实例
     * @param {*} exp 被绑定的属性
     * @param {*} type 更新类型
     */
    update(node, vm, exp, type) {
        const updateFn = this[type+'Update'];
        updateFn && updateFn(node, vm.$data[exp]);

        // vue实例化 compile 时将更新函数放入回调，在修改model触发set时会被再次调用
        new Watcher(vm, exp, function(value) {
            updateFn && updateFn(node, value);
        })
    }


    /**
     * 更新元素文本内容
     * @param {*} node 
     * @param {*} val 
     */
    textUpdate(node, val) {
        node.textContent = val;
    }

    /**
     * 判断是否为标签元素 
     * @param {*} node 
     */
    isElement(node) {
        return node.nodeType === 1;
    }

    /**
     * 判断是否为插值 
     * @param {*} node 
     */
    isInterpolation(node) {
        return (node.nodeType === 3) && /\{\{\s*(\S*)\s*\}\}/.test(node.textContent);
    }

    isDirecitve(attr) {
        return attr.indexOf('v-') === 0;
    }
}