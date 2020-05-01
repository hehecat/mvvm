class Vue {
    constructor(options) {
        this.$options = options;
        this.$data = options.data;

        // 数据响应化
        new Observer(this.$data, this);
        // 编译节点
        new Compile(options.el, this);


    }
}

// 观察 Data 中的所有属性，并对被依赖的属性进行依赖收集
class Observer {
    constructor(obj, vm) {
        this.$vm = vm;
        this.observer(obj);
    }

    observer(obj) {

    }
}

// 依赖收集，每个被依赖的obj都对应一个Dep，其中可以有多个Watcher
class Dep {
    constructor() {
        this.deps = [];
    }

    addDep(dep) {
        this.deps.push(dep);
    }

    notify() {
        this.deps.forEach(dep => {
            dep.update();
        })
    }
}


// 任何使用到 data 中对象的元素都是依赖， 每个依赖都对应一个Watcher。每实例化一个Watcher都会被添加至对应 obj 的Dep中
class Watcher {
    constructor() {

    }

    update() {

    }
}